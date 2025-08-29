# Aider - 詳細情報

## 基本情報
- **開発元**: Paul Gauthier（オープンソース）
- **カテゴリ**: ターミナルAIペアプログラミング
- **動作環境**: CLI/ターミナル
- **最終更新**: 2025年8月29日
- **ライセンス**: Apache 2.0

## 概要
ターミナルで動作するAIペアプログラミングツール。Gitリポジトリとネイティブに統合し、複数のLLMモデルに対応。コマンドライン環境での開発に最適化されています。

## 主要機能
- **Git統合**: 自動的にGitコミット作成
- **マルチファイル編集**: 複数ファイルの同時編集
- **リポジトリマップ**: プロジェクト構造の自動理解
- **会話履歴**: セッション間での文脈保持
- **音声入力**: 音声でのコード指示（実験的）
- **Web検索**: 最新情報の取得と統合

## 料金プラン
| プラン | 料金 | 特徴 |
|--------|------|------|
| オープンソース | 無料 | 全機能利用可能 |
| APIコスト | 使用量に応じて | 選択したLLMのAPI料金 |

## 対応モデル
```yaml
主要モデル:
  - GPT-4o (推奨)
  - GPT-4
  - Claude 3.5 Sonnet
  - Claude 3 Opus
  - Gemini Pro

ローカルモデル:
  - Llama 3
  - CodeLlama
  - Mistral
  - その他Ollama対応モデル

カスタム:
  - OpenAI互換API
  - Azure OpenAI
  - AWS Bedrock
```

## インストール方法
```bash
# pip でインストール（推奨）
pip install aider-chat

# pipx でインストール（分離環境）
pipx install aider-chat

# Homebrew (Mac)
brew install aider

# Docker
docker pull paulgauthier/aider
docker run -it --rm \
  -v $(pwd):/app \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  paulgauthier/aider
```

## 初期設定
```bash
# API キーの設定
export OPENAI_API_KEY="your-api-key"
# または
export ANTHROPIC_API_KEY="your-api-key"

# 設定ファイル (~/.aider.conf.yml)
model: gpt-4o
auto-commits: true
dark-mode: true
map-tokens: 1024
```

## 使い方の例
```bash
# 基本的な起動
aider

# 特定のファイルを編集
aider src/main.py src/utils.py

# モデルを指定
aider --model claude-3-5-sonnet

# Gitコミットを無効化
aider --no-auto-commits

# Webから情報取得
aider --browser

# 既存コードの改善
aider --code-review

# 音声入力
aider --voice
```

## コマンド例
```bash
# Aider内でのコマンド
> /add src/*.py        # ファイルを追加
> /drop src/test.py    # ファイルを削除
> /undo               # 最後の変更を取り消し
> /diff               # 変更内容を表示
> /commit "message"    # 手動コミット
> /help               # ヘルプ表示

# 実際の使用例
> ユーザー認証機能を追加して
> このバグを修正: [エラーメッセージ]
> READMEを日本語に翻訳
> テストを追加
```

## 日本語対応
- ✅ 対応
- 日本語での指示可能
- 日本語コメント・ドキュメント生成

## 長所
- Git統合が優秀
- ターミナル完結
- 軽量・高速
- SSHでリモート使用可能
- 詳細なコスト表示
- 豊富なカスタマイズ

## 短所
- CLI操作のみ（GUI無し）
- ビジュアルフィードバック無し
- 初心者には敷居が高い
- IDE統合なし

## 他ツールとの比較
| 項目 | Aider | Claude Code | GitHub Copilot CLI |
|------|-------|-------------|-------------------|
| 価格 | 無料 | $20/月 | $10/月 |
| 環境 | ターミナル | ターミナル | ターミナル |
| Git統合 | ◎ | ○ | △ |
| モデル選択 | 多数 | Claude系 | OpenAI系 |

## Git統合機能
```bash
# 自動コミットメッセージ
aider: Added user authentication feature

Files modified:
- src/auth.py
- src/models/user.py
- tests/test_auth.py

# コミット形式のカスタマイズ
aider --commit-prompt "feat: {message}"
```

## 高度な使い方
```bash
# リポジトリマップの生成
aider --map-tokens 2048

# 特定ディレクトリのみ
aider --subtree src/

# 読み取り専用ファイル
aider --read src/config.py --write src/main.py

# チャット履歴の保存
aider --chat-history-file project.md

# カスタムプロンプト
aider --system-prompt "You are an expert Python developer"
```

## パフォーマンス設定
```yaml
# .aider.conf.yml
map-tokens: 1024      # リポマップのトークン数
edit-format: diff     # 編集形式（diff/whole）
weak-model: gpt-3.5   # 補助モデル
cache-prompts: true   # プロンプトキャッシュ
```

## 公式リソース
- **GitHub**: [https://github.com/paul-gauthier/aider](https://github.com/paul-gauthier/aider)
- **ドキュメント**: [https://aider.chat](https://aider.chat)
- **Discord**: [Aider Community](https://discord.gg/aider)
- **ベンチマーク**: [https://aider.chat/docs/benchmarks](https://aider.chat/docs/benchmarks)

## 更新履歴
- 2025年8月: Web検索機能追加
- 2025年7月: 音声入力サポート
- 2025年6月: リポジトリマップ改善

## よくある質問
**Q: 大規模プロジェクトでも使える？**
A: はい、リポジトリマップ機能で効率的に処理できます。

**Q: プライベートコードは安全？**
A: APIに送信されますが、ローカルLLMも使用可能です。

**Q: Windows対応は？**
A: WSL2またはGit Bashで完全動作します。

---
*最終確認日: 2025年8月29日*
*次回更新予定: 2025年9月15日*