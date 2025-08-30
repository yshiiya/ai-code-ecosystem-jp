# Gemini CLI

## 📖 概要

**Gemini CLI**は、Googleが開発したGemini AIモデルをコマンドラインから利用できる公式ツールです。ターミナル内でテキスト生成、コード生成、画像解析などをシームレスに実行でき、開発ワークフローに統合しやすい設計となっています。

## ⭐ 主要機能

### コマンドライン統合
- **ワンライナー実行**: 一行コマンドで即座にAI機能を実行
- **パイプライン対応**: Unix的なパイプ処理でデータ連携
- **出力フォーマット**: JSON, テキスト, Markdown形式での出力

### マルチモーダル対応
- **テキスト生成**: プロンプトからの自然な文章生成
- **コード生成**: 各種プログラミング言語対応
- **画像解析**: 画像ファイルの説明・分析
- **文書処理**: PDF, テキストファイルの要約・分析

### 開発者向け機能
- **設定管理**: プロファイル機能で複数設定管理
- **履歴機能**: 過去のプロンプトと回答を記録
- **バッチ処理**: 複数ファイル・プロンプトの一括処理

## 💰 料金プラン

| プラン | 料金 | 特徴 |
|--------|------|------|
| Gemini Pro Free | 無料 | 1分間15リクエスト制限 |
| Gemini Pro | 従量課金 | $0.50/1Mトークン（入力） |
| Gemini Pro Vision | 従量課金 | $4.00/1M画像トークン |
| Gemini Ultra | 未定 | 最高性能（将来リリース予定） |

*Google AI Studioでのトークン使用量に基づく*

## 🛠️ インストール方法

### macOS (Homebrew)
```bash
# Homebrewでインストール
brew install google-gemini-cli

# または公式バイナリ
curl -O https://releases.google.com/gemini-cli/gemini-cli-darwin
chmod +x gemini-cli-darwin
sudo mv gemini-cli-darwin /usr/local/bin/gemini
```

### Linux
```bash
# ダウンロード・インストール
wget https://releases.google.com/gemini-cli/gemini-cli-linux
chmod +x gemini-cli-linux
sudo mv gemini-cli-linux /usr/local/bin/gemini
```

### Windows
```powershell
# Chocolatey
choco install gemini-cli

# またはScoopで
scoop install gemini-cli
```

## ⚙️ 初期設定

### API認証設定
```bash
# Google AI StudioでAPIキー取得後
gemini auth login

# または環境変数で設定
export GEMINI_API_KEY="your_api_key_here"

# 設定確認
gemini config show
```

### プロファイル設定
```bash
# 開発用プロファイル作成
gemini config create --profile dev
gemini config set --profile dev --model gemini-pro
gemini config set --profile dev --temperature 0.7

# 本番用プロファイル
gemini config create --profile prod  
gemini config set --profile prod --model gemini-pro
gemini config set --profile prod --temperature 0.1
```

## 🚀 使用方法

### 基本的な使用方法
```bash
# テキスト生成
gemini "Pythonでクイックソートを実装して"

# ファイル処理
gemini --file script.py "このコードを説明して"

# 画像解析
gemini --image screenshot.png "この画像を説明して"

# 複数ファイル処理
gemini --files *.js "これらのJSファイルの問題点を指摘"
```

### パイプライン活用
```bash
# ログファイル分析
tail -f app.log | gemini "エラーパターンを分析して"

# Git diff分析
git diff | gemini "この差分をレビューして"

# CSV処理
cat sales.csv | gemini "このデータを要約して"
```

### バッチ処理
```bash
# プロンプトファイルから実行
gemini --batch prompts.txt

# JSONでの構造化出力
gemini --format json "APIレスポンス形式でユーザー情報を生成"

# 複数画像の一括処理
gemini --images *.png "各画像の内容を分析してJSON形式で出力"
```

## 🌍 日本語対応

### 対応状況
- ✅ **日本語プロンプト**: 完全対応
- ✅ **日本語出力**: 自然な日本語生成
- ✅ **コードコメント**: 日本語コメント生成
- ✅ **文書処理**: 日本語文書の要約・分析

### 実用例
```bash
# 日本語コード生成
gemini "在庫管理システムのPythonクラスを作成。商品の追加、削除、検索機能を含めて"

# 文書要約
gemini --file report.pdf "この報告書を3行で要約"

# コードレビュー
gemini --file app.py "このコードの改善点を日本語で教えて"
```

## ✅ 長所

- **完全無料**: Gemini Pro Freeで十分な機能利用可能
- **高速処理**: Googleの最適化されたインフラで高速応答
- **マルチモーダル**: テキスト・画像・文書を統一的に処理
- **Unix哲学**: パイプライン処理で既存ツールとの連携
- **オープンソース**: 透明性の高い開発・カスタマイズ可能

## ❌ 短所

- **比較的新しい**: エコシステムがまだ発展途上
- **制限事項**: 無料版は使用量制限あり
- **コミュニティ**: ChatGPT/Claudeと比較してコミュニティが小さい
- **日本語精度**: 英語と比較して若干精度が劣る場合あり
- **IDE統合**: 専用IDE拡張がまだ少ない

## 🆚 競合比較

| 機能 | Gemini CLI | Claude Code | Aider |
|------|------------|-------------|-------|
| 無料利用 | ✅ | ❌ | ✅ |
| 画像処理 | ✅ | ❌ | ❌ |
| Git統合 | ⭕ | ✅ | ✅ |
| 日本語対応 | ✅ | ✅ | ⭕ |
| エージェント機能 | ❌ | ✅ | ⭕ |

## 💡 活用場面

### 適している場面
- **学習・実験**: 無料で高性能なAI活用
- **画像処理**: スクリーンショット解析・図表読み取り
- **文書処理**: PDF要約・データ分析
- **ワンショット作業**: 単発的なコード生成・分析
- **自動化スクリプト**: シェルスクリプト・バッチ処理組み込み

### 適していない場面
- **継続的開発**: IDE統合による開発効率重視
- **複雑なプロジェクト**: 大規模システムの継続的な保守
- **チーム開発**: コラボレーション機能が必要
- **エージェント作業**: 自律的なタスク実行が必要

## 🔧 高度な使用法

### 設定ファイル活用
```yaml
# ~/.gemini/config.yaml
profiles:
  default:
    model: gemini-pro
    temperature: 0.7
    max_tokens: 2048
  
  code:
    model: gemini-pro
    temperature: 0.1
    system_prompt: "あなたは優秀なプログラマーです"
```

### カスタムエイリアス
```bash
# ~/.bashrc または ~/.zshrc
alias gcode='gemini --profile code'
alias gimage='gemini --image'
alias greview='git diff | gemini "コードレビューして"'
```

### スクリプト統合
```bash
#!/bin/bash
# auto-commit.sh
diff=$(git diff)
if [[ -n "$diff" ]]; then
    message=$(echo "$diff" | gemini --format plain "適切なコミットメッセージを生成")
    git add .
    git commit -m "$message"
fi
```

## 📚 学習リソース

### 公式
- [Google AI CLI Documentation](https://ai.google.dev/cli)
- [Gemini API Reference](https://ai.google.dev/api)
- [Google AI Studio](https://aistudio.google.com)

### 日本語リソース
- [Gemini活用ガイド](https://qiita.com/tags/gemini)
- [Google AI実践例](https://zenn.dev/topics/google-ai)
- [Gemini CLI チュートリアル](https://gemini-cli-jp.dev)

## 📊 更新履歴

### 2024年
- **12月**: Gemini CLI v1.0 正式リリース
- **10月**: マルチモーダル機能強化
- **8月**: 日本語対応改善

### 2024年（予定）
- **3月**: Gemini Pro 1.5統合予定
- **4月**: IDE拡張機能リリース予定
- **6月**: エージェント機能追加予定

## ❓ よくある質問

### Q: 完全無料で使用できますか？
**A**: Gemini Pro Freeプランなら無料。1分間15リクエストの制限内で利用可能。

### Q: プライベートコードを送信しても安全？
**A**: Googleのプライバシーポリシーに従い処理。機密情報は避けることを推奨。

### Q: オフラインでも使用できますか？
**A**: API接続が必要なため、オフライン利用は不可。

### Q: ChatGPTとの違いは？
**A**: Geminiは画像処理が強く、無料利用が可能。ChatGPTはエージェント機能が充実。

---

*最終更新: 2025年8月30日*