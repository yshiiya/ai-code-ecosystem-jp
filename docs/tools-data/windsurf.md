# Windsurf - 詳細情報

## 基本情報
- **開発元**: Codeium（2025年5月にOpenAIが買収）
- **カテゴリ**: AIネイティブIDE
- **動作環境**: スタンドアロンIDE
- **最終更新**: 2025年8月29日
- **バージョン**: 最新

## 概要
CodeiumがリリースしたAIネイティブエディタで、後にOpenAIが30億ドルで買収。Cursorの主要な代替として位置づけられ、AIを中心に設計された革新的なIDE。

## 主要機能
- **Cascade**: プロジェクト全体の深い理解に基づくAI支援
- **Supercomplete**: 高度な複数行補完
- **AI Command Palette**: 自然言語でのコマンド実行
- **Flows**: マルチステップタスクの自動化
- **AI Chat**: コンテキスト認識チャット
- **バックグラウンドインデックス**: リアルタイムコード理解

## 料金プラン
| プラン | 月額料金 | 特徴 |
|--------|----------|------|
| Free | $0 | 基本機能、制限付きAI使用 |
| Pro | $10 | 無制限AI、高速モデル |
| Team | $15/ユーザー | チーム機能、管理ツール |

## 特徴的な機能
- **Cascade（カスケード）**
  - コードベース全体の深い理解
  - 依存関係の自動追跡
  - リファクタリング提案

- **Flows（フロー）**
  - 複雑なタスクの自動化
  - カスタムワークフロー定義
  - 繰り返しタスクの効率化

## インストール方法
```bash
# 公式サイトからダウンロード
1. https://windsurf.com にアクセス
2. Download → OS選択
3. インストーラー実行

# Mac
brew install --cask windsurf

# Windows (winget)
winget install Codeium.Windsurf

# Linux
snap install windsurf --classic
```

## 初期設定
```bash
# アカウント作成
1. Windsurf起動
2. Sign Up / Sign In
3. メールアドレス認証

# AI設定
Settings → AI Preferences
- Model selection
- Context window size
- Privacy settings
```

## 使い方の例
```javascript
// Cascadeでプロジェクト理解
// Command: "このプロジェクトの構造を説明して"

// Flowsでタスク自動化
// Flow: "すべてのコンポーネントにテストを追加"

// Supercomplete
function processData(data) {
  // 複数行の補完が自動的に提案される
}

// AI Command Palette
Cmd+Shift+P → "Convert this file to TypeScript"
```

## 日本語対応
- ✅ 対応
- UIの日本語化対応
- 日本語プロンプト可能

## 長所
- 無料プランが充実
- OpenAI買収による将来性
- 軽量で高速な動作
- Flows機能による自動化

## 短所
- Cursorより機能が少ない
- コミュニティがまだ小さい
- ドキュメントが発展途上
- 拡張機能エコシステムが限定的

## Cursorとの比較
| 機能 | Windsurf | Cursor |
|------|----------|--------|
| 価格 | $10/月 | $20/月 |
| 無料プラン | 充実 | 限定的 |
| マルチファイル編集 | Flows | Composer |
| VS Code互換 | 部分的 | ほぼ完全 |
| 独自機能 | Cascade | Tab補完 |

## 競合比較
| 項目 | Windsurf | Cursor | GitHub Copilot |
|------|----------|--------|----------------|
| 価格 | $10/月 | $20/月 | $10/月 |
| 形態 | 独立IDE | 独立IDE | IDE拡張 |
| 特徴 | Flows自動化 | Tab補完 | 広い対応 |
| 将来性 | OpenAI傘下 | 独立 | Microsoft傘下 |

## 対応言語
- JavaScript/TypeScript
- Python
- Java
- C/C++
- Go
- Rust
- Ruby
- PHP
- その他30以上の言語

## 拡張機能
- 独自の拡張機能マーケットプレイス
- 一部VS Code拡張機能との互換性
- Windsurf専用拡張機能の開発が活発

## 公式リソース
- **公式サイト**: [https://windsurf.com](https://windsurf.com)
- **エディタ**: [https://windsurf.com/editor](https://windsurf.com/editor)
- **ドキュメント**: [https://docs.windsurf.com](https://docs.windsurf.com)
- **Discord**: [Windsurf Community](https://discord.gg/windsurf)

## 更新履歴
- 2025年8月: Cascade 2.0リリース
- 2025年7月: Flows機能追加
- 2025年5月: OpenAIによる買収完了

## よくある質問
**Q: Codeiumとの違いは？**
A: WindsurfはCodeiumのIDE版で、より統合された体験を提供します。

**Q: OpenAI買収の影響は？**
A: GPTモデルとの深い統合が期待されています。

**Q: VS Code拡張機能は使える？**
A: 一部互換性がありますが、完全ではありません。

---
*最終確認日: 2025年8月29日*
*次回更新予定: 2025年9月15日*