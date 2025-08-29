# AI Code Ecosystem Japan 🚀

AIコーディングツールとその周辺エコシステムの情報を日本語で体系的に整理した総合情報ポータルサイト

## 📌 プロジェクト概要

AIコーディング（Claude Code、GitHub Copilot、Cursor等）に関する情報を日本語で提供し、非エンジニアを含むすべての人がAIを活用したプログラミングを始められる環境を提供します。

### 主な特徴
- 🔍 **包括的な情報**: AIツール、MCP、CLI、連携ツールまで網羅
- 🇯🇵 **日本語特化**: すべての情報を分かりやすい日本語で提供
- 👥 **初心者フレンドリー**: 専門用語を使わない解説
- 🔄 **常に最新**: 定期的な情報更新とコミュニティからのフィードバック

## 📚 ドキュメント

プロジェクトの詳細は以下のドキュメントをご覧ください：

- 📋 [PROJECT_PLAN.md](./PROJECT_PLAN.md) - プロジェクト計画書
- 🔧 [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) - 技術仕様書  
- 📝 [CONTENT_PLAN.md](./CONTENT_PLAN.md) - コンテンツ計画書

## 🚀 クイックスタート

### 必要な環境
- Node.js 20.x以上
- pnpm 9.x以上

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/ai-code-ecosystem-jp.git
cd ai-code-ecosystem-jp

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# プロダクションモードで起動
pnpm start
```

## 📁 プロジェクト構造

```
ai-code-ecosystem-jp/
├── 📄 README.md              # このファイル
├── 📋 PROJECT_PLAN.md        # プロジェクト計画
├── 🔧 TECHNICAL_SPEC.md      # 技術仕様
├── 📝 CONTENT_PLAN.md        # コンテンツ計画
├── app/                      # Next.js App Router
├── components/               # Reactコンポーネント
├── content/                  # MDXコンテンツ
├── lib/                      # ユーティリティ
├── public/                   # 静的ファイル
└── types/                    # TypeScript型定義
```

## 🎯 ロードマップ

### フェーズ1（2025年8-9月）✅ 現在ここ
- [x] プロジェクト立ち上げ
- [x] 設計ドキュメント作成
- [ ] 基本構造の実装
- [ ] 主要5ツールのコンテンツ作成
- [ ] MVP公開

### フェーズ2（2025年10-11月）
- [ ] 全ツール情報の充実（15種以上）
- [ ] MCP完全ガイド
- [ ] 検索機能実装
- [ ] ユーザーフィードバック機能

### フェーズ3（2025年12月-2026年1月）
- [ ] コミュニティ機能
- [ ] ユーザー投稿システム
- [ ] 動画コンテンツ
- [ ] API提供

## 🤝 コントリビューション

コントリビューションは大歓迎です！以下の方法で貢献できます：

1. **コンテンツ追加**: 新しいツールやガイドの情報提供
2. **翻訳・校正**: より分かりやすい日本語への改善
3. **バグ報告**: Issues での問題報告
4. **機能提案**: 新機能のアイデア共有

詳細は [CONTRIBUTING.md](./CONTRIBUTING.md)（準備中）をご覧ください。

## 📊 プロジェクトステータス

- **現在のフェーズ**: フェーズ1 - MVP開発
- **進捗**: 20% (設計完了)
- **次のマイルストーン**: 基本構造の実装

## 🔗 関連リンク

- **本番サイト**: https://ai-code-ecosystem.jp (準備中)
- **開発環境**: http://localhost:3000
- **設計書**: [ドキュメント一覧](#📚-ドキュメント)

## 📧 お問い合わせ

- **Email**: contact@ai-code-ecosystem.jp (準備中)
- **Twitter**: @aicode_jp (準備中)
- **Discord**: 準備中

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
詳細は [LICENSE](./LICENSE) ファイルをご覧ください。

---

## 🚧 開発メモ

### 次のタスク
1. ✅ プロジェクト構造の決定
2. ✅ 設計ドキュメントの作成
3. ⏳ Next.js プロジェクトのセットアップ
4. ⏳ 基本レイアウトの実装
5. ⏳ 最初のコンテンツページ作成

### 技術スタック
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: MDX
- **Hosting**: Vercel

### 開発コマンド

```bash
# 開発
pnpm dev

# リント
pnpm lint

# フォーマット
pnpm format

# 型チェック
pnpm type-check

# テスト
pnpm test

# ビルド
pnpm build
```

---
*最終更新: 2025年8月29日*