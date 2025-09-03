# iTerm2完全ガイド

## 概要

iTerm2は、macOS用の高機能ターミナルエミュレータです。標準のTerminal.appを大幅に上回る機能を提供し、開発者や上級ユーザーに愛用されています。分割ペイン、豊富なカスタマイズオプション、プロファイル管理、ホットキーウィンドウなど、生産性を向上させる多くの機能を備えています。

## インストール方法

### Homebrew使用（推奨）

```bash
# iTerm2をインストール
brew install --cask iterm2

# 最新版に更新
brew upgrade --cask iterm2
```

### 公式サイトからダウンロード

1. [iTerm2公式サイト](https://iterm2.com/)にアクセス
2. 「Download」ボタンをクリック
3. ダウンロードしたzipファイルを展開
4. iTerm.appをApplicationsフォルダにドラッグ&ドロップ

### App Store（非推奨）

App Store版は機能が制限されているため、公式サイト版またはHomebrew版を推奨します。

## 初期設定

### 1. 基本設定

```bash
# iTerm2を起動
open -a iTerm

# 設定画面を開く（⌘ + ,）
```

### 2. プロファイル設定

**General > Profiles > Default**

```
Working Directory: Reuse previous session's directory
Send text at start: cd ~/Development
```

**Colors**
- Color Presets: Solarized Dark（推奨）
- またはDraculaテーマ

**Text**
- Font: Fira Code, 14pt（リガチャー対応）
- Use ligatures: ✓

**Window**
- Transparency: 10-15%
- Blur: ✓
- Keep background colors opaque: ✓

### 3. ホットキー設定

**Keys > Hotkey**

```
Show/hide all windows with a system-wide hotkey: ✓
Hotkey: ⌘ + Space（またはお好みのキー組み合わせ）
```

## 主要機能

### 1. 分割ペイン

```bash
# 水平分割
⌘ + D

# 垂直分割
⌘ + Shift + D

# ペイン間移動
⌘ + [ or ]
⌘ + ↑↓←→

# ペインサイズ変更
⌃ + ⌘ + ↑↓←→

# ペインを閉じる
⌘ + W

# 全画面表示
⌘ + Enter
```

### 2. タブ管理

```bash
# 新しいタブ
⌘ + T

# タブ切り替え
⌘ + ←→
⌘ + 数字キー

# タブを閉じる
⌘ + W

# タブ名変更
⌘ + I
```

### 3. セッション管理

```bash
# セッション復元を有効化
Preferences > General > Startup > Use System Window Restoration

# ウィンドウアレンジメント保存
Window > Save Window Arrangement
Window > Restore Window Arrangement
```

### 4. 検索機能

```bash
# 検索開始
⌘ + F

# 次の結果
⌘ + G

# 前の結果
⌘ + Shift + G

# 正規表現検索
検索欄で Regular Expression を有効化
```

## 高度な設定

### 1. プロファイル詳細設定

**開発者用プロファイル作成**

```bash
# Profiles > + ボタン
Name: Development
Working Directory: ~/Development
Send text at start: 
  export PATH="/opt/homebrew/bin:$PATH"
  git status 2>/dev/null || echo "Not a git repository"
```

**本番環境用プロファイル**

```bash
Name: Production
Colors: Red Alert（警告色）
Send text at start:
  echo "⚠️  PRODUCTION ENVIRONMENT ⚠️ "
  echo "Be careful with your commands!"
```

### 2. キーバインドカスタマイズ

**Keys > Key Bindings**

```
# よく使うコマンドのショートカット
⌘ + K → Send Text: clear\n
⌘ + L → Send Text: ls -la\n
⌘ + G → Send Text: git status\n

# 単語単位での移動
⌥ + ← → Send Escape Sequence: b
⌥ + → → Send Escape Sequence: f

# 行の先頭・末尾へ移動
⌘ + ← → Send Escape Sequence: OH
⌘ + → → Send Escape Sequence: OF
```

### 3. トリガー設定

**Profiles > Advanced > Triggers**

```bash
# エラー検出とハイライト
Regular Expression: (ERROR|FATAL|Exception)
Action: Highlight Text
Parameters: Red background

# 成功メッセージのハイライト
Regular Expression: (SUCCESS|PASSED|✓)
Action: Highlight Text
Parameters: Green background

# URLの自動リンク化
Regular Expression: https?://[^\s]+
Action: Open URL
```

### 4. 自動補完設定

**Advanced**

```
# 自動補完を有効化
Preferences > Profiles > Advanced
Semantic History: Open with default app

# パスの自動補完
Enable automatic profile switching: ✓
```

## 実用例

### 1. 開発環境セットアップ

```bash
# 開発用ウィンドウレイアウト
# ペイン1: メインターミナル
cd ~/Development/my-project
git status

# ペイン2: サーバー監視
npm run dev

# ペイン3: ログ監視
tail -f logs/app.log

# ペイン4: Git操作専用
git log --oneline -10
```

### 2. 複数プロジェクト管理

```bash
# プロジェクトごとのプロファイル作成
Profiles > Duplicate Profile

# Project A
Name: ProjectA-Dev
Working Directory: ~/Development/project-a
Send text at start: docker-compose up -d

# Project B
Name: ProjectB-Dev
Working Directory: ~/Development/project-b
Send text at start: npm run dev
```

### 3. リモートサーバー管理

```bash
# SSH接続プロファイル
Name: Production Server
Command: ssh user@production.example.com
Working Directory: ~
Badge Text: PROD
```

### 4. Docker開発環境

```bash
# Docker用ペイン構成
# ペイン1: アプリケーションコンテナ
docker exec -it myapp_web_1 bash

# ペイン2: データベースコンテナ
docker exec -it myapp_db_1 mysql -u root -p

# ペイン3: ログ監視
docker-compose logs -f

# ペイン4: Docker操作
docker ps
```

## tmuxとの違いと使い分け

### iTerm2の利点

```
✅ GUI操作で直感的
✅ マウス操作対応
✅ リッチなカラー表示
✅ 画像・動画表示可能
✅ 簡単な設定変更
✅ macOS統合機能
```

### tmuxの利点

```
✅ SSH経由でも使用可能
✅ セッションの永続化
✅ リモートサーバーで軽量
✅ キーボードのみで完結
✅ より細かい制御が可能
✅ クロスプラットフォーム
```

### 使い分けガイド

**iTerm2を選ぶべき場合:**
```bash
# ローカル開発作業
# GUI操作を重視
# リッチなビジュアル表示が必要
# 初心者〜中級者
# macOSでの作業
```

**tmuxを選ぶべき場合:**
```bash
# リモートサーバー作業
# セッション永続化が必要
# 軽量な環境
# 上級者
# SSH経由の作業が多い
```

**併用パターン:**
```bash
# ローカル: iTerm2
# リモート: iTerm2 + SSH + tmux
# 最強の組み合わせ
```

## カスタムテーマとカラースキーム

### 1. 人気のカラーテーマ

```bash
# Solarized Dark（目に優しい）
curl -L https://iterm2colorschemes.com/schemes/Solarized%20Dark.itermcolors -o ~/Downloads/Solarized-Dark.itermcolors

# Dracula（人気の暗いテーマ）
curl -L https://github.com/dracula/iterm/archive/master.zip -o ~/Downloads/dracula-iterm.zip

# Tokyo Night（モダンなテーマ）
curl -L https://github.com/enkia/tokyo-night-vscode-theme/raw/master/tokyo-night.itermcolors -o ~/Downloads/tokyo-night.itermcolors
```

### 2. テーマのインストール

```bash
# iTerm2設定を開く
⌘ + ,

# Profiles > Colors > Color Presets > Import
# ダウンロードした.itermcolorsファイルを選択
```

### 3. フォント設定

```bash
# 推奨フォント
Fira Code: brew install --cask font-fira-code
JetBrains Mono: brew install --cask font-jetbrains-mono
Source Code Pro: brew install --cask font-source-code-pro

# Nerd Fonts（アイコン付きフォント）
brew tap homebrew/cask-fonts
brew install --cask font-fira-code-nerd-font
```

## プラグインとツール連携

### 1. Shell Integration

```bash
# iTerm2 Shell Integrationをインストール
iTerm2 > Install Shell Integration

# または手動設定
curl -L https://iterm2.com/shell_integration/zsh -o ~/.iterm2_shell_integration.zsh
echo 'source ~/.iterm2_shell_integration.zsh' >> ~/.zshrc
```

### 2. 便利な機能

```bash
# コマンドマーク機能
# コマンドの開始・終了を自動マーク
⌘ + ↑ # 前のコマンド
⌘ + ↓ # 次のコマンド

# Attention（通知機能）
# 長時間実行コマンドの完了通知
sleep 10; echo -e "\a"  # ビープ音
```

### 3. Alfred連携

```bash
# Alfred Workflow
# iTerm2でディレクトリを開く
# Alfred > Workflows > iTerm2

# 使用例
Alfred > "it ~/Development"  # iTerm2で指定ディレクトリを開く
```

## トラブルシューティング

### 1. よくある問題

```bash
# 設定が反映されない
⌘ + Q でiTerm2を完全終了 → 再起動

# フォントが表示されない
brew install --cask font-fira-code
iTerm2 > Preferences > Profiles > Text > Font

# 色が正しく表示されない
echo $TERM  # xterm-256color であることを確認
export TERM=xterm-256color
```

### 2. パフォーマンス最適化

```bash
# 履歴制限設定
Preferences > Profiles > Session
Scrollback lines: 10000（デフォルトは無制限）

# GPU加速
Preferences > General > Magic
GPU Acceleration: ✓

# メモリ使用量削減
Preferences > Advanced
Reduce memory usage: ✓
```

### 3. バックアップと復元

```bash
# 設定のエクスポート
Preferences > General > Preferences > Save settings to folder
~/Library/Application Support/iTerm2/

# 設定のインポート
Preferences > General > Preferences > Load settings from folder
```

## 開発者向けTips

### 1. Git連携

```bash
# .gitconfigでiTerm2をエディタに設定
git config --global core.editor "code -w"

# iTerm2でGitログを美しく表示
alias glog="git log --oneline --decorate --graph --all"
```

### 2. Node.js開発

```bash
# プロファイル設定
Send text at start:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use node
```

### 3. Docker開発

```bash
# Docker compose用ショートカット
alias dc="docker-compose"
alias dcu="docker-compose up -d"
alias dcd="docker-compose down"
alias dcl="docker-compose logs -f"
```

### 4. 自動化スクリプト

```bash
#!/bin/bash
# dev-start.sh - 開発開始スクリプト

echo "Starting development environment..."

# iTerm2で新しいウィンドウを開く
osascript -e 'tell application "iTerm2" to create window with default profile'

# 分割ペインを作成してコマンド実行
osascript << EOF
tell application "iTerm2"
  tell current window
    create tab with default profile
    tell current session
      write text "cd ~/Development/my-project && npm run dev"
    end tell
    split horizontally with default profile
    tell last session
      write text "cd ~/Development/my-project && npm run watch:css"
    end tell
  end tell
end tell
EOF
```

---

このドキュメントは、iTerm2を最大限活用するための包括的なガイドです。基本的な使い方から高度なカスタマイズまで、開発者の生産性向上に役立つ実用的な情報を提供しています。