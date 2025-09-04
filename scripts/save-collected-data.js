#!/usr/bin/env node

/**
 * 収集データ保存スクリプト
 * 収集された情報をデータベースやファイルシステムに保存
 */

const fs = require('fs');
const path = require('path');

// データディレクトリのパス
const DATA_DIR = path.join(__dirname, '..', 'data');
const COLLECTED_FILE = path.join(DATA_DIR, 'collected-items.json');
const TRANSLATED_FILE = path.join(DATA_DIR, 'translated-items.json');
const LOG_FILE = path.join(__dirname, '..', 'logs', 'save-data.log');

// ログディレクトリとデータディレクトリを作成
if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ログ関数
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

/**
 * データを統合して最終ファイルに保存
 */
async function saveCollectedData() {
  log('収集データの保存処理を開始します');
  
  try {
    // 収集データの読み込み
    let collectedData = { items: [], lastUpdated: null };
    if (fs.existsSync(COLLECTED_FILE)) {
      collectedData = JSON.parse(fs.readFileSync(COLLECTED_FILE, 'utf8'));
    }
    
    // 翻訳データの読み込み
    let translatedData = { items: [], lastUpdated: null };
    if (fs.existsSync(TRANSLATED_FILE)) {
      translatedData = JSON.parse(fs.readFileSync(TRANSLATED_FILE, 'utf8'));
    }
    
    // URLベースでデータをマージ
    const translatedMap = new Map(
      translatedData.items.map(item => [item.url, item])
    );
    
    const mergedItems = collectedData.items.map(item => {
      const translatedItem = translatedMap.get(item.url);
      if (translatedItem) {
        return {
          ...item,
          ...translatedItem,
          // 元データを保持
          originalTitle: translatedItem.originalTitle || item.title,
          originalSummary: translatedItem.originalSummary || item.summary
        };
      }
      return item;
    });
    
    // 公開データの生成
    const publicData = {
      items: mergedItems.slice(0, 100), // 最新100件
      lastUpdated: new Date().toISOString(),
      stats: {
        totalItems: mergedItems.length,
        translatedItems: mergedItems.filter(item => item.translatedAt).length,
        categories: [...new Set(mergedItems.map(item => item.category).filter(Boolean))]
      },
      metadata: {
        version: '1.0.0',
        generatedBy: 'AI Code Ecosystem JP',
        dataFormat: 'json',
        encoding: 'utf-8'
      }
    };
    
    // 公開用データファイルに保存
    const publicFile = path.join(DATA_DIR, 'public-items.json');
    fs.writeFileSync(publicFile, JSON.stringify(publicData, null, 2));
    
    // RSS feed生成
    await generateRSSFeed(mergedItems.slice(0, 50));
    
    log(`データ保存完了: ${mergedItems.length}件のアイテム`);
    log(`翻訳済み: ${publicData.stats.translatedItems}件`);
    log(`カテゴリ: ${publicData.stats.categories.length}個`);
    
    return publicData;
    
  } catch (error) {
    log(`データ保存エラー: ${error.message}`, 'ERROR');
    throw error;
  }
}

/**
 * RSS feed生成
 */
async function generateRSSFeed(items) {
  const rssItems = items
    .filter(item => item.publishedDate)
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .slice(0, 20)
    .map(item => `
    <item>
      <title><![CDATA[${item.title || item.originalTitle || 'No Title'}]]></title>
      <link>${item.url}</link>
      <description><![CDATA[${item.summary || item.originalSummary || 'No Description'}]]></description>
      <pubDate>${new Date(item.publishedDate).toUTCString()}</pubDate>
      <guid>${item.url}</guid>
      ${item.category ? `<category>${item.category}</category>` : ''}
    </item>`).join('\n');

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AI Code Ecosystem JP - 最新情報</title>
    <description>日本のAI・コード関連の最新情報をお届け</description>
    <link>https://ai-code-ecosystem-jp.vercel.app</link>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  const rssFile = path.join(DATA_DIR, 'feed.xml');
  fs.writeFileSync(rssFile, rssContent);
  log('RSS feed生成完了');
}

/**
 * データの検証
 */
function validateData(data) {
  if (!data.items || !Array.isArray(data.items)) {
    throw new Error('Invalid data format: items must be an array');
  }
  
  const requiredFields = ['title', 'url'];
  for (const item of data.items.slice(0, 10)) { // 最初の10件をチェック
    for (const field of requiredFields) {
      if (!item[field] && !item.originalTitle) {
        log(`Warning: Missing ${field} in item: ${JSON.stringify(item)}`, 'WARN');
      }
    }
  }
  
  log(`データ検証完了: ${data.items.length}件のアイテムを確認`);
}

// スクリプト実行
if (require.main === module) {
  saveCollectedData()
    .then((data) => {
      validateData(data);
      log('データ保存処理が正常に完了しました');
      console.log('\n=== データ保存結果 ===');
      console.log(`📊 総アイテム数: ${data.stats.totalItems}件`);
      console.log(`🌐 翻訳済み: ${data.stats.translatedItems}件`);
      console.log(`📁 カテゴリ数: ${data.stats.categories.length}個`);
      console.log(`💾 保存場所: ${DATA_DIR}/public-items.json`);
      console.log('====================\n');
      process.exit(0);
    })
    .catch((error) => {
      log(`データ保存処理が失敗しました: ${error.message}`, 'ERROR');
      console.error('❌ データ保存に失敗しました:', error.message);
      process.exit(1);
    });
}

module.exports = { saveCollectedData, generateRSSFeed };