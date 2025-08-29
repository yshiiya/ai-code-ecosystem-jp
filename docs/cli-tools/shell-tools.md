# シェル環境・拡張ツール 完全ガイド

## 🐚 モダンシェル環境

### Zsh + Oh My Zsh
- **特徴**: 最も人気のシェル拡張フレームワーク
- **重要度**: ⭐⭐⭐⭐⭐

**インストール**
```bash
# Zsh (多くの場合プリインストール)
brew install zsh  # Mac
apt install zsh   # Ubuntu

# Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

**必須プラグイン**
```bash
# ~/.zshrc
plugins=(
  git                # Git エイリアス
  docker            # Docker 補完
  kubectl           # Kubernetes 補完
  npm              # npm 補完
  python           # Python 補完
  zsh-autosuggestions  # Fish風補完
  zsh-syntax-highlighting  # シンタックスハイライト
  z                # ディレクトリジャンプ
  fzf              # ファジー検索
)
```

**テーマ設定**
```bash
# 人気のテーマ
ZSH_THEME="powerlevel10k/powerlevel10k"  # 最強
ZSH_THEME="spaceship"                     # シンプル
ZSH_THEME="agnoster"                      # クラシック
```

---

### Fish Shell
- **特徴**: ユーザーフレンドリー、自動補完が優秀
- **重要度**: ⭐⭐⭐⭐

**インストール**
```bash
# Mac
brew install fish

# Ubuntu
apt install fish

# デフォルトシェルに設定
chsh -s $(which fish)
```

**設定**
```fish
# ~/.config/fish/config.fish
set -g theme_powerline_fonts yes
set -g theme_display_git_branch yes
set -g theme_display_docker_machine yes

# エイリアス
alias gs="git status"
alias dc="docker compose"
alias cl="claude-code"
```

**プラグインマネージャー (Fisher)**
```bash
curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher

# プラグインインストール
fisher install jethrokuan/z
fisher install PatrickF1/fzf.fish
```

---

### Nushell
- **特徴**: 構造化データを扱える次世代シェル
- **重要度**: ⭐⭐⭐

**インストール**
```bash
brew install nushell  # Mac
cargo install nu      # Rust経由
```

**特徴的な機能**
```nu
# テーブル形式でデータ表示
ls | where size > 1mb | sort-by modified

# JSON/YAML/TOML の直接操作
open package.json | get dependencies

# パイプラインでのデータ変換
ps | where cpu > 10 | select name pid cpu
```

---

## 🎨 プロンプトカスタマイズ

### Starship
- **特徴**: Rust製、超高速、言語非依存
- **重要度**: ⭐⭐⭐⭐⭐

**インストール**
```bash
curl -sS https://starship.rs/install.sh | sh
```

**設定 (~/.config/starship.toml)**
```toml
# 基本設定
add_newline = true
command_timeout = 1000

# プロンプト形式
format = """
$username\
$hostname\
$directory\
$git_branch\
$git_status\
$python\
$nodejs\
$docker_context\
$line_break\
$character
"""

# Git表示
[git_branch]
symbol = "🌱 "
style = "bold green"

[git_status]
conflicted = "🏳"
ahead = "⇡${count}"
behind = "⇣${count}"
diverged = "⇕⇡${ahead_count}⇣${behind_count}"
untracked = "🤷"
modified = "📝"

# 言語表示
[nodejs]
format = "via [🟩 $version](bold green) "

[python]
format = 'via [🐍 ${pyenv_prefix}(${version} )(\($virtualenv\) )](blue)'
```

---

### Powerlevel10k
- **特徴**: Zsh専用、高速、設定ウィザード付き
- **重要度**: ⭐⭐⭐⭐

**インストール**
```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# ~/.zshrc
ZSH_THEME="powerlevel10k/powerlevel10k"

# 設定ウィザード実行
p10k configure
```

---

## 🔍 検索・ナビゲーション強化

### fzf (Fuzzy Finder)
- **用途**: ファジー検索
- **重要度**: ⭐⭐⭐⭐⭐

**インストール**
```bash
brew install fzf
$(brew --prefix)/opt/fzf/install  # キーバインド設定
```

**活用例**
```bash
# コマンド履歴検索 (Ctrl+R)
# ファイル検索
vim $(fzf)

# ディレクトリ移動
cd $(find . -type d | fzf)

# Git ブランチ切り替え
git checkout $(git branch | fzf)

# プロセスキル
kill -9 $(ps aux | fzf | awk '{print $2}')
```

---

### z / zoxide
- **用途**: スマートディレクトリジャンプ
- **重要度**: ⭐⭐⭐⭐⭐

**z (Oh My Zsh組み込み)**
```bash
# 使用例
z proj     # ~/Development/projects へジャンプ
z -l       # 履歴表示
```

**zoxide (Rust製、高速)**
```bash
brew install zoxide

# ~/.zshrc
eval "$(zoxide init zsh)"

# 使用
z proj     # ジャンプ
zi proj    # インタラクティブ選択
```

---

### ripgrep (rg)
- **用途**: 超高速grep
- **重要度**: ⭐⭐⭐⭐⭐

**インストール**
```bash
brew install ripgrep
```

**使用例**
```bash
# 基本検索
rg "TODO"

# ファイルタイプ指定
rg -t js "console.log"

# 除外設定
rg "search" --glob "!node_modules/*"

# 置換プレビュー
rg "old" --replace "new" --dry-run
```

---

### exa / eza
- **用途**: モダンな ls 代替
- **重要度**: ⭐⭐⭐⭐

**インストール**
```bash
brew install eza  # exaの後継
```

**エイリアス設定**
```bash
alias ls='eza'
alias ll='eza -l'
alias la='eza -la'
alias lt='eza --tree'
alias lg='eza -l --git'
```

---

## 🛠️ 開発支援ツール

### bat
- **用途**: cat代替、シンタックスハイライト付き
- **重要度**: ⭐⭐⭐⭐

```bash
brew install bat

# エイリアス
alias cat='bat'

# テーマ設定
bat --list-themes
export BAT_THEME="Dracula"
```

---

### tldr
- **用途**: 簡潔なmanページ
- **重要度**: ⭐⭐⭐⭐

```bash
brew install tldr

# 使用例
tldr git
tldr docker
tldr curl
```

---

### direnv
- **用途**: ディレクトリごとの環境変数
- **重要度**: ⭐⭐⭐⭐⭐

```bash
brew install direnv

# ~/.zshrc
eval "$(direnv hook zsh)"

# プロジェクトで使用
echo 'export API_KEY="secret"' > .envrc
direnv allow
```

---

## 📝 エイリアス・関数集

### 必須エイリアス
```bash
# ~/.zshrc または ~/.bashrc

# 基本
alias ll='ls -la'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'

# Git
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git pull'
alias gco='git checkout'
alias gb='git branch'
alias glog='git log --oneline --graph --decorate'

# Docker
alias dc='docker compose'
alias dps='docker ps'
alias dex='docker exec -it'
alias dlog='docker logs -f'

# npm/yarn
alias ni='npm install'
alias nr='npm run'
alias ys='yarn start'
alias yd='yarn dev'

# AIツール
alias cl='claude-code'
alias ai='aider'
alias cop='gh copilot'
```

### 便利な関数
```bash
# プロジェクト作成
mkproj() {
  mkdir -p "$1"
  cd "$1"
  git init
  echo "# $1" > README.md
  npm init -y
}

# ディレクトリ作成して移動
mkcd() {
  mkdir -p "$1" && cd "$1"
}

# Gitコミット＆プッシュ
gcp() {
  git add .
  git commit -m "$1"
  git push
}

# ポート使用プロセス確認
port() {
  lsof -ti:$1
}

# 天気予報
weather() {
  curl wttr.in/${1:-Tokyo}
}
```

---

## ⚡ パフォーマンス最適化

### シェル起動高速化
```bash
# 遅延読み込み
# ~/.zshrc
zinit ice wait lucid
zinit load zsh-users/zsh-syntax-highlighting

# nvm の遅延読み込み
lazy_load_nvm() {
  unset -f node npm npx
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
}
node() { lazy_load_nvm; node "$@"; }
npm() { lazy_load_nvm; npm "$@"; }
npx() { lazy_load_nvm; npx "$@"; }
```

### プロファイリング
```bash
# 起動時間計測
time zsh -i -c exit

# 詳細プロファイル
zsh -i -c exit --profile
```

---

## 🔐 セキュリティ

### コマンド履歴の管理
```bash
# 履歴から除外
export HISTIGNORE="*secret*:*password*:*token*"

# 履歴サイズ
export HISTSIZE=10000
export SAVEHIST=10000

# 重複除去
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE
```

---

## 📚 学習リソース

### 公式ドキュメント
- [Oh My Zsh](https://github.com/ohmyzsh/ohmyzsh/wiki)
- [Fish Shell](https://fishshell.com/docs/current/)
- [Starship](https://starship.rs/guide/)

### チートシート
- [Bash Cheatsheet](https://devhints.io/bash)
- [Zsh Tips](https://github.com/hmml/awesome-zsh)

---
*最終更新: 2025年8月30日*