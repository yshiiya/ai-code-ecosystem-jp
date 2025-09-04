#!/usr/bin/env node

/**
 * Claude APIを使用した翻訳・要約スクリプト
 * 英語のAI情報を日本語に翻訳し、要約を生成
 */

const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// Claude APIクライアントの初期化
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

// データディレクトリのパス
const DATA_DIR = path.join(__dirname, '..', 'data');
const COLLECTED_FILE = path.join(DATA_DIR, 'collected-items.json');
const TRANSLATED_FILE = path.join(DATA_DIR, 'translated-items.json');
const LOG_FILE = path.join(__dirname, '..', 'logs', 'translation.log');

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
 * Claude APIを使用して翻訳と要約を実行
 */
async function translateWithClaude(text, type = 'translate') {
  try {
    const systemPrompt = type === 'translate' 
      ? '技術文書の翻訳者として、正確で自然な日本語に翻訳してください。技術用語は適切に扱い、必要に応じて英語を併記してください。'
      : '技術記事の要約者として、重要なポイントを3-5文で簡潔にまとめてください。技術的な正確性を保ちながら、わかりやすく説明してください。';

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: type === 'translate' 
            ? `次のテキストを日本語に翻訳してください:\n\n${text}`
            : `次のテキストを日本語で要約してください:\n\n${text}`
        }
      ],
      temperature: 0.3 // より確実な翻訳のため低めの温度設定
    });

    return message.content[0].text;
  } catch (error) {
    log(`Claude API error: ${error.message}`, 'ERROR');
    throw error;
  }
}

/**
 * バッチ処理で複数のアイテムを翻訳
 */
async function processBatch(items, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(items.length/batchSize)}`);
    
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        try {
          // タイトルの翻訳
          const translatedTitle = await translateWithClaude(item.title, 'translate');
          
          // 要約の生成（既存の要約がある場合）
          let translatedSummary = '';
          if (item.summary) {
            translatedSummary = await translateWithClaude(item.summary, 'summarize');
          }
          
          return {
            ...item,
            originalTitle: item.title,
            title: translatedTitle,
            originalSummary: item.summary,
            summary: translatedSummary,
            translatedAt: new Date().toISOString(),
            translationModel: 'claude-3.5-sonnet'
          };
        } catch (error) {
          log(`Failed to translate item: ${item.title}`, 'ERROR');
          return {
            ...item,
            translationError: error.message,
            translatedAt: new Date().toISOString()
          };
        }
      })
    );
    
    results.push(...batchResults);
    
    // APIレート制限を考慮した待機
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return results;
}

/**
 * メイン処理関数
 */
async function main() {
  log('翻訳・要約処理を開始します');
  
  // APIキーの確認
  if (!process.env.ANTHROPIC_API_KEY) {
    log('ANTHROPIC_API_KEY is not set. Skipping translation.', 'WARN');
    console.log('⚠️  ANTHROPIC_API_KEYが設定されていません');
    console.log('環境変数を設定してください: export ANTHROPIC_API_KEY=your-api-key');
    return;
  }
  
  try {
    // 収集済みデータの読み込み
    if (!fs.existsSync(COLLECTED_FILE)) {
      log('No collected data found. Run collect-ai-info.js first.', 'WARN');
      return;
    }
    
    const collectedData = JSON.parse(fs.readFileSync(COLLECTED_FILE, 'utf8'));
    const items = collectedData.items || [];
    
    if (items.length === 0) {
      log('No items to translate', 'INFO');
      return;
    }
    
    log(`Found ${items.length} items to translate`);
    
    // 未翻訳のアイテムをフィルタ
    let existingTranslations = { items: [] };
    if (fs.existsSync(TRANSLATED_FILE)) {
      existingTranslations = JSON.parse(fs.readFileSync(TRANSLATED_FILE, 'utf8'));
    }
    
    const translatedUrls = new Set(
      existingTranslations.items
        .filter(item => item.translatedAt && !item.translationError)
        .map(item => item.url)
    );
    
    const itemsToTranslate = items.filter(item => !translatedUrls.has(item.url));
    
    log(`${itemsToTranslate.length} new items to translate`);
    
    if (itemsToTranslate.length === 0) {
      log('All items are already translated', 'INFO');
      return;
    }
    
    // バッチ処理で翻訳
    const translatedItems = await processBatch(itemsToTranslate);
    
    // 結果を保存
    const updatedData = {
      items: [...translatedItems, ...existingTranslations.items],
      lastUpdated: new Date().toISOString(),
      stats: {
        totalItems: translatedItems.length + existingTranslations.items.length,
        newTranslations: translatedItems.length,
        failedTranslations: translatedItems.filter(item => item.translationError).length
      }
    };
    
    fs.writeFileSync(TRANSLATED_FILE, JSON.stringify(updatedData, null, 2));
    log(`Translation completed. ${translatedItems.length} items processed.`);
    
    // 統計情報を表示
    console.log('\n=== 翻訳結果サマリー ===');
    console.log(`✅ 成功: ${translatedItems.filter(item => !item.translationError).length}件`);
    console.log(`❌ 失敗: ${translatedItems.filter(item => item.translationError).length}件`);
    console.log(`💾 保存先: ${TRANSLATED_FILE}`);
    console.log('========================\n');
    
  } catch (error) {
    log(`Translation process failed: ${error.message}`, 'ERROR');
    throw error;
  }
}

// スクリプト実行
if (require.main === module) {
  main()
    .then(() => {
      log('翻訳処理が正常に完了しました');
      process.exit(0);
    })
    .catch((error) => {
      log(`翻訳処理が失敗しました: ${error.message}`, 'ERROR');
      process.exit(1);
    });
}

module.exports = { translateWithClaude, processBatch };