# ripgrep完全ガイド

## 概要

ripgrep（rg）は、Rust言語で開発された高速なgrep代替ツールです。従来のgrepやag（The Silver Searcher）を凌駕する検索速度を持ち、デフォルトで再帰検索、.gitignore対応、Unicode対応など、現代的な機能を備えています。大規模なコードベースでも瞬時に検索結果を表示し、開発者の生産性を大幅に向上させます。

## インストール方法

### macOS

```bash
# Homebrew使用（推奨）
brew install ripgrep

# MacPorts使用
sudo port install ripgrep

# インストール確認
rg --version
```

### Linux

```bash
# Ubuntu/Debian (18.04以降)
sudo apt install ripgrep

# 古いUbuntuでは
curl -LO https://github.com/BurntSushi/ripgrep/releases/download/13.0.0/ripgrep_13.0.0_amd64.deb
sudo dpkg -i ripgrep_13.0.0_amd64.deb

# CentOS/RHEL/Fedora
sudo dnf install ripgrep

# Arch Linux
sudo pacman -S ripgrep

# Snapパッケージ
sudo snap install ripgrep --classic
```

### Windows

```bash
# Chocolatey使用
choco install ripgrep

# Scoop使用
scoop install ripgrep

# Winget使用
winget install BurntSushi.ripgrep.MSVC

# 手動インストール
# GitHubリリースページから実行ファイルをダウンロード
```

### Cargo（Rustパッケージマネージャー）

```bash
# すべてのプラットフォームで使用可能
cargo install ripgrep

# 最新の開発版
cargo install --git https://github.com/BurntSushi/ripgrep ripgrep
```

## 基本的な使い方

### 1. 基本的な検索

```bash
# 基本的な文字列検索
rg "search_term"

# 現在ディレクトリとサブディレクトリを再帰的に検索
rg "function" .

# 特定ファイルでの検索
rg "pattern" file.txt

# 複数ファイルでの検索
rg "pattern" file1.txt file2.txt
```

### 2. よく使うオプション

```bash
# 大文字小文字を区別しない検索
rg -i "pattern"
rg --ignore-case "pattern"

# 単語境界での完全一致
rg -w "word"
rg --word-regexp "word"

# 行番号表示
rg -n "pattern"
rg --line-number "pattern"

# 該当ファイル名のみ表示
rg -l "pattern"
rg --files-with-matches "pattern"

# 該当しないファイル名を表示
rg --files-without-match "pattern"

# マッチした行数をカウント
rg -c "pattern"
rg --count "pattern"
```

### 3. 出力フォーマット

```bash
# コンテキスト表示（前後の行も表示）
rg -C 3 "pattern"           # 前後3行
rg -A 2 -B 1 "pattern"      # 後2行、前1行

# カラー出力制御
rg --color=always "pattern"  # 常にカラー出力
rg --color=never "pattern"   # カラー出力なし

# ファイルパスとマッチ内容のみ表示
rg --no-heading "pattern"

# 統計情報表示
rg --stats "pattern"
```

## 高度な検索機能

### 1. 正規表現

```bash
# 基本的な正規表現（デフォルトで有効）
rg "^function"              # 行頭の"function"
rg "error$"                 # 行末の"error"
rg "test.*case"             # "test"と"case"の間に任意文字
rg "[0-9]{3}-[0-9]{4}"      # 電話番号パターン

# 正規表現を無効化（リテラル検索）
rg -F "special.chars*"
rg --fixed-strings "special.chars*"

# 複数行マッチング
rg -U "start.*?end"
rg --multiline "start.*?end"

# 大文字小文字混合の正規表現
rg "(?i)pattern"            # パターンのみ大文字小文字無視
```

### 2. ファイル種別指定

```bash
# 特定のファイルタイプのみ検索
rg -t py "pattern"          # Pythonファイル
rg -t js "pattern"          # JavaScriptファイル
rg -t rs "pattern"          # Rustファイル
rg -t java "pattern"        # Javaファイル
rg -t html "pattern"        # HTMLファイル
rg -t css "pattern"         # CSSファイル

# 複数のファイルタイプ
rg -t py -t js "pattern"    # PythonとJavaScript

# ファイルタイプを除外
rg -T js "pattern"          # JavaScriptファイルを除外

# サポートされるファイルタイプ一覧
rg --type-list
```

### 3. パスとファイル指定

```bash
# glob パターンでファイル指定
rg -g "*.py" "pattern"      # Pythonファイルのみ
rg -g "!*.min.js" "pattern" # minifyされたJSファイルを除外
rg -g "src/**/*.rs" "pattern" # srcディレクトリ下のRustファイル

# 隠しファイルも検索
rg --hidden "pattern"

# .gitignore を無視
rg --no-ignore "pattern"

# すべての無視設定を無効化
rg --no-ignore --hidden "pattern"

# 特定ディレクトリを除外
rg --glob "!node_modules/**" "pattern"
rg --glob "!target/**" "pattern"
```

## 実用例

### 1. 開発作業での活用

```bash
# TODOコメント検索
rg -i "todo|fixme|hack|xxx"

# 関数定義検索
rg "^function\s+\w+" -t js
rg "def\s+\w+" -t py
rg "fn\s+\w+" -t rs

# import/include文検索
rg "^import\s+" -t py
rg "^#include\s+" -t cpp
rg "^use\s+" -t rs

# エラーハンドリング検索
rg "catch|except|panic|unwrap|expect" -t py -t rs

# 設定ファイル内の特定設定検索
rg "database.*url" -g "*.yml" -g "*.yaml" -g "*.json"
```

### 2. ログ解析

```bash
# エラーログ検索
rg -i "error|exception|fatal|critical" /var/log/

# 特定時間のログ検索
rg "2024-01-15 1[0-5]:" /var/log/app.log

# IPアドレス抽出
rg "\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b" access.log

# HTTPステータスコード検索
rg " [45][0-9]{2} " access.log

# 特定ユーザーのアクション
rg "user_id.*12345" app.log
```

### 3. セキュリティ監査

```bash
# パスワードやAPIキーの検索
rg -i "password|secret|key|token" --type-not log

# ハードコードされた認証情報
rg "api[_-]?key\s*=\s*['\"][^'\"]{10,}" -t py -t js

# SQL injection のリスク検索
rg "SELECT.*\+.*\+" -t php -t py

# デバッグ用コードの検出
rg "console\.log|print\(|debug|var_dump" -t js -t py -t php
```

### 4. リファクタリング支援

```bash
# 特定の関数やクラスの使用箇所検索
rg "class_name|function_name" --type py

# 非推奨API使用箇所
rg "deprecated_function" -A 2 -B 1

# 使用されていない変数検索（簡易的）
rg "let\s+(\w+)" -o -r '$1' | sort | uniq -c | sort -n

# 重複コードの検出（同じパターンの行）
rg "(.{50,})" -o | sort | uniq -d
```

## 設定とカスタマイズ

### 1. 設定ファイル

```bash
# 設定ファイルの場所
# Linux/macOS: ~/.config/ripgrep/config または ~/.ripgreprc
# Windows: %APPDATA%\ripgrep\config

# 設定ファイル例 (~/.ripgreprc)
--smart-case
--hidden
--follow
--glob=!.git/*
--glob=!node_modules/*
--glob=!target/*
--glob=!*.min.js
--glob=!*.min.css
--colors=line:fg:yellow
--colors=line:style:bold
--colors=path:fg:green
--colors=match:fg:black
--colors=match:bg:yellow
```

### 2. 環境変数

```bash
# ~/.bashrc または ~/.zshrc に追加

# デフォルトオプション
export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"

# 色設定
export RIPGREP_COLOR_LINE="fg:yellow"
export RIPGREP_COLOR_PATH="fg:green"
export RIPGREP_COLOR_MATCH="fg:black,bg:yellow"

# エイリアス設定
alias rg='rg --color=auto --heading --line-number'
alias rgi='rg -i'                    # 大文字小文字無視
alias rgl='rg -l'                    # ファイル名のみ
alias rgn='rg --no-ignore --hidden'  # 全ファイル検索
```

### 3. カスタムファイルタイプ

```bash
# ~/.ripgreprc での設定
--type-add=web:*.{html,css,js,ts,jsx,tsx}
--type-add=config:*.{yml,yaml,toml,ini,conf}
--type-add=docs:*.{md,rst,txt}

# 使用例
rg "pattern" -t web      # HTML,CSS,JS,TS,JSX,TSX
rg "pattern" -t config   # 設定ファイル
rg "pattern" -t docs     # ドキュメント
```

## 他ツールとの連携

### 1. fzfとの連携

```bash
# ~/.bashrc または ~/.zshrc
# ripgrepとfzfを組み合わせた関数
rg_fzf() {
  rg --color=always --line-number --no-heading --smart-case "${*:-}" |
    fzf --ansi \
        --color "hl:-1:underline,hl+:-1:underline:reverse" \
        --delimiter : \
        --preview 'bat --color=always {1} --highlight-line {2}' \
        --preview-window 'up,60%,border-bottom,+{2}+3/3,~3' \
        --bind 'enter:become(vim {1} +{2})'
}

alias rgf='rg_fzf'
```

### 2. Vimとの連携

```vim
" ~/.vimrc でのripgrep統合
if executable('rg')
  set grepprg=rg\ --vimgrep\ --no-heading\ --smart-case
  set grepformat=%f:%l:%c:%m
endif

" 検索結果をquickfixに表示
command! -nargs=+ Rg execute 'silent grep! <args>' | redraw! | copen

" ファイル内検索
nnoremap <Leader>rg :Rg<Space>
nnoremap <Leader>rw :Rg <C-R><C-W><CR>
```

### 3. VS Codeとの連携

```json
// settings.json
{
  "search.useRipgrep": true,
  "search.useIgnoreFiles": true,
  "search.followSymlinks": true,
  "search.smartCase": true,
  "search.ripgrep.args": [
    "--hidden",
    "--glob=!.git/*",
    "--glob=!node_modules/*"
  ]
}
```

### 4. Git連携

```bash
# Git管理下のファイルのみ検索
git ls-files | xargs rg "pattern"

# 変更されたファイルのみ検索
git diff --name-only | xargs rg "pattern"

# コミット済みファイルから検索（.gitignore効果）
rg "pattern" --files | grep -v "$(git ls-files --exclude-standard -o)"

# エイリアス設定
alias rgit='git ls-files | xargs rg'
```

## パフォーマンス最適化

### 1. 高速化のコツ

```bash
# 検索対象を限定
rg "pattern" specific_directory/  # 特定ディレクトリのみ
rg "pattern" -t py               # 特定ファイルタイプのみ
rg "pattern" -g "*.log"          # 特定パターンのファイルのみ

# 不要な処理を省略
rg --no-heading "pattern"        # ヘッダーなし
rg --no-line-number "pattern"    # 行番号なし
rg -q "pattern"                  # quiet mode（存在確認のみ）

# 並列処理数調整
rg -j 1 "pattern"               # シングルスレッド
rg -j 8 "pattern"               # 8スレッド
```

### 2. メモリ使用量制限

```bash
# バッファサイズ制限
rg --max-filesize 1M "pattern"   # 1MB以上のファイル除外
rg --max-columns 500 "pattern"   # 長すぎる行をスキップ

# 検索結果数制限
rg -m 100 "pattern"             # 最大100マッチ
rg --max-count 50 "pattern"     # ファイルごと最大50マッチ
```

### 3. .rgignore設定

```bash
# プロジェクトルートに .rgignore ファイル作成
# ripgrep専用の無視ファイル（.gitignoreと同形式）

# 例: .rgignore
node_modules/
*.min.js
*.min.css
dist/
build/
coverage/
*.log
*.tmp
.DS_Store
Thumbs.db
```

## トラブルシューティング

### 1. よくある問題

```bash
# ripgrepが見つからない
which rg
echo $PATH

# 期待する結果が出ない
rg --debug "pattern"            # デバッグ情報表示
rg --no-ignore --hidden "pattern"  # 全ファイル対象

# 日本語検索で問題
export LANG=ja_JP.UTF-8
rg -E "日本語パターン"

# パフォーマンスが遅い
rg --stats "pattern"           # 統計情報で原因調査
```

### 2. エラー対処

```bash
# "Binary file matches" エラー
rg -a "pattern"                # バイナリファイルも検索
rg --text "pattern"            # テキストとして強制処理

# Permission denied エラー
sudo rg "pattern" /root/       # 管理者権限で実行
rg "pattern" --no-ignore-parent  # 親ディレクトリの.gitignore無視

# メモリ不足
rg --max-filesize 10M "pattern"  # ファイルサイズ制限
rg -j 2 "pattern"              # スレッド数削減
```

### 3. 設定のデバッグ

```bash
# 設定ファイルの確認
rg --debug "pattern" 2>&1 | grep "config"

# 無視されているファイルの確認
rg --files --no-ignore --hidden | grep "excluded_pattern"

# 検索対象ファイルの確認
rg --files -t py               # Pythonファイル一覧
```

## 比較：grep vs ripgrep

### パフォーマンス比較

```bash
# 大規模ディレクトリでの速度比較
time grep -r "pattern" .       # 従来のgrep
time rg "pattern"               # ripgrep（通常10-50倍高速）

# ファイル数での比較
find . -name "*.js" | wc -l    # 対象ファイル数確認
time grep "pattern" `find . -name "*.js"`  # grep
time rg "pattern" -t js        # ripgrep
```

### 機能比較

```bash
# ripgrepの優位点
✅ デフォルトで再帰検索
✅ .gitignore自動認識
✅ UTF-8 Unicode対応
✅ 高速な正規表現エンジン
✅ カラー出力
✅ ファイルタイプ自動認識
✅ 並列処理

# grepの優位点
✅ POSIX標準で確実に存在
✅ 軽量（小さなファイルサイズ）
✅ 古いシステムでも動作
✅ シンプルなインターフェース
```

### 移行ガイド

```bash
# grep から ripgrep への置き換え例
grep -r "pattern" .           → rg "pattern"
grep -i "pattern" file        → rg -i "pattern" file
grep -n "pattern" file        → rg -n "pattern" file
grep -l "pattern" *           → rg -l "pattern"
grep -v "pattern" file        → rg --invert-match "pattern" file
grep -A 3 -B 3 "pattern" file → rg -A 3 -B 3 "pattern" file

# エイリアス設定で段階的移行
alias grep='rg'               # 完全置き換え
alias rgrep='rg'              # 並行使用
```

---

このドキュメントは、ripgrepを効果的に活用するための包括的なガイドです。基本的な使い方から高度なカスタマイズまで、コードベース検索を劇的に高速化し、開発効率を向上させるための実用的な情報を提供しています。