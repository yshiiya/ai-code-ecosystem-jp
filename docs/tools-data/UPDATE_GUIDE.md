# ツール情報更新ガイド

## 📋 更新管理システム

このドキュメントは、AIコーディングツール情報を最新に保つための運用ガイドです。

## 🔄 更新サイクル

### 日次チェック（自動化予定）
- 公式サイトの更新情報
- GitHubリリース
- 公式ブログ/アナウンス

### 週次更新
- 新機能の追加
- 料金変更の確認
- バグフィックス情報

### 月次レビュー
- 全ツール情報の精査
- 競合比較の更新
- ユーザーフィードバック反映

## 📝 更新チェックリスト

### 各ツール共通チェック項目

```markdown
## [ツール名] 更新チェック - [日付]

### 基本情報
- [ ] 最新バージョン番号
- [ ] リリース日
- [ ] 開発元の変更（買収等）

### 機能
- [ ] 新機能の追加
- [ ] 既存機能の変更
- [ ] 廃止された機能

### 料金
- [ ] プラン変更
- [ ] 価格改定
- [ ] 無料枠の変更

### 技術仕様
- [ ] 対応OS/IDE
- [ ] APIの変更
- [ ] モデルの更新

### ドキュメント
- [ ] 公式ドキュメントURL
- [ ] チュートリアル更新
- [ ] FAQ追加

### 日本語対応
- [ ] UI日本語化
- [ ] 日本語ドキュメント
- [ ] 日本向けサポート
```

## 🔍 情報収集源

### 公式情報源

#### Claude Code
- 公式サイト: https://claude.ai/code
- ブログ: https://www.anthropic.com/blog
- GitHub: https://github.com/anthropics

#### GitHub Copilot
- 公式: https://github.com/features/copilot
- ブログ: https://github.blog/tag/github-copilot/
- Changelog: https://github.com/orgs/community/discussions/categories/copilot

#### Cursor
- 公式: https://cursor.com
- Changelog: https://cursor.com/changelog
- Discord: https://discord.gg/cursor

#### Windsurf
- 公式: https://windsurf.com
- ブログ: https://windsurf.com/blog
- Discord: https://discord.gg/windsurf

#### Cline
- GitHub: https://github.com/cline/cline
- リリース: https://github.com/cline/cline/releases
- Discord: https://discord.gg/cline

#### Aider
- 公式: https://aider.chat
- GitHub: https://github.com/paul-gauthier/aider
- Discord: https://discord.gg/aider

### コミュニティ情報源
- Reddit: r/programming, r/artificial
- Hacker News
- X (Twitter): 各ツール公式アカウント
- YouTube: デモ動画、レビュー
- Qiita/Zenn: 日本語記事

## 📊 更新記録テンプレート

```markdown
# [ツール名] 更新記録

## [YYYY-MM-DD] 更新内容

### 変更点
- 機能: [追加/変更/削除された機能]
- 料金: [プラン/価格の変更]
- 仕様: [技術的な変更]

### 影響
- ユーザーへの影響: [説明]
- 既存機能との互換性: [説明]

### 対応
- ドキュメント更新: [更新したファイル]
- サイト反映: [更新したページ]

### 確認者
- 担当: [名前]
- レビュー: [名前]
```

## 🚨 緊急更新対応

### 重大な変更の基準
1. **料金の大幅変更**（20%以上）
2. **サービス終了・買収**
3. **セキュリティ問題**
4. **破壊的変更**

### 対応フロー
1. 情報の確認（公式ソース）
2. 影響範囲の特定
3. ドキュメント更新
4. サイト更新
5. ユーザーへの通知（必要に応じて）

## 📈 品質管理

### 正確性の確保
- 公式情報源の優先
- 複数ソースでの確認
- 実際の動作確認（可能な場合）

### 一貫性の維持
- フォーマット統一
- 用語の統一
- 更新日時の明記

### トレーサビリティ
- 更新履歴の記録
- 変更理由の明記
- 情報源の記載

## 🔮 今後の自動化計画

### Phase 1: 基本自動化
- RSS/APIでの更新監視
- 更新通知システム
- 基本的な差分検出

### Phase 2: 高度な自動化
- 自動ドキュメント更新
- 料金変更の自動検出
- リリースノート要約

### Phase 3: AI活用
- 変更影響度の自動評価
- 日本語翻訳の自動化
- ユーザー向け要約生成

## 📞 連絡先

### 更新に関する質問
- Issue: GitHub Issues（準備中）
- メール: update@ai-code-ecosystem.jp（準備中）

### 情報提供
新しい情報や誤りを見つけた場合は、以下の方法でお知らせください：
- Pull Request
- Issue報告
- フィードバックフォーム（準備中）

---
*最終更新: 2025年8月29日*
*このガイドは定期的に改善されます*