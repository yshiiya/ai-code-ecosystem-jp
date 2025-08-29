# Continue.dev - 詳細情報

## 基本情報
- **開発元**: Continue Dev, Inc.
- **カテゴリ**: オープンソースAIコーディングアシスタント
- **動作環境**: VS Code / JetBrains IDE拡張
- **最終更新**: 2025年8月29日
- **ライセンス**: Apache 2.0

## 概要
Continue.devは、オープンソースのAI開発アシスタントで、任意のLLMを使用してIDEにAI機能を統合できます。ローカルLLMのサポートが充実しており、プライバシーを重視する開発者に人気。

## 主要機能
- **マルチモデル対応**: 20以上のLLMプロバイダー対応
- **ローカルLLM**: Ollama統合でオフライン動作
- **カスタムプロンプト**: プロジェクト固有の設定
- **コンテキスト管理**: @ファイル、@フォルダー参照
- **タブ補完**: 高速なインライン提案
- **リファクタリング**: コード改善提案
- **説明生成**: コードの自動ドキュメント化

## 料金プラン
| プラン | 料金 | 特徴 |
|--------|------|------|
| オープンソース | 無料 | 全機能利用可能 |
| クラウドAPI | 使用量に応じて | 選択したLLMのAPI料金 |
| セルフホスト | 無料 | 自社インフラで運用 |

## 対応モデル
```yaml
クラウドモデル:
  - OpenAI (GPT-4, GPT-3.5)
  - Anthropic (Claude)
  - Google (Gemini, PaLM)
  - Cohere
  - Together AI
  
ローカルモデル:
  - Ollama統合
    - Llama 3
    - CodeLlama
    - Mistral
    - DeepSeek Coder
  - LM Studio
  - Jan.ai
  
エンタープライズ:
  - Azure OpenAI
  - AWS Bedrock
  - Google Vertex AI
```

## インストール方法

### VS Code
```bash
# 拡張機能マーケットプレイスから
1. VS Code拡張機能 → "Continue"を検索
2. Install → Reload

# CLIから
code --install-extension Continue.continue
```

### JetBrains IDE
```bash
1. Settings → Plugins
2. Marketplace → "Continue"を検索
3. Install → Restart IDE
```

### ローカルLLM設定（Ollama）
```bash
# Ollamaインストール
curl -fsSL https://ollama.ai/install.sh | sh

# モデルダウンロード
ollama pull codellama
ollama pull llama3

# Continue設定で選択
```

## 設定ファイル
```json
// ~/.continue/config.json
{
  "models": [
    {
      "title": "GPT-4",
      "provider": "openai",
      "model": "gpt-4",
      "apiKey": "YOUR_API_KEY"
    },
    {
      "title": "Local Llama",
      "provider": "ollama",
      "model": "codellama:13b"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Starcoder",
    "provider": "ollama",
    "model": "starcoder:3b"
  },
  "customCommands": [
    {
      "name": "test",
      "prompt": "Write a comprehensive test for this code"
    }
  ],
  "contextProviders": [
    {
      "name": "code",
      "params": {"maxTokens": 4096}
    }
  ]
}
```

## 使い方の例
```typescript
// Cmd+I でチャット起動
// @ファイル参照
"@src/main.ts このファイルをリファクタリング"

// Tab補完
function calculate// → 自動補完

// カスタムコマンド
/test → テスト生成
/explain → コード説明
/fix → バグ修正

// コンテキスト指定
"@folder:src 全体の構造を説明"
```

## 日本語対応
- ✅ 対応
- UIは英語のみ
- 日本語プロンプト可能
- 日本語コメント生成対応

## 長所
- 完全無料・オープンソース
- ローカルLLM対応（プライバシー）
- 豊富なモデル選択肢
- カスタマイズ性が高い
- 活発な開発コミュニティ
- 軽量で高速

## 短所
- 設定がやや複雑
- UIが基本的
- 商用サポートなし
- ドキュメントが発展途上

## 競合比較
| 項目 | Continue | Cline | GitHub Copilot |
|------|----------|-------|----------------|
| 価格 | 無料 | 無料 | $10/月〜 |
| ローカルLLM | ◎ | ○ | × |
| 設定の簡単さ | △ | ○ | ◎ |
| IDE対応 | VS Code/JetBrains | VS Code | 多数 |

## プライバシー機能
- ローカルLLM完全対応
- テレメトリ無効化可能
- コード送信の完全制御
- オンプレミス展開可能

## カスタマイズ例
```javascript
// カスタムプロバイダー
{
  "models": [{
    "title": "Company LLM",
    "provider": "openai-compatible",
    "baseUrl": "https://internal-llm.company.com",
    "model": "custom-model",
    "apiKey": "INTERNAL_KEY"
  }]
}

// プロジェクト固有設定
{
  "systemMessage": "You are an expert in React and TypeScript. Always use functional components and hooks.",
  "temperature": 0.3
}
```

## 公式リソース
- **公式サイト**: [https://continue.dev](https://continue.dev)
- **GitHub**: [https://github.com/continuedev/continue](https://github.com/continuedev/continue)
- **Discord**: [Continue Community](https://discord.gg/continue)
- **ドキュメント**: [https://docs.continue.dev](https://docs.continue.dev)

## 更新履歴
- 2025年8月: Ollama統合改善
- 2025年7月: JetBrains IDE対応
- 2025年6月: タブ補完機能追加

## よくある質問
**Q: 完全オフラインで使える？**
A: はい、Ollamaとローカルモデルで完全オフライン動作可能です。

**Q: 企業での利用は？**
A: Apache 2.0ライセンスで商用利用可能、セルフホストも可能です。

**Q: どのモデルがおすすめ？**
A: オンラインならGPT-4、オフラインならCodeLlama 13Bが推奨です。

---
*最終確認日: 2025年8月29日*
*次回更新予定: 2025年9月15日*