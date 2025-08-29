# GitHub Copilot - 詳細情報

## 基本情報
- **開発元**: GitHub (Microsoft)
- **カテゴリ**: AI補完・コーディングアシスタント
- **動作環境**: 主要IDE統合
- **最終更新**: 2025年8月29日
- **バージョン**: 最新（マルチモデル対応）

## 概要
GitHubが開発した世界で最も広く採用されているAI開発者ツール。GitHub、OpenAI、Microsoftが共同開発したジェネレーティブAIモデルを使用し、リアルタイムのコード補完と生成を提供。

## 主要機能
- **エージェントモード**: 複数ファイルにわたる包括的な変更
- **マルチモデル選択**: GPT-4o、Claude 3.5 Sonnet、Gemini等から選択可能
- **Next Edit Suggestions**: 変更の波及効果を予測
- **自動コードレビュー**: 人間が見る前にバグを発見・修正
- **Copilot Chat**: IDE内でのAIとの対話型プログラミング
- **Copilot Voice**: 音声入力でのコード生成（ベータ）

## 料金プラン
| プラン | 月額料金 | 年額料金 | 特徴 |
|--------|----------|----------|------|
| Free | $0 | $0 | 月2,000回補完、50回チャット |
| Pro | $10 | $100 | 無制限、高度な機能 |
| Pro+ | $39 | $390 | 最上位モデル、優先アクセス |
| Business | $19/ユーザー | お問い合わせ | チーム向け機能 |
| Enterprise | お問い合わせ | お問い合わせ | エンタープライズ機能 |

## インストール方法

### VS Code
```bash
# VS Code拡張機能から直接インストール
1. 拡張機能マーケットプレイスを開く
2. "GitHub Copilot"を検索
3. インストールボタンをクリック
```

### JetBrains IDE
```bash
1. Settings/Preferences → Plugins
2. Marketplace → "GitHub Copilot"を検索
3. Install → Restart IDE
```

### Neovim
```vim
" プラグインマネージャー（例：vim-plug）を使用
Plug 'github/copilot.vim'
```

## 初期設定
```bash
# GitHubアカウントでサインイン
1. IDEでCopilotアイコンをクリック
2. "Sign in to GitHub"を選択
3. ブラウザで認証を完了
4. IDEに戻り、設定完了
```

## 使い方の例
```javascript
// コメントから関数を生成
// ユーザーの年齢を計算する関数
function calculateAge(birthDate) {
  // Copilotが自動的に実装を提案
}

// インラインチャット
// Copilot: この関数を TypeScript に変換して

// コードレビュー
// Copilot: このコードのバグを見つけて
```

## 日本語対応
- ✅ 対応
- 日本語コメントからのコード生成可能
- 日本語での説明・ドキュメント生成

## 長所
- 最も広く採用されている（信頼性）
- 豊富なIDE対応
- 比較的安価（Pro版$10/月）
- マルチモデル選択可能
- 無料プランあり

## 短所
- コンテキスト理解が限定的
- プロジェクト全体の把握は苦手
- エージェント機能は発展途上

## 対応IDE/エディタ
- Visual Studio Code
- Visual Studio
- JetBrains全製品（IntelliJ IDEA、PyCharm等）
- Neovim/Vim
- Azure Data Studio
- GitHub Codespaces
- CLI（ベータ）

## 競合比較
| 項目 | GitHub Copilot | Claude Code | Cursor |
|------|----------------|-------------|--------|
| 価格 | $10/月〜 | $20/月 | $20/月 |
| 無料プラン | あり | なし | あり（限定） |
| IDE統合 | 最多 | 限定的 | 独立IDE |
| コンテキスト | 限定的 | 200k | プロジェクト全体 |

## 連携可能なツール
- **GitHub**: Issues、Pull Requests統合
- **Azure DevOps**: CI/CD連携
- **各種言語サーバー**: LSP対応
- **デバッガー**: 統合デバッグ支援

## 公式リソース
- **公式サイト**: [https://github.com/features/copilot](https://github.com/features/copilot)
- **ドキュメント**: [https://docs.github.com/copilot](https://docs.github.com/copilot)
- **ステータス**: [https://githubstatus.com](https://githubstatus.com)
- **コミュニティ**: [GitHub Community](https://github.community/c/copilot)

## 更新履歴
- 2025年8月: マルチモデル対応追加
- 2025年7月: エージェントモード（ベータ）
- 2025年6月: 無料プラン導入

## よくある質問
**Q: 商用利用は可能？**
A: はい、全プランで商用利用可能です。

**Q: コードの学習に使われる？**
A: Business/Enterpriseプランではオプトアウト可能です。

**Q: オフラインで使える？**
A: いいえ、クラウドベースのため常時接続が必要です。

---
*最終確認日: 2025年8月29日*
*次回更新予定: 2025年9月15日*