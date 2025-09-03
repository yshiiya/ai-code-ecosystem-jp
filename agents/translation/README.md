# Translation Agent

AI Code Ecosystem JapanプロジェクトのTranslation Agent - 英語コンテンツを日本語に翻訳する自動化エージェント

## 概要

このエージェントは、英語のAIツール・技術情報を日本語に翻訳し、AI Code Ecosystem Japanのコンテンツを充実させます。

## 機能

- ✅ **技術用語の適切な翻訳**: 専門用語集に基づいた一貫性のある翻訳
- ✅ **Markdownフォーマット保持**: 構造とスタイルを維持
- ✅ **コード保護**: コードブロックやURLは翻訳対象外
- ✅ **バッチ処理**: 複数ファイルの一括翻訳
- ✅ **品質検証**: 翻訳後の品質チェック機能
- ✅ **進捗レポート**: 詳細な処理レポート生成

## ファイル構成

```
agents/translation/
├── translate_content.ts      # メイン翻訳エージェント
├── glossary.yaml            # 技術用語集
├── types.ts                 # TypeScript型定義
├── scripts/
│   └── batch_translate.ts   # バッチ翻訳スクリプト
└── README.md               # このファイル
```

## 使用方法

### 1. 単一テキスト翻訳

```bash
# 基本的な翻訳
npx ts-node agents/translation/translate_content.ts "This is a powerful AI tool"

# トーン指定
npx ts-node agents/translation/translate_content.ts "Getting Started" --tone formal
```

### 2. ファイル翻訳

```bash
# 単一ファイル翻訳
npx ts-node agents/translation/translate_content.ts --file README.md README.ja.md

# オプション指定
npx ts-node agents/translation/translate_content.ts --file docs/guide.md docs/guide.ja.md --tone technical
```

### 3. バッチ翻訳

```bash
# 基本的なバッチ翻訳
npx ts-node agents/translation/scripts/batch_translate.ts --source ./content --output ./content/ja

# 詳細オプション指定
npx ts-node agents/translation/scripts/batch_translate.ts \
  --source ./docs \
  --output ./docs/ja \
  --patterns "*.md,*.mdx" \
  --parallel 3 \
  --overwrite \
  --tone technical
```

### 4. 設定ファイル使用

```bash
# デフォルト設定ファイル作成
npx ts-node agents/translation/scripts/batch_translate.ts --create-config translation.config.json

# 設定ファイルを使用してバッチ翻訳
npx ts-node agents/translation/scripts/batch_translate.ts --config translation.config.json
```

## 設定ファイル例

```json
{
  "sourceDir": "./content",
  "outputDir": "./content/ja",
  "filePatterns": ["*.md", "*.mdx"],
  "excludePatterns": ["node_modules/**", ".git/**", "*.ja.md"],
  "options": {
    "preserveCodeBlocks": true,
    "preserveUrls": true,
    "preserveMarkdownStructure": true,
    "useGlossary": true,
    "targetTone": "technical"
  },
  "parallelLimit": 3,
  "createBackup": true,
  "overwriteExisting": false
}
```

## 技術用語集

`glossary.yaml`に定義された用語集に基づいて翻訳を行います。

### 主要カテゴリ

- **ai_terms**: AI/ML分野の基本用語
- **dev_tools**: 開発ツール・フレームワーク
- **languages**: プログラミング言語
- **ui_ux**: UI/UX用語
- **business**: ビジネス・戦略用語
- **keep_english**: 英語のまま保持する固有名詞

### 用語集の更新

```bash
# 用語集ファイルを直接編集
vim agents/translation/glossary.yaml

# 新しい用語を追加
ai_terms:
  "Vector Database": "ベクターデータベース"
  "Embedding": "埋め込み"
```

## プログラムから利用

```typescript
import { TranslationAgent, TranslationOptions } from './agents/translation/translate_content';

const agent = new TranslationAgent();

// 単一テキスト翻訳
const result = await agent.translateText("This is a powerful AI tool", {
  preserveCodeBlocks: true,
  useGlossary: true,
  targetTone: 'technical'
});

// ファイル翻訳
const fileResult = await agent.translateFile(
  './content/guide.md',
  './content/guide.ja.md'
);

// 品質検証
const validation = agent.validateTranslation(result);
if (!validation.isValid) {
  console.log('Issues found:', validation.issues);
}
```

## 翻訳品質の確保

### 自動品質チェック

- Markdownの構造保持確認
- コードブロックの保護確認
- URLの保護確認
- 翻訳信頼度のスコア化

### 翻訳レポート

バッチ翻訳では詳細なレポートが生成されます：

```
📊 Batch Translation Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Summary:
  Total files: 15
  ✅ Success: 13
  ❌ Failures: 1
  ⏭️ Skipped: 1
  ⏱️ Duration: 45s
```

## トラブルシューティング

### 一般的な問題

1. **用語集が読み込めない**
   ```bash
   # ファイルパスを確認
   ls agents/translation/glossary.yaml
   ```

2. **TypeScript実行エラー**
   ```bash
   # ts-nodeをグローバルインストール
   npm install -g ts-node
   ```

3. **メモリ不足（大量ファイル処理時）**
   ```bash
   # 並列処理数を減らす
   --parallel 1
   ```

### ログレベル設定

```typescript
// デバッグログを有効化
const agent = new TranslationAgent();
agent.setLogLevel('debug');
```

## API連携

現在はモック実装ですが、以下のAPIとの連携が可能です：

- **OpenAI GPT-4**: 高品質な文脈理解翻訳
- **DeepL API**: 専門的な翻訳品質
- **Google Translate API**: 高速処理

### API設定例

```json
{
  "translationEngine": "openai",
  "apiConfig": {
    "apiKey": "your-api-key",
    "model": "gpt-4",
    "maxTokens": 4000,
    "temperature": 0.1
  }
}
```

## 貢献方法

1. 新しい用語を`glossary.yaml`に追加
2. 翻訳パターンの改善提案
3. バグレポート・機能要望のissue作成

## ライセンス

このプロジェクトのライセンスに準拠します。

---

**注意**: 現在はモック実装のため、実際のAPI連携には追加の実装が必要です。