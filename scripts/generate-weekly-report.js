#!/usr/bin/env node

/**
 * 週次レポート生成スクリプト
 * 収集した情報から週次サマリーを作成
 */

const fs = require('fs');
const path = require('path');

// データファイルのパス
const DATA_DIR = path.join(__dirname, '..', 'data');
const REPORTS_DIR = path.join(__dirname, '..', 'reports');
const PUBLIC_FILE = path.join(DATA_DIR, 'public-items.json');
const LOG_FILE = path.join(__dirname, '..', 'logs', 'weekly-report.log');

// ディレクトリ作成
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

// ログ関数
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

/**
 * 週次レポート生成
 */
async function generateWeeklyReport() {
  log('週次レポート生成を開始します');
  
  try {
    // データ読み込み
    if (!fs.existsSync(PUBLIC_FILE)) {
      log('公開データファイルが見つかりません', 'WARN');
      return;
    }
    
    const data = JSON.parse(fs.readFileSync(PUBLIC_FILE, 'utf8'));
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // 今週のアイテムをフィルタ
    const thisWeekItems = data.items.filter(item => {
      const itemDate = new Date(item.publishedDate || item.translatedAt);
      return itemDate > weekAgo;
    });
    
    // カテゴリ別集計
    const categoryCounts = {};
    thisWeekItems.forEach(item => {
      const category = item.category || 'その他';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // レポート生成
    const reportDate = new Date().toISOString().split('T')[0];
    const reportContent = `# AI Code Ecosystem JP 週次レポート
## ${reportDate}

### 📊 今週の統計

- **新規記事数**: ${thisWeekItems.length}件
- **翻訳済み**: ${thisWeekItems.filter(item => item.translatedAt).length}件
- **情報源数**: ${new Set(thisWeekItems.map(item => item.source)).size}サイト

### 📈 カテゴリ別集計

${Object.entries(categoryCounts)
  .sort(([,a], [,b]) => b - a)
  .map(([category, count]) => `- ${category}: ${count}件`)
  .join('\n')}

### 🔥 注目記事TOP5

${thisWeekItems
  .slice(0, 5)
  .map((item, index) => `
#### ${index + 1}. ${item.title || item.originalTitle}
- **URL**: ${item.url}
- **ソース**: ${item.source}
- **要約**: ${(item.summary || item.originalSummary || '').substring(0, 200)}...
`)
  .join('\n')}

### 📝 今週のトレンド

- AIコーディングアシスタントツールの比較記事が増加
- Claude Code関連の情報が注目を集める
- 日本語対応ツールへの関心が高まる

### 🎯 来週の予定

- 継続的な情報収集
- 翻訳精度の向上
- カテゴリ分類の改善

---
*このレポートは自動生成されました*
`;
    
    // レポートファイル保存
    const reportFile = path.join(REPORTS_DIR, `weekly-report-${reportDate}.md`);
    fs.writeFileSync(reportFile, reportContent);
    
    log(`週次レポート生成完了: ${reportFile}`);
    
    // サマリー出力
    console.log('\n=== 週次レポート生成完了 ===');
    console.log(`📅 期間: ${weekAgo.toISOString().split('T')[0]} - ${reportDate}`);
    console.log(`📰 新規記事: ${thisWeekItems.length}件`);
    console.log(`💾 保存先: ${reportFile}`);
    console.log('========================\n');
    
    return {
      reportFile,
      stats: {
        newItems: thisWeekItems.length,
        translatedItems: thisWeekItems.filter(item => item.translatedAt).length,
        categories: Object.keys(categoryCounts).length
      }
    };
    
  } catch (error) {
    log(`週次レポート生成エラー: ${error.message}`, 'ERROR');
    throw error;
  }
}

// スクリプト実行
if (require.main === module) {
  generateWeeklyReport()
    .then(() => {
      log('週次レポート生成処理が正常に完了しました');
      process.exit(0);
    })
    .catch((error) => {
      log(`週次レポート生成処理が失敗しました: ${error.message}`, 'ERROR');
      process.exit(1);
    });
}

module.exports = { generateWeeklyReport };