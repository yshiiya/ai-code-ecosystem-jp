# fzf完全ガイド

## 概要

fzf（fuzzy finder）は、コマンドライン用の汎用ファジー検索ツールです。任意のリストから項目をインタラクティブに検索・選択でき、ファイル検索、コマンド履歴、Git操作など様々な場面で活用できます。高速で直感的なインターフェースを提供し、日常的なCLI作業を劇的に効率化します。

## インストール方法

### macOS

```bash
# Homebrew使用（推奨）
brew install fzf

# キーバインドとシェル補完を有効化
$(brew --prefix)/opt/fzf/install

# インストール確認
fzf --version
```

### Linux

```bash
# Ubuntu/Debian
sudo apt install fzf

# CentOS/RHEL/Fedora
sudo dnf install fzf

# Arch Linux
sudo pacman -S fzf

# 手動インストール（最新版）
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install
```

### Windows

```bash
# Chocolatey使用
choco install fzf

# Scoop使用
scoop install fzf

# 手動インストール
# GitHubリリースページから実行ファイルをダウンロード
```

## 初期設定

### 1. シェル統合設定

```bash
# インストール後の統合設定（自動実行される）
~/.fzf/install

# 手動設定が必要な場合
# ~/.zshrc または ~/.bashrc に追加
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
[ -f ~/.fzf.bash ] && source ~/.fzf.bash
```

### 2. 基本的な環境変数設定

```bash
# ~/.zshrc または ~/.bashrc に追加

# デフォルトオプション
export FZF_DEFAULT_OPTS="--height 40% --layout=reverse --border"

# デフォルトコマンド（ripgrepを使用）
export FZF_DEFAULT_COMMAND='rg --files --hidden --follow --glob "!.git/*"'

# ファイル検索用設定
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
export FZF_CTRL_T_OPTS="--preview 'cat {}' --preview-window=right:60%"

# ディレクトリ検索用設定
export FZF_ALT_C_OPTS="--preview 'tree -C {} | head -200'"
```

### 3. カラーテーマ設定

```bash
# ダークテーマ
export FZF_DEFAULT_OPTS="--color=dark \
--color=fg:-1,bg:-1,hl:#5fff87,fg+:#ffff87,bg+:#293739,hl+:#ffff87 \
--color=info:#af87ff,prompt:#5fff87,pointer:#ff87d7,marker:#ff87d7,spinner:#ff87d7"

# ライトテーマ
export FZF_DEFAULT_OPTS="--color=light \
--color=fg:#4d4d4c,bg:#eeeeee,hl:#d7005f,fg+:#4d4d4c,bg+:#e8e8e8,hl+:#d7005f \
--color=info:#4271ae,prompt:#8959a8,pointer:#d7005f,marker:#4271ae,spinner:#4271ae"
```

## 基本的な使い方

### 1. 基本操作

```bash
# 標準入力からfzfを起動
ls | fzf

# ファイル検索（Ctrl+T）
Ctrl+T

# ディレクトリ検索と移動（Alt+C）
Alt+C

# コマンド履歴検索（Ctrl+R）
Ctrl+R
```

### 2. キーバインド（fzf内）

```bash
# ナビゲーション
↑/↓ or Ctrl+J/K : カーソル移動
PageUp/PageDown : ページ移動
Home/End : 先頭/末尾へ移動

# 選択
Enter : 選択して終了
Tab : 複数選択モード切り替え
Shift+Tab : 選択解除

# 検索
文字入力 : インクリメンタル検索
Ctrl+A : 全選択
Ctrl+D : 選択解除

# その他
Esc or Ctrl+C : キャンセル
Ctrl+L : 画面クリア
```

### 3. 検索構文

```bash
# 基本的なファジー検索
fzf  # 入力に部分一致する項目を表示

# AND検索（スペース区切り）
word1 word2  # 両方の単語を含む項目

# OR検索（パイプ区切り）
word1 | word2  # どちらかの単語を含む項目

# 否定検索（先頭に!）
!word  # wordを含まない項目

# 厳密一致（'で囲む）
'exact-match'  # 完全一致

# 先頭一致（^）
^prefix  # prefixで始まる項目

# 末尾一致（$）
suffix$  # suffixで終わる項目
```

## 実用例

### 1. ファイル操作

```bash
# ファイル選択して編集
vim $(find . -type f | fzf)

# 複数ファイル選択（Tab）
vim $(find . -type f | fzf -m)

# プレビュー付きファイル選択
find . -type f | fzf --preview 'head -100 {}'

# ファイル削除（危険！確認必要）
rm $(find . -type f | fzf -m --preview 'file {}')
```

### 2. Git操作

```bash
# ブランチ切り替え
git checkout $(git branch | fzf | sed 's/^[* ]*//')

# コミット選択
git show $(git log --oneline | fzf | cut -d' ' -f1)

# ファイル選択してdiff表示
git diff $(git status --porcelain | fzf | cut -c4-)

# stash選択して適用
git stash show -p $(git stash list | fzf | cut -d':' -f1)
```

### 3. プロセス管理

```bash
# プロセス選択してkill
kill $(ps aux | fzf | awk '{print $2}')

# Docker コンテナ操作
docker exec -it $(docker ps | fzf | awk '{print $1}') bash

# サービス管理
sudo systemctl restart $(systemctl list-units --type=service | fzf | awk '{print $1}')
```

### 4. ディレクトリ操作

```bash
# ディレクトリジャンプ
cd $(find . -type d | fzf)

# よく使うディレクトリの管理
alias j='cd $(cat ~/.bookmarks | fzf)'

# ディレクトリサイズ確認
du -sh */ | fzf --preview 'ls -la {2}'
```

## シェル設定と拡張

### 1. Zsh設定例

```bash
# ~/.zshrc

# fzf基本設定
export FZF_DEFAULT_OPTS="
  --height 40%
  --layout=reverse
  --border
  --info=inline
  --multi
  --preview-window=:hidden
  --preview '([[ -f {} ]] && (bat --style=numbers --color=always {} || cat {})) || ([[ -d {} ]] && (tree -C {} | head -200))'
  --bind '?:toggle-preview'
  --bind 'ctrl-a:select-all'
  --bind 'ctrl-y:execute-silent(echo {+} | pbcopy)'
  --bind 'ctrl-e:execute(echo {+} | xargs -o vim)'
  --bind 'ctrl-v:execute(code {+})'
"

# 便利なエイリアス
alias f='fzf'
alias ff='find . -type f | fzf'
alias fd='find . -type d | fzf'
alias fh='history | fzf'

# 関数定義
# ファイル検索して編集
fe() {
  local files
  IFS=$'\n' files=($(fzf-tmux --query="$1" --multi --select-1 --exit-0))
  [[ -n "$files" ]] && ${EDITOR:-vim} "${files[@]}"
}

# Git ブランチ切り替え
fbr() {
  local branches branch
  branches=$(git branch -vv) &&
  branch=$(echo "$branches" | fzf +m) &&
  git checkout $(echo "$branch" | awk '{print $1}' | sed "s/.* //")
}

# プロセスkill
fkill() {
  local pid
  pid=$(ps -ef | sed 1d | fzf -m | awk '{print $2}')
  if [ "x$pid" != "x" ]; then
    echo $pid | xargs kill -${1:-9}
  fi
}
```

### 2. Bash設定例

```bash
# ~/.bashrc

# fzf基本設定
export FZF_DEFAULT_OPTS='--height 40% --layout=reverse --border'

# 便利な関数
# ディレクトリ検索と移動
fcd() {
  local dir
  dir=$(find ${1:-.} -path '*/\.*' -prune -o -type d -print 2> /dev/null | fzf +m) &&
  cd "$dir"
}

# ファイル検索と編集
fv() {
  local file
  file=$(fzf +m -q "$1") && ${EDITOR:-vim} "$file"
}

# コマンド履歴検索
fh() {
  print -z $( ([ -n "$ZSH_NAME" ] && fc -l 1 || history) | fzf +s --tac | sed 's/ *[0-9]* *//')
}
```

### 3. 高度なカスタマイズ

```bash
# ~/.config/fzf/config

# カスタムプレビューコマンド
export FZF_CTRL_T_OPTS="
  --preview 'if [[ {} == *.md ]]; then
    glow {};
  elif [[ {} == *.json ]]; then
    jq . {};
  elif [[ {} == *.yml || {} == *.yaml ]]; then
    yq eval . {};
  else
    bat --style=numbers --color=always {} || cat {};
  fi'
  --bind 'ctrl-/:change-preview-window(down|hidden|)'
"

# ディレクトリプレビュー
export FZF_ALT_C_OPTS="
  --preview 'tree -C {} | head -200'
  --bind 'ctrl-/:change-preview-window(down|hidden|)'
"

# Git統合
export FZF_CTRL_G_COMMAND='git log --oneline --color=always'
export FZF_CTRL_G_OPTS='
  --ansi
  --preview "git show --color=always {1}"
  --bind "ctrl-m:execute(git show {1} | less -R)"
'
```

## 他ツールとの連携

### 1. ripgrep（rg）との連携

```bash
# ripgrepをデフォルトコマンドに設定
export FZF_DEFAULT_COMMAND='rg --files --no-ignore --hidden --follow --glob "!.git/*"'

# 内容検索
rg_search() {
  rg --color=always --line-number --no-heading --smart-case "${*:-}" |
    fzf --ansi \
        --color "hl:-1:underline,hl+:-1:underline:reverse" \
        --delimiter : \
        --preview 'bat --color=always {1} --highlight-line {2}' \
        --preview-window 'up,60%,border-bottom,+{2}+3/3,~3' \
        --bind 'enter:become(vim {1} +{2})'
}

alias rg='rg_search'
```

### 2. fd（find代替）との連携

```bash
# fdを使用したファイル検索
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

# ディレクトリ検索
export FZF_ALT_C_COMMAND='fd --type d --hidden --follow --exclude .git'
```

### 3. batとの連携

```bash
# プレビューでbatを使用
export FZF_CTRL_T_OPTS="
  --preview 'bat --style=numbers --color=always --line-range :500 {}'
  --bind 'ctrl-/:change-preview-window(down|hidden|)'
"

# batとfzfを組み合わせた関数
fbat() {
  local file
  file=$(fzf --preview 'bat --style=numbers --color=always {}') && bat "$file"
}
```

### 4. tmux連携

```bash
# tmux セッション選択
ftmux() {
  local session
  session=$(tmux list-sessions -F "#{session_name}" 2>/dev/null | fzf --exit-0) &&
  tmux attach-session -t "$session"
}

# tmux ウィンドウ選択
ftmux-window() {
  local window
  window=$(tmux list-windows -F "#{window_index}: #{window_name}" | fzf --exit-0) &&
  tmux select-window -t "${window%%:*}"
}
```

## Vim統合

### 1. Vim Plugin設定

```vim
" ~/.vimrc
" fzf.vim プラグイン
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'junegunn/fzf.vim'

" キーマップ
nnoremap <C-p> :Files<CR>
nnoremap <C-g> :Rg<CR>
nnoremap <C-b> :Buffers<CR>
nnoremap <C-h> :History<CR>

" カスタム設定
let g:fzf_layout = { 'window': { 'width': 0.8, 'height': 0.8 } }
let g:fzf_colors = {
  \ 'fg':      ['fg', 'Normal'],
  \ 'bg':      ['bg', 'Normal'],
  \ 'hl':      ['fg', 'Comment'],
  \ 'fg+':     ['fg', 'CursorLine', 'CursorColumn', 'Normal'],
  \ 'bg+':     ['bg', 'CursorLine', 'CursorColumn'],
  \ 'hl+':     ['fg', 'Statement'],
  \ 'info':    ['fg', 'PreProc'],
  \ 'border':  ['fg', 'Ignore'],
  \ 'prompt':  ['fg', 'Conditional'],
  \ 'pointer': ['fg', 'Exception'],
  \ 'marker':  ['fg', 'Keyword'],
  \ 'spinner': ['fg', 'Label'],
  \ 'header':  ['fg', 'Comment'] }
```

### 2. よく使うfzf.vimコマンド

```vim
:Files          " ファイル検索
:GFiles         " Git管理ファイル検索
:Buffers        " バッファ一覧
:History        " ファイル履歴
:History:       " コマンド履歴
:History/       " 検索履歴
:Lines          " 開いているファイルの行検索
:BLines         " 現在のバッファの行検索
:Tags           " ctags
:BTags          " 現在のバッファのtags
:Marks          " マーク一覧
:Windows        " ウィンドウ一覧
:Helptags       " ヘルプタグ
:Commands       " Vimコマンド
:Maps           " キーマップ
```

## 高度な活用例

### 1. 開発環境統合

```bash
# 開発プロジェクト管理
dev() {
  local project
  project=$(find ~/Development -name ".git" -type d | sed 's|/.git||' | sed "s|$HOME/Development/||" | fzf) &&
  cd ~/Development/$project
}

# Docker開発環境
ddev() {
  local container
  container=$(docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" | fzf --header-lines=1 | awk '{print $1}') &&
  docker exec -it $container bash
}

# Kubernetes操作
kdev() {
  local pod
  pod=$(kubectl get pods | fzf --header-lines=1 | awk '{print $1}') &&
  kubectl exec -it $pod -- bash
}
```

### 2. ログ解析

```bash
# ログファイル検索と表示
flog() {
  local logfile
  logfile=$(find /var/log -name "*.log" 2>/dev/null | fzf --preview 'tail -100 {}') &&
  less +F "$logfile"
}

# エラーログ検索
ferror() {
  rg -i "error|exception|fail" /var/log/ | fzf --ansi --preview 'echo {}' --bind 'enter:execute(less +/{2} {1})'
}
```

### 3. ネットワーク管理

```bash
# ポート監視
fport() {
  netstat -tulpn | fzf --header-lines=2 --preview 'lsof -i :{4}' | awk '{print $4}' | cut -d':' -f2
}

# SSH接続管理
fssh() {
  local host
  host=$(grep "^Host " ~/.ssh/config | awk '{print $2}' | fzf) &&
  ssh "$host"
}
```

### 4. システム管理

```bash
# サービス管理
fservice() {
  local service
  service=$(systemctl list-units --type=service --state=running | fzf --header-lines=1 | awk '{print $1}') &&
  systemctl status "$service"
}

# 大きなファイル検索
fbig() {
  find . -type f -exec ls -lh {} \; 2>/dev/null | awk '$5 ~ /[0-9]+M|[0-9]+G/ {print $0}' | fzf --preview 'file {9}'
}
```

## トラブルシューティング

### 1. よくある問題

```bash
# fzfが見つからない
which fzf  # インストール確認
echo $PATH  # PATH確認

# キーバインドが機能しない
# ~/.zshrc または ~/.bashrc で確認
grep fzf ~/.zshrc
source ~/.zshrc  # 設定再読み込み

# 日本語ファイル名で文字化け
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8
```

### 2. パフォーマンス最適化

```bash
# 大きなディレクトリでの高速化
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow'  # findより高速

# プレビュー無効化（高速化）
export FZF_DEFAULT_OPTS='--no-preview'

# 結果数制限
export FZF_DEFAULT_OPTS='--height 40% --max-results 1000'
```

### 3. メモリ使用量削減

```bash
# ファイル数制限
find . -type f | head -10000 | fzf

# 除外パターン設定
export FZF_DEFAULT_COMMAND='rg --files --ignore-file ~/.fzf-ignore'

# ~/.fzf-ignore ファイル例
node_modules/
*.log
*.tmp
.git/
```

---

このドキュメントは、fzfを効果的に活用するための包括的なガイドです。基本的な使い方から高度なカスタマイズまで、コマンドライン作業を革新的に改善するための実用的な情報を提供しています。