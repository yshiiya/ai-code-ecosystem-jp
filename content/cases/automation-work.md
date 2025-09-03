# 業務効率化：定型作業の自動化

## 概要

Google Workspaceを利用している事務職の方が、Claude AI + Google Apps Scriptを使用して繰り返し作業（メール自動返信システム）を自動化する実践例です。

## 対象者
- Google Workspace利用者
- 定型的なメール対応に時間を取られている事務職
- 手作業の業務を自動化したい方
- プログラミング未経験だが効率化に興味がある方

## 使用ツール
- **Claude AI**: コード生成とロジック設計
- **Google Apps Script**: Google Workspaceの自動化プラットフォーム
- **Gmail API**: メール操作
- **Google Sheets API**: データ管理
- **Google Drive API**: ファイル操作

## 成果物
インテリジェントメール自動返信システム

### 主な機能
1. 受信メールのキーワード自動判定
2. 内容に応じたテンプレート自動選択
3. 顧客データベースの自動更新
4. 送信履歴の記録・管理
5. エラー通知とモニタリング
6. レスポンス時間の分析
7. VIP顧客の特別対応

## 実装手順

### 1. Google Apps Scriptプロジェクトの作成

Claudeに以下のプロンプトでプロジェクト構成を依頼：

```
Google Apps Scriptを使用して、以下の機能を持つメール自動返信システムを作成したいです：

1. 受信したメールの内容を分析
2. キーワードに基づいてカテゴリ分類
3. 適切なテンプレートを選択して返信
4. Google Sheetsに記録

プロジェクトの基本構造とメイン関数を教えてください。
```

### 2. 基本構造の実装

```javascript
// main.gs - メイン処理
/**
 * メール自動返信システム
 * 作成者: 企業事務部
 * 最終更新: 2024年
 */

// 設定定数
const CONFIG = {
  SHEET_ID: 'YOUR_SPREADSHEET_ID', // スプレッドシートID
  TEMPLATE_SHEET: 'Templates',      // テンプレートシート名
  LOG_SHEET: 'EmailLog',           // ログシート名
  CUSTOMER_SHEET: 'Customers',     // 顧客データシート名
  CHECK_INTERVAL: 5,               // チェック間隔（分）
  MAX_EMAILS_PER_RUN: 20          // 一回の実行で処理するメール数上限
};

// キーワード設定
const KEYWORDS = {
  '問い合わせ': ['問い合わせ', 'お問い合わせ', '質問', '相談'],
  '注文': ['注文', '発注', '購入', 'オーダー'],
  '苦情': ['苦情', 'クレーム', '不満', '問題'],
  '資料請求': ['資料', 'カタログ', '価格表', '見積もり'],
  '予約': ['予約', 'reservation', '席'],
  'サポート': ['サポート', 'ヘルプ', 'トラブル', 'エラー']
};

/**
 * メイン処理関数
 * Gmail受信トレイをチェックして自動返信を実行
 */
function processEmails() {
  try {
    console.log('メール処理開始: ' + new Date());
    
    // 未読メールを取得
    const threads = Gmail.Users.Threads.list('me', {
      q: 'is:unread in:inbox',
      maxResults: CONFIG.MAX_EMAILS_PER_RUN
    });
    
    if (!threads.threads || threads.threads.length === 0) {
      console.log('処理対象のメールがありません');
      return;
    }
    
    console.log(`処理対象: ${threads.threads.length}件のメール`);
    
    // 各スレッドを処理
    threads.threads.forEach(thread => {
      try {
        processEmailThread(thread.id);
      } catch (error) {
        console.error(`スレッド処理エラー (ID: ${thread.id}):`, error);
        logError('Thread Processing', error.toString(), thread.id);
      }
    });
    
    console.log('メール処理完了: ' + new Date());
    
  } catch (error) {
    console.error('メイン処理エラー:', error);
    sendErrorNotification('メール処理システムエラー', error.toString());
  }
}

/**
 * 個別メールスレッドの処理
 * @param {string} threadId - メールスレッドID
 */
function processEmailThread(threadId) {
  // メール詳細を取得
  const thread = Gmail.Users.Threads.get('me', threadId);
  const messages = thread.messages;
  
  // 最新の受信メールを処理
  const latestMessage = messages[messages.length - 1];
  
  if (latestMessage.labelIds && latestMessage.labelIds.includes('SENT')) {
    console.log('送信済みメールのためスキップ');
    return;
  }
  
  // メール内容を解析
  const emailData = parseEmail(latestMessage);
  
  // カテゴリを判定
  const category = categorizeEmail(emailData.subject + ' ' + emailData.body);
  
  // 返信が必要かチェック
  if (shouldSendAutoReply(emailData, category)) {
    // 自動返信を送信
    sendAutoReply(emailData, category);
    
    // ログに記録
    logEmailActivity(emailData, category, '自動返信送信');
    
    // 顧客データベース更新
    updateCustomerDatabase(emailData);
  }
  
  // メールを既読にする
  Gmail.Users.Threads.modify('me', threadId, {
    removeLabelIds: ['UNREAD']
  });
}
```

### 3. メール解析・分類機能

```javascript
// emailAnalysis.gs - メール解析関連
/**
 * メール内容を解析してデータを抽出
 * @param {Object} message - Gmailメッセージオブジェクト
 * @return {Object} 解析済みメールデータ
 */
function parseEmail(message) {
  const headers = message.payload.headers;
  const parts = message.payload.parts || [message.payload];
  
  // ヘッダー情報抽出
  const fromHeader = headers.find(h => h.name === 'From');
  const subjectHeader = headers.find(h => h.name === 'Subject');
  const dateHeader = headers.find(h => h.name === 'Date');
  
  // メール本文抽出
  let body = '';
  parts.forEach(part => {
    if (part.mimeType === 'text/plain' && part.body.data) {
      body += Utilities.newBlob(
        Utilities.base64Decode(part.body.data),
        'text/plain'
      ).getDataAsString();
    }
  });
  
  // 送信者情報を解析
  const fromEmail = extractEmailAddress(fromHeader ? fromHeader.value : '');
  const fromName = extractSenderName(fromHeader ? fromHeader.value : '');
  
  return {
    id: message.id,
    threadId: message.threadId,
    from: fromEmail,
    fromName: fromName,
    subject: subjectHeader ? subjectHeader.value : '',
    body: body.substring(0, 1000), // 最初の1000文字
    date: dateHeader ? new Date(dateHeader.value) : new Date(),
    snippet: message.snippet
  };
}

/**
 * メール内容からカテゴリを判定
 * @param {string} text - 分析対象テキスト
 * @return {string} カテゴリ名
 */
function categorizeEmail(text) {
  const lowerText = text.toLowerCase();
  
  // 各カテゴリのキーワードをチェック
  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  // 緊急度判定
  const urgentKeywords = ['緊急', '急ぎ', 'urgent', '至急'];
  const isUrgent = urgentKeywords.some(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  
  if (isUrgent) {
    return '緊急';
  }
  
  return '一般';
}

/**
 * 自動返信の必要性を判定
 * @param {Object} emailData - メールデータ
 * @param {string} category - カテゴリ
 * @return {boolean} 返信必要性
 */
function shouldSendAutoReply(emailData, category) {
  // 営業時間外チェック
  if (!isBusinessHours()) {
    return true; // 営業時間外は自動返信
  }
  
  // 特定カテゴリは常に自動返信
  const alwaysReplyCategories = ['問い合わせ', '資料請求', '予約'];
  if (alwaysReplyCategories.includes(category)) {
    return true;
  }
  
  // 緊急メールは即座に返信
  if (category === '緊急') {
    return true;
  }
  
  // VIP顧客チェック
  if (isVIPCustomer(emailData.from)) {
    return true;
  }
  
  return false;
}

/**
 * 営業時間内かどうかをチェック
 * @return {boolean} 営業時間内の場合true
 */
function isBusinessHours() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0=日曜日, 6=土曜日
  
  // 平日9:00-18:00を営業時間とする
  if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
    return true;
  }
  
  return false;
}
```

### 4. テンプレート管理・返信送信

```javascript
// templates.gs - テンプレート管理
/**
 * カテゴリに応じたテンプレートを取得
 * @param {string} category - メールカテゴリ
 * @param {Object} emailData - メールデータ（個人化用）
 * @return {Object} テンプレートデータ
 */
function getTemplate(category, emailData) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID)
                               .getSheetByName(CONFIG.TEMPLATE_SHEET);
    
    // テンプレート検索
    const data = sheet.getDataRange().getValues();
    const templateRow = data.find(row => row[0] === category);
    
    if (!templateRow) {
      // デフォルトテンプレート
      return getDefaultTemplate(emailData);
    }
    
    return {
      subject: personalizeTemplate(templateRow[1], emailData),
      body: personalizeTemplate(templateRow[2], emailData),
      priority: templateRow[3] || 'normal'
    };
    
  } catch (error) {
    console.error('テンプレート取得エラー:', error);
    return getDefaultTemplate(emailData);
  }
}

/**
 * テンプレートを個人化
 * @param {string} template - テンプレート文字列
 * @param {Object} emailData - メールデータ
 * @return {string} 個人化されたテンプレート
 */
function personalizeTemplate(template, emailData) {
  const now = new Date();
  const customerName = emailData.fromName || 'お客様';
  
  return template
    .replace(/{{顧客名}}/g, customerName)
    .replace(/{{日付}}/g, Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy年MM月dd日'))
    .replace(/{{時刻}}/g, Utilities.formatDate(now, 'Asia/Tokyo', 'HH:mm'))
    .replace(/{{件名}}/g, emailData.subject)
    .replace(/{{会社名}}/g, '株式会社サンプル'); // 実際の会社名に置換
}

/**
 * 自動返信メールを送信
 * @param {Object} emailData - 元メールデータ
 * @param {string} category - カテゴリ
 */
function sendAutoReply(emailData, category) {
  try {
    const template = getTemplate(category, emailData);
    
    // 返信件名を生成（Re:を追加）
    const replySubject = emailData.subject.startsWith('Re:') 
      ? emailData.subject 
      : 'Re: ' + emailData.subject;
    
    // HTMLメール本文を作成
    const htmlBody = createHtmlEmail(template.body, category);
    
    // メール送信
    Gmail.Users.Messages.send('me', {
      raw: Utilities.base64Encode(
        `To: ${emailData.from}
Subject: ${replySubject}
Content-Type: text/html; charset=utf-8

${htmlBody}`
      )
    });
    
    console.log(`自動返信送信完了: ${emailData.from}`);
    
    // 送信統計を更新
    updateSendingStats(category);
    
  } catch (error) {
    console.error('返信送信エラー:', error);
    logError('Reply Sending', error.toString(), emailData.id);
  }
}

/**
 * HTMLメール本文を作成
 * @param {string} textBody - テキスト本文
 * @param {string} category - カテゴリ
 * @return {string} HTML本文
 */
function createHtmlEmail(textBody, category) {
  const signature = `
    <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc;">
      <p style="font-size: 12px; color: #666;">
        この返信は自動送信されています。<br>
        ご不明な点がございましたら、下記までお気軽にお問い合わせください。<br><br>
        株式会社サンプル<br>
        Email: support@example.com<br>
        Tel: 03-1234-5678
      </p>
    </div>
  `;
  
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto;">
          ${textBody.replace(/\n/g, '<br>')}
          ${signature}
        </div>
      </body>
    </html>
  `;
}
```

### 5. データ管理・ログ機能

```javascript
// dataManagement.gs - データ管理関連
/**
 * 顧客データベースを更新
 * @param {Object} emailData - メールデータ
 */
function updateCustomerDatabase(emailData) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID)
                               .getSheetByName(CONFIG.CUSTOMER_SHEET);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // 既存顧客を検索
    const customerRow = data.findIndex(row => row[0] === emailData.from);
    
    if (customerRow > 0) {
      // 既存顧客の更新
      sheet.getRange(customerRow + 1, 3).setValue(new Date()); // 最終連絡日
      sheet.getRange(customerRow + 1, 4).setValue(
        sheet.getRange(customerRow + 1, 4).getValue() + 1
      ); // 連絡回数
    } else {
      // 新規顧客の追加
      sheet.appendRow([
        emailData.from,
        emailData.fromName,
        new Date(),
        1,
        '自動登録'
      ]);
    }
    
  } catch (error) {
    console.error('顧客DB更新エラー:', error);
  }
}

/**
 * メール処理ログを記録
 * @param {Object} emailData - メールデータ
 * @param {string} category - カテゴリ
 * @param {string} action - 実行アクション
 */
function logEmailActivity(emailData, category, action) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID)
                               .getSheetByName(CONFIG.LOG_SHEET);
    
    sheet.appendRow([
      new Date(),
      emailData.from,
      emailData.fromName,
      emailData.subject,
      category,
      action,
      '成功'
    ]);
    
  } catch (error) {
    console.error('ログ記録エラー:', error);
  }
}

/**
 * エラーログを記録
 * @param {string} operation - 操作名
 * @param {string} errorMessage - エラーメッセージ
 * @param {string} relatedId - 関連ID
 */
function logError(operation, errorMessage, relatedId = '') {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID)
                               .getSheetByName('ErrorLog');
    
    sheet.appendRow([
      new Date(),
      operation,
      errorMessage,
      relatedId,
      'Error'
    ]);
    
  } catch (error) {
    console.error('エラーログ記録失敗:', error);
  }
}

/**
 * 送信統計を更新
 * @param {string} category - カテゴリ
 */
function updateSendingStats(category) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID)
                               .getSheetByName('Stats');
    
    const today = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd');
    const data = sheet.getDataRange().getValues();
    
    // 今日の統計行を検索
    const todayRow = data.findIndex(row => 
      Utilities.formatDate(new Date(row[0]), 'Asia/Tokyo', 'yyyy-MM-dd') === today
    );
    
    if (todayRow > 0) {
      // 既存の統計を更新
      const currentCount = sheet.getRange(todayRow + 1, 2).getValue() || 0;
      sheet.getRange(todayRow + 1, 2).setValue(currentCount + 1);
    } else {
      // 新しい日の統計を追加
      sheet.appendRow([new Date(), 1, category]);
    }
    
  } catch (error) {
    console.error('統計更新エラー:', error);
  }
}
```

### 6. 定期実行・監視機能

```javascript
// automation.gs - 自動化・監視関連
/**
 * トリガーを設定してメール処理を定期実行
 */
function setupTriggers() {
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // 5分間隔でメール処理を実行
  ScriptApp.newTrigger('processEmails')
           .timeBased()
           .everyMinutes(CONFIG.CHECK_INTERVAL)
           .create();
  
  // 毎日午前9時に統計レポートを送信
  ScriptApp.newTrigger('sendDailyReport')
           .timeBased()
           .everyDays(1)
           .atHour(9)
           .create();
  
  // 毎週月曜日にシステムヘルスチェック
  ScriptApp.newTrigger('systemHealthCheck')
           .timeBased()
           .onWeekDay(ScriptApp.WeekDay.MONDAY)
           .atHour(8)
           .create();
  
  console.log('トリガー設定完了');
}

/**
 * 日次レポートを送信
 */
function sendDailyReport() {
  try {
    const stats = getDailyStats();
    const reportHtml = generateStatsReport(stats);
    
    // 管理者にレポート送信
    GmailApp.sendEmail(
      'manager@example.com',
      `メール自動返信システム 日次レポート ${Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd')}`,
      '',
      {
        htmlBody: reportHtml,
        attachments: [generateStatsChart()]
      }
    );
    
    console.log('日次レポート送信完了');
    
  } catch (error) {
    console.error('レポート送信エラー:', error);
  }
}

/**
 * システムヘルスチェック
 */
function systemHealthCheck() {
  const checks = [];
  
  // Gmail API接続チェック
  try {
    Gmail.Users.getProfile('me');
    checks.push({ service: 'Gmail API', status: 'OK', message: '接続正常' });
  } catch (error) {
    checks.push({ service: 'Gmail API', status: 'ERROR', message: error.toString() });
  }
  
  // スプレッドシート接続チェック
  try {
    SpreadsheetApp.openById(CONFIG.SHEET_ID);
    checks.push({ service: 'Spreadsheet', status: 'OK', message: '接続正常' });
  } catch (error) {
    checks.push({ service: 'Spreadsheet', status: 'ERROR', message: error.toString() });
  }
  
  // エラーがある場合は通知
  const errors = checks.filter(check => check.status === 'ERROR');
  if (errors.length > 0) {
    sendErrorNotification('システムヘルスチェック異常', 
      errors.map(e => `${e.service}: ${e.message}`).join('\n'));
  }
  
  console.log('ヘルスチェック完了:', checks);
}

/**
 * エラー通知を送信
 * @param {string} subject - 件名
 * @param {string} message - メッセージ
 */
function sendErrorNotification(subject, message) {
  try {
    GmailApp.sendEmail(
      'admin@example.com',
      `[ERROR] ${subject}`,
      `発生時刻: ${new Date()}\n\nエラー内容:\n${message}`,
      { replyTo: 'noreply@example.com' }
    );
  } catch (error) {
    console.error('エラー通知送信失敗:', error);
  }
}
```

## 学習ポイント

### Claude AIとの効果的な対話方法
1. **段階的な開発**: 大きな機能を小さなパーツに分解
2. **具体的な要求**: 実際のビジネス要件を詳しく説明
3. **エラー対応**: エラーが発生したらログと一緒に質問
4. **コード改善**: 既存のコードを見せて改善点を聞く

### Google Apps Scriptの活用
1. **Gmail API**: メール操作の自動化
2. **Sheets API**: データベース代替
3. **トリガー**: 定期実行の設定
4. **エラーハンドリング**: 堅牢性の確保

### 業務自動化の設計思想
1. **段階的導入**: 小さく始めて徐々に拡張
2. **監視・ログ**: 動作状況の可視化
3. **フェイルセーフ**: エラー時の適切な対応
4. **保守性**: 設定変更の容易さ

## 所要時間
- 基本システム構築: 1-2時間
- テンプレート設定: 30分
- テスト・デバッグ: 1時間
- 運用開始: 30分

## 拡張アイデア
1. **AI判定の高度化**: 機械学習による分類精度向上
2. **多言語対応**: 自動翻訳機能
3. **CRM連携**: Salesforce等との連携
4. **チャットボット**: より高度な自動応答

## 参考リンク
- [Google Apps Script](https://developers.google.com/apps-script)
- [Gmail API Reference](https://developers.google.com/gmail/api)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Claude AI](https://www.anthropic.com/claude)