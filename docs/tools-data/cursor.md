# Cursor - 詳細情報

## 基本情報
- **開発元**: Anysphere Inc.
- **カテゴリ**: AI統合型コードエディタ
- **動作環境**: スタンドアロンIDE（VS Codeフォーク）
- **最終更新**: 2025年8月29日
- **バージョン**: 0.42.x

## 概要
CursorはVS Codeをフォークして作られたAIファーストのコードエディタ。AIをエディタの中核に統合し、プロジェクト全体のコンテキストを理解しながら開発を支援します。

## 主要機能
- **Cmd+K（コマンドK）**: インライン編集と生成
- **Composer**: マルチファイル編集機能
- **Tab補完**: 高精度な予測補完
- **Chat**: エディタ内AIチャット
- **@記法**: ファイル、ドキュメント、Webを参照
- **コードベース理解**: プロジェクト全体のコンテキスト把握
- **Apply機能**: チャットから直接コード適用

## 料金プラン
| プラン | 月額料金 | 年額料金 | 特徴 |
|--------|----------|----------|------|
| Hobby | $0 | $0 | 月2000補完、50スロークエリ |
| Pro | $20 | $192 | 月500高速クエリ、無制限スロー |
| Business | $40/ユーザー | お問い合わせ | チーム機能、集中管理 |

## モデル選択
- GPT-4o
- GPT-4
- Claude 3.5 Sonnet
- Claude 3 Opus
- cursor-small（独自モデル）

## インストール方法
```bash
# 公式サイトからダウンロード
1. https://cursor.com にアクセス
2. OSに応じたインストーラーをダウンロード
3. インストーラーを実行

# Mac (Homebrew)
brew install --cask cursor

# VS Code設定のインポート
Cursor起動時に「Import VS Code Settings」を選択
```

## 初期設定
```bash
# APIキーの設定（オプション）
Settings → Cursor Settings → API Keys
- OpenAI API Key
- Anthropic API Key

# プライバシー設定
Settings → Cursor Settings → Privacy Mode
→ チェックでコードがサーバーに送信されない
```

## 使い方の例
```typescript
// Cmd+K でインライン編集
// 選択してCmd+K → "TypeScriptに変換"

// Composerでマルチファイル編集
Cmd+Shift+I → "ユーザー認証機能を追加"

// @記法でコンテキスト指定
// Chat: "@package.json この依存関係を最新版に更新"

// Webドキュメント参照
// Chat: "@docs React 19の新機能を使って書き直して"
```

## 日本語対応
- ✅ 完全対応
- 日本語UIあり
- 日本語でのチャット・プロンプト可能

## 長所
- VS Codeの全機能を継承
- 優れたTab補完精度
- プロジェクト全体の理解
- 既存VS Code拡張機能が使える
- プライバシーモード搭載

## 短所
- 月額$20と比較的高価
- 独立IDEのため切り替えが必要
- 一部VS Code拡張機能で互換性問題
- アップデートでVS Codeから遅れる

## VS Codeとの違い
| 機能 | Cursor | VS Code |
|------|--------|---------|
| AI統合 | ネイティブ | 拡張機能 |
| Tab補完 | 高精度AI | 基本的 |
| マルチファイル編集 | Composer内蔵 | なし |
| 価格 | $20/月 | 無料 |

## 競合比較
| 項目 | Cursor | GitHub Copilot | Claude Code |
|------|--------|----------------|-------------|
| 価格 | $20/月 | $10/月 | $20/月 |
| 動作形態 | 独立IDE | IDE拡張 | CLI |
| コンテキスト理解 | ◎ | △ | ◎ |
| VS Code互換 | ○ | ◎ | × |

## 拡張機能の互換性
- ✅ ほとんどのVS Code拡張機能が動作
- ⚠️ 一部のMicrosoft製拡張機能で制限
- ✅ 独自のCursor拡張機能も利用可能

## ショートカット
| 機能 | Mac | Windows/Linux |
|------|-----|---------------|
| インライン編集 | Cmd+K | Ctrl+K |
| Composer | Cmd+Shift+I | Ctrl+Shift+I |
| AIチャット | Cmd+L | Ctrl+L |
| Apply | Cmd+Shift+Y | Ctrl+Shift+Y |

## 公式リソース
- **公式サイト**: [https://cursor.com](https://cursor.com)
- **ドキュメント**: [https://docs.cursor.com](https://docs.cursor.com)
- **Discord**: [Cursor Community](https://discord.gg/cursor)
- **変更ログ**: [https://cursor.com/changelog](https://cursor.com/changelog)

## 更新履歴
- 2025年8月: Composer 2.0リリース
- 2025年7月: cursor-small モデル追加
- 2025年6月: プライバシーモード強化

## よくある質問
**Q: VS Codeから移行は簡単？**
A: はい、設定・拡張機能・キーバインドを自動インポート可能です。

**Q: オフラインで使える？**
A: エディタ機能は使えますが、AI機能は接続が必要です。

**Q: 企業での利用は？**
A: Businessプランでゼロトラスト、SOC 2対応しています。

---
*最終確認日: 2025年8月29日*
*次回更新予定: 2025年9月15日*