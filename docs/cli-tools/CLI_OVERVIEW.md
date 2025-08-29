# CLI・開発環境ツール 完全ガイド

## 📌 概要

AIコーディングをより効果的に行うための、ターミナル環境とCLIツールの総合ガイド。効率的な開発環境の構築方法と、必須ツールの使い方を解説します。

## 🖥️ カテゴリ分類

### 1. ターミナルエミュレータ
高機能なターミナル環境で開発効率を向上

### 2. シェル環境
カスタマイズ可能なシェルとその拡張

### 3. パッケージマネージャー
各言語のパッケージ管理ツール

### 4. バージョン管理
Gitとその拡張ツール

### 5. コンテナ・仮想化
Docker、Kubernetes関連

### 6. 開発支援ツール
ビルドツール、タスクランナー等

## 🎯 AIコーディングとの連携

### なぜCLIツールが重要か
- **Claude Code**: ターミナルで動作
- **Aider**: CLI専用ツール
- **MCP**: 多くがCLI経由で設定
- **自動化**: スクリプトとの連携

### 推奨セットアップ
```bash
# 基本構成
Terminal: iTerm2 / Windows Terminal
Shell: Zsh + Oh My Zsh
Git: GitHub CLI (gh)
Container: Docker + Docker Compose
Task: Make / Just
```

## 📊 ツール選択ガイド

### 初心者向け
1. **ターミナル**: デフォルトターミナル → iTerm2/Windows Terminal
2. **Git GUI**: GitHub Desktop
3. **パッケージ管理**: Homebrew (Mac) / Chocolatey (Windows)

### 中級者向け
1. **シェル拡張**: Oh My Zsh / Starship
2. **Git TUI**: lazygit
3. **タスクランナー**: Make

### 上級者向け
1. **ターミナルマルチプレクサ**: tmux
2. **カスタムシェル**: Fish / Nushell
3. **高度な自動化**: Task / Just

## 🔧 環境構築フロー

### Step 1: ターミナル環境
```bash
# Mac
brew install --cask iterm2

# Windows
winget install Microsoft.WindowsTerminal

# Linux
sudo apt install terminator
```

### Step 2: シェル設定
```bash
# Zsh + Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Starship プロンプト
curl -sS https://starship.rs/install.sh | sh
```

### Step 3: 必須ツール
```bash
# Git関連
brew install git gh tig

# 開発ツール
brew install docker node python rust

# 便利ツール
brew install fzf ripgrep bat exa
```

## 🚀 生産性向上Tips

### エイリアス設定
```bash
# ~/.zshrc または ~/.bashrc
alias ll='ls -la'
alias gs='git status'
alias dc='docker compose'
alias cl='claude-code'
```

### 関数定義
```bash
# プロジェクト quick start
function quickstart() {
  mkdir -p $1
  cd $1
  git init
  npm init -y
  echo "# $1" > README.md
}
```

### 自動補完
```bash
# Zsh補完
autoload -U compinit && compinit

# Fish風補完
source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh
```

## 📈 パフォーマンス最適化

### ターミナル高速化
- GPUアクセラレーション有効化
- フォントキャッシュ
- バッファサイズ調整

### シェル起動高速化
```bash
# 遅延読み込み
zsh-defer source heavy-plugin.zsh

# キャッシュ活用
eval "$(fasd --init auto)"
```

## 🔐 セキュリティ

### SSH鍵管理
```bash
# Ed25519鍵生成（推奨）
ssh-keygen -t ed25519 -C "email@example.com"

# SSH Agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### 認証情報管理
```bash
# 1Password CLI
op signin

# パスワードマネージャー統合
brew install --cask 1password-cli
```

## 🎨 カスタマイズ

### テーマ設定
- ターミナル: Dracula, Nord, Tokyo Night
- シェル: Powerlevel10k, Spaceship

### フォント
- 推奨: Nerd Fonts (アイコン付き)
- JetBrains Mono, Fira Code (リガチャ対応)

## 📚 学習リソース

### 公式ドキュメント
- [iTerm2 Documentation](https://iterm2.com/documentation.html)
- [Windows Terminal Docs](https://docs.microsoft.com/windows/terminal/)
- [Oh My Zsh Wiki](https://github.com/ohmyzsh/ohmyzsh/wiki)

### チュートリアル
- [The Art of Command Line](https://github.com/jlevy/the-art-of-command-line)
- [Learn Shell](https://www.learnshell.org/)

### 日本語リソース
- [ターミナル入門](https://qiita.com/tags/terminal)
- [CLI活用術](https://zenn.dev/topics/cli)

## 🔄 トレンド

### 2025年の注目ツール
1. **Warp**: AI搭載ターミナル
2. **Fig**: 自動補完の革命
3. **Nushell**: 構造化データシェル
4. **Zellij**: tmux代替
5. **Helix**: ターミナルエディタ

### AIとの統合
- ターミナル内AI補完
- 自然言語→コマンド変換
- エラー自動修正

## ⚡ クイックリファレンス

### 必須コマンド
```bash
# ファイル操作
ls, cd, pwd, mkdir, rm, cp, mv

# テキスト処理
cat, grep, sed, awk, cut, sort

# プロセス管理
ps, top, kill, jobs, bg, fg

# ネットワーク
curl, wget, ssh, scp, netstat

# 検索
find, locate, which, whereis
```

### ショートカット
| 操作 | Mac | Windows/Linux |
|------|-----|---------------|
| タブ補完 | Tab | Tab |
| コマンド履歴 | ↑↓ | ↑↓ |
| 行頭移動 | Ctrl+A | Ctrl+A |
| 行末移動 | Ctrl+E | Ctrl+E |
| クリア | Cmd+K | Ctrl+L |

---
*最終更新: 2025年8月30日*
*次回更新予定: 2025年9月15日*