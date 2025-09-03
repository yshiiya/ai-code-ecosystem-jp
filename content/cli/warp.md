# Warp完全ガイド

## 概要

Warpは、AI機能を搭載した次世代ターミナルです。従来のターミナルとは異なり、ブロック形式でコマンドを管理し、AI補完機能、コマンド共有、リアルタイム協業など、モダンな機能を提供します。Rustで構築されており、高速で美しいUIが特徴的な革新的なターミナルエミュレータです。

## インストール方法

### macOS（推奨プラットフォーム）

```bash
# 公式サイトからダウンロード（推奨）
# https://www.warp.dev/download

# または Homebrew使用
brew install --cask warp

# インストール確認
warp --version
```

### Linux（Beta）

```bash
# Debian/Ubuntu
curl -fsSL https://releases.warp.dev/linux/v0.2024.01.09.08.01.stable_01/warp-terminal_0.2024.01.09.08.01.stable.01_amd64.deb -o warp.deb
sudo dpkg -i warp.deb

# Arch Linux（AUR）
yay -S warp-terminal
```

**注意:** Windowsサポートは開発中です。現在はmacOSとLinuxでの利用が可能です。

## 初期設定

### 1. アカウント設定

```bash
# Warpを初回起動
open -a Warp

# GitHub/Google/メールでアカウント作成（推奨）
# AI機能やクラウド同期を利用するために必要
```

### 2. 基本設定

**Settings > Appearance**

```
Theme: Dark Mode / Light Mode
Font: SF Mono, 14px（推奨）
Opacity: 95%
Blur: Enabled
```

**Settings > Features**

```
AI Command Search: Enabled
Block Input Mode: Enabled
Command Palette: ⌘ + P
Warp Drive (Cloud sync): Enabled
```

### 3. Shell統合設定

```bash
# Zsh統合（自動設定される場合が多い）
echo 'source ~/.warp/shell_integration/zsh' >> ~/.zshrc

# 手動設定が必要な場合
curl -fsSL https://raw.githubusercontent.com/warpdotdev/shell-integrations/main/zsh/warp.zsh -o ~/.warp/shell_integration/zsh
```

## 主要機能

### 1. ブロック機能

```bash
# Warpの最大の特徴：コマンドブロック
# 各コマンドが独立したブロックとして表示
# ブロック単位でのコピー、共有、再実行が可能

# ブロック操作
Hover over block → 右上の "⋯" メニュー
- Copy command
- Copy output
- Share block
- Re-run command
- Add to notebook
```

### 2. AI補完機能（Warp AI）

```bash
# AI機能の使い方

# 自然言語でコマンド検索
⌘ + ` (backtick) または "Ask Warp AI" ボタン

# 使用例
"list all files modified today"
→ find . -type f -newermt "today" -print

"compress this folder"
→ tar -czf archive.tar.gz folder_name/

"show git commits from last week"
→ git log --since="1 week ago" --oneline

# AIコマンド説明
コマンドの横に表示される "?" アイコンをクリック
→ コマンドの詳細説明と使用例を表示
```

### 3. コマンドパレット

```bash
# コマンドパレット起動
⌘ + P

# 利用可能な機能
- Search workflows
- Recent commands
- Bookmarked commands
- Warp Drive items
- Settings
- Workflows
```

### 4. ワークフロー機能

```bash
# ワークフローを作成・管理
⌘ + Shift + W

# よく使うワークフロー例
Development Setup:
  1. cd ~/projects/my-app
  2. git pull
  3. npm install
  4. npm run dev

Docker Cleanup:
  1. docker container prune -f
  2. docker image prune -a -f
  3. docker volume prune -f
```

## 実用例

### 1. 開発環境セットアップ

```bash
# プロジェクト開始ワークフロー
# Warp Drive に保存して再利用可能

# Node.js プロジェクト
cd ~/Development/my-project
git status
git pull origin main
npm install
npm run dev

# Docker プロジェクト
cd ~/Development/docker-app
git pull
docker-compose down
docker-compose up --build -d
docker-compose logs -f
```

### 2. AI機能活用例

```bash
# 自然言語でのコマンド生成例

# 質問: "find all JavaScript files larger than 1MB"
# AI回答:
find . -name "*.js" -size +1M -type f

# 質問: "show me the top 10 largest files in current directory"
# AI回答:
find . -type f -exec ls -la {} \; | sort -nrk 5 | head -10

# 質問: "kill all node processes"
# AI回答:
pkill -f node

# 質問: "create a git branch and switch to it"
# AI回答:
git checkout -b feature/new-branch
```

### 3. チーム協業

```bash
# コマンドブロック共有
1. コマンド実行
2. ブロック右上の共有ボタンクリック
3. 生成されたリンクをチームメンバーに共有

# Warp Drive活用
- よく使うコマンドをクラウドに保存
- チーム間でワークフロー共有
- 複数デバイス間での設定同期
```

### 4. Git操作の効率化

```bash
# Git関連でのAI活用

# 質問: "show git history with file changes"
# AI回答:
git log --stat --oneline

# 質問: "undo last commit but keep changes"
# AI回答:
git reset --soft HEAD~1

# 質問: "create new feature branch from main"
# AI回答:
git checkout main && git pull && git checkout -b feature/your-feature-name
```

## 料金プランと無料枠

### 無料プラン（Individual）

```
✅ 基本的なターミナル機能
✅ AI Command Search（月100回まで）
✅ ブロック機能
✅ 基本的なワークフロー
✅ 個人用Warp Drive
✅ テーマとカスタマイズ
```

### 有料プラン（Team - $20/月/ユーザー）

```
✅ 無制限AI機能
✅ チーム共有機能
✅ 高度なワークフロー
✅ 管理者機能
✅ セキュリティ強化
✅ プライオリティサポート
✅ カスタムテーマ
✅ 高度な分析機能
```

### Enterprise

```
✅ カスタム価格設定
✅ SSO統合
✅ 高度なセキュリティ
✅ オンプレミス展開
✅ カスタマーサクセス
```

## カスタマイズ設定

### 1. テーマ設定

```bash
# Settings > Appearance > Themes

# 人気のテーマ
- Warp Dark（デフォルト）
- Warp Light
- Dracula
- Solarized Dark
- Tokyo Night
- One Dark Pro
```

### 2. フォント設定

```bash
# 推奨フォント
SF Mono: システムデフォルト（macOS）
JetBrains Mono: brew install --cask font-jetbrains-mono
Fira Code: brew install --cask font-fira-code
Source Code Pro: brew install --cask font-source-code-pro

# 設定場所
Settings > Appearance > Text > Font Family
```

### 3. キーバインド設定

```bash
# Settings > Keybindings

# よく使うショートカット
⌘ + T: 新しいタブ
⌘ + W: タブを閉じる
⌘ + D: ペイン分割
⌘ + `: AI機能起動
⌘ + P: コマンドパレット
⌘ + K: 画面クリア
⌃ + R: コマンド履歴検索
```

### 4. プロンプトカスタマイズ

```bash
# ~/.zshrc または ~/.bashrc で設定

# Starship（推奨）
brew install starship
echo 'eval "$(starship init zsh)"' >> ~/.zshrc

# Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# PowerLevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc
```

## 従来ターミナルとの比較

### Warpの優位点

```
✅ AI搭載でコマンド提案
✅ ブロック単位での管理
✅ 美しいモダンUI
✅ 簡単な設定・カスタマイズ
✅ クラウド同期
✅ チーム協業機能
✅ コマンド共有
✅ 高速レンダリング
```

### 従来ターミナルの優位点

```
✅ 軽量（リソース使用量少）
✅ プライバシー重視
✅ オフライン完全対応
✅ カスタマイズ自由度高
✅ 古いシステム対応
✅ ネットワーク不要
```

### 使い分けガイド

**Warpが適している場面:**
```bash
# 個人開発・学習
# チーム協業が必要
# AI機能を活用したい
# モダンなUIを求める
# コマンド履歴管理重視
# 設定の簡単さ重視
```

**従来ターミナルが適している場面:**
```bash
# 本番サーバー作業
# プライバシー重視
# リソース制約がある環境
# オフライン作業
# 高度なカスタマイズ
```

## トラブルシューティング

### 1. よくある問題

```bash
# Warpが起動しない
# 解決法1: 再インストール
brew uninstall --cask warp
brew install --cask warp

# 解決法2: 設定リセット
rm -rf ~/.warp
# Warpを再起動して初期設定

# AI機能が使えない
# アカウントログインを確認
Warp > Sign In

# Shell統合が機能しない
# 手動で統合スクリプト追加
curl -fsSL https://raw.githubusercontent.com/warpdotdev/shell-integrations/main/zsh/warp.zsh >> ~/.zshrc
source ~/.zshrc
```

### 2. パフォーマンス最適化

```bash
# GPU加速設定
Settings > Performance > GPU acceleration: Enabled

# メモリ使用量最適化
Settings > Performance > 
- Reduce animations: Enabled（必要に応じて）
- Limit scrollback: 10000 lines

# ネットワーク設定
Settings > Privacy >
- Crash reporting: Disabled（必要に応じて）
- Analytics: Disabled（必要に応じて）
```

### 3. プライバシー設定

```bash
# データ共有設定
Settings > Privacy > Data Collection

# 推奨設定（プライバシー重視）
- Crash Reports: Enabled（開発者支援のため）
- Anonymous Analytics: Disabled
- AI Data Usage: Review and adjust

# オフラインモード
Settings > AI > Disable AI features
# ただし、主要機能が制限される
```

## 開発者向け高度な使用法

### 1. カスタムワークフロー

```bash
# ~/.warp/workflows/development.yml
name: "Full Stack Development"
description: "Complete development environment setup"
steps:
  - name: "Navigate to project"
    command: "cd ~/Development/my-app"
  - name: "Check git status"
    command: "git status"
  - name: "Install dependencies"
    command: "npm install"
  - name: "Start development server"
    command: "npm run dev"
  - name: "Open in browser"
    command: "open http://localhost:3000"
```

### 2. AI機能の高度な活用

```bash
# 複雑なワンライナー生成
AI Query: "find all typescript files, exclude node_modules, and count lines of code"
AI Response: find . -name "*.ts" -not -path "*/node_modules/*" -exec wc -l {} + | tail -n 1

# デバッグ支援
AI Query: "show me all running processes consuming more than 100MB RAM"
AI Response: ps aux | awk '$6 > 100000 {print $0}'

# システム管理
AI Query: "clean up docker completely and free disk space"
AI Response: docker system prune -a -f && docker volume prune -f
```

### 3. 環境別設定管理

```bash
# 開発環境用設定
# ~/.warp/settings/development.json
{
  "theme": "dark",
  "ai_enabled": true,
  "workflows": ["development", "testing", "deployment"],
  "bookmarks": [
    "cd ~/Development",
    "docker-compose up -d",
    "npm run dev"
  ]
}

# 本番環境用設定（制限的）
{
  "theme": "high_contrast",
  "ai_enabled": false,
  "confirm_destructive_commands": true
}
```

### 4. チーム協業のベストプラクティス

```bash
# チーム共有ワークフロー例

# 1. オンボーディングワークフロー
name: "New Developer Setup"
steps:
  - "git clone https://github.com/company/project"
  - "cd project"
  - "cp .env.example .env"
  - "npm install"
  - "npm run db:migrate"
  - "npm run dev"

# 2. デプロイメントワークフロー
name: "Production Deploy"
steps:
  - "git checkout main"
  - "git pull origin main"
  - "npm run build"
  - "npm run test"
  - "npm run deploy:prod"

# 3. 緊急対応ワークフロー
name: "Emergency Hotfix"
steps:
  - "git checkout main"
  - "git pull origin main"
  - "git checkout -b hotfix/issue-name"
  - "# Make your changes"
  - "git commit -am 'hotfix: description'"
  - "git push origin hotfix/issue-name"
```

---

このドキュメントは、Warpターミナルを効果的に活用するための包括的なガイドです。AI機能を最大限に活用し、モダンな開発体験を実現するための実用的な情報を提供しています。