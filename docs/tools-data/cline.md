# Cline (旧Claude Dev) - 詳細情報

## 基本情報
- **開発元**: オープンソースコミュニティ
- **カテゴリ**: 自律型AIコーディングエージェント
- **動作環境**: VS Code拡張機能
- **最終更新**: 2025年8月29日
- **ライセンス**: Apache 2.0

## 概要
オープンソースの自律型AIコーディングエージェントで、VS Code拡張として動作。完全な透明性とモデル選択の自由度を提供し、あらゆるAIモデルと連携可能。

## 主要機能
- **プランモード**: 実行前の包括的な計画作成
- **完全透明性**: 全ての決定過程をリアルタイム表示
- **MCP統合**: Model Context Protocol対応
- **マルチモデル対応**: Claude、GPT、Gemini等
- **ファイル操作**: 作成、編集、削除の自動化
- **ターミナル実行**: コマンドの自動実行
- **ブラウザ操作**: Webサイトのスクレイピング

## 料金プラン
| プラン | 料金 | 特徴 |
|--------|------|------|
| オープンソース | 無料 | 全機能利用可能 |
| APIコスト | 使用量に応じて | 選択したAIモデルのAPI料金のみ |

## 対応AIモデル
- **Anthropic**: Claude 3.5 Sonnet、Claude 3 Opus
- **OpenAI**: GPT-4o、GPT-4、GPT-3.5
- **Google**: Gemini Pro、Gemini Ultra
- **オープンソース**: Llama、Mistral（ローカル実行）
- **その他**: Azure OpenAI、AWS Bedrock

## インストール方法
```bash
# VS Code拡張機能から
1. VS Code拡張機能マーケットプレイス
2. "Cline"を検索
3. Installをクリック

# または直接インストール
code --install-extension cline.cline

# 開発版（最新機能）
git clone https://github.com/cline/cline
cd cline
npm install
npm run package
code --install-extension cline-*.vsix
```

## 初期設定
```javascript
// settings.json
{
  "cline.apiProvider": "anthropic", // or "openai", "google"
  "cline.apiKey": "your-api-key",
  "cline.model": "claude-3-5-sonnet",
  "cline.planMode": true,
  "cline.autoApprove": false,
  "cline.maxTokens": 4096
}
```

## 使い方の例
```bash
# 基本的な使用
1. Cmd+Shift+P → "Cline: Start Chat"
2. タスクを自然言語で入力
   例: "ユーザー認証機能を実装して"

# プランモード
"まず計画を立てて: Reactでダッシュボードを作成"
→ 実行計画が表示され、承認後に実行

# ファイル操作
"src/components/にUserProfile.tsxを作成"

# デバッグ支援
"このエラーを修正: [エラーメッセージ貼り付け]"
```

## 日本語対応
- ✅ 完全対応
- 日本語でのタスク指示可能
- 日本語コメント生成

## 長所
- 完全無料（オープンソース）
- 完全な透明性
- あらゆるAIモデルに対応
- プロセスの完全制御
- プライバシー重視
- 活発なコミュニティ

## 短所
- VS Code専用
- 初期設定がやや複雑
- APIキー管理が必要
- UIがシンプル

## 類似ツールとの比較
| 項目 | Cline | Continue | Aider |
|------|-------|----------|-------|
| 価格 | 無料 | 無料 | 無料 |
| 環境 | VS Code | VS Code/JetBrains | CLI |
| 透明性 | ◎ | ○ | ○ |
| モデル選択 | 全対応 | 主要モデル | 主要モデル |

## セキュリティ機能
- ローカル実行オプション
- APIキーの暗号化保存
- ファイル操作の承認制御
- サンドボックス実行モード

## カスタマイズ
```javascript
// カスタムプロンプト
{
  "cline.customPrompts": {
    "codeStyle": "Always use TypeScript and functional components",
    "language": "Respond in Japanese"
  }
}

// 承認設定
{
  "cline.requireApproval": {
    "fileCreation": true,
    "fileDeletion": true,
    "terminalCommands": true
  }
}
```

## コミュニティ
- **GitHub Stars**: 15k+
- **Contributors**: 100+
- **月間ダウンロード**: 50k+
- **活発な開発**: 週次アップデート

## 公式リソース
- **公式サイト**: [https://cline.bot](https://cline.bot)
- **GitHub**: [https://github.com/cline/cline](https://github.com/cline/cline)
- **Discord**: [Cline Community](https://discord.gg/cline)
- **ドキュメント**: [https://docs.cline.bot](https://docs.cline.bot)

## 更新履歴
- 2025年8月: MCP完全対応
- 2025年7月: プランモード追加
- 2025年6月: Claude Devから改名

## よくある質問
**Q: Roo Codeとの違いは？**
A: Roo CodeはClineの商用版で、基本機能は同じです。

**Q: APIコストはどれくらい？**
A: 使用するモデルによりますが、月$5-50程度が一般的です。

**Q: 他のエディタで使える？**
A: 現在はVS Code専用ですが、他エディタ版も開発中です。

---
*最終確認日: 2025年8月29日*
*次回更新予定: 2025年9月15日*