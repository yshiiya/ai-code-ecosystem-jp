# lazygit完全ガイド

## 概要

lazygitは、Git操作をTUI（Text User Interface）で効率的に行える強力なツールです。コマンドラインでのGit操作を視覚化し、マウスを使わずにキーボードだけで直感的にGit作業ができます。ステージング、コミット、プッシュ、ブランチ管理、マージ、リベースまで、Gitの主要機能を美しいインターフェースで提供します。

## インストール方法

### macOS

```bash
# Homebrew使用（推奨）
brew install lazygit

# MacPorts使用
sudo port install lazygit

# インストール確認
lazygit --version
```

### Linux

```bash
# Ubuntu/Debian
sudo apt install lazygit

# Arch Linux
sudo pacman -S lazygit

# CentOS/RHEL/Fedora
sudo dnf install lazygit

# 手動インストール（最新版）
LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*')
curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz"
tar xf lazygit.tar.gz lazygit
sudo install lazygit /usr/local/bin
```

### Windows

```bash
# Chocolatey使用
choco install lazygit

# Scoop使用
scoop install lazygit

# 手動インストール
# GitHubリリースページから exe ファイルをダウンロード
# https://github.com/jesseduffield/lazygit/releases
```

## 基本操作とキーバインド

### 起動と終了

```bash
# lazygit起動
lazygit

# 特定のディレクトリで起動
lazygit -p /path/to/repo

# 終了
q または Ctrl + C
```

### 画面構成

```
┌─ Files ──────────────┐ ┌─ Main ─────────────────┐
│ 変更されたファイル一覧 │ │ 選択されたファイルの詳細 │
└─────────────────────┘ └──────────────────────┘
┌─ Branches ───────────┐ ┌─ Commits ─────────────┐  
│ ブランチ一覧         │ │ コミット履歴           │
└─────────────────────┘ └──────────────────────┘
```

### 主要キーバインド

```bash
# 基本ナビゲーション
Tab / Shift+Tab : パネル間移動
↑↓←→ : カーソル移動
Enter : 選択・実行
Esc : キャンセル・戻る
q : 終了

# ファイル操作（Filesパネル）
Space : ステージング/アンステージング
a : 全ファイルをステージング/アンステージング
c : コミット
A : 全変更をコミットに含める
d : ファイルの変更を破棄
e : ファイルを編集
o : ファイルを開く
s : ファイルをstash
```

## 詳細操作ガイド

### 1. ステージング操作

```bash
# Filesパネルでの操作
Space : 選択ファイルのステージング切り替え
a : 全ファイルのステージング切り替え

# 部分的ステージング
Enter : ファイルを選択してMainパネルで詳細表示
→ Mainパネルで Space : 行単位/ハンク単位でステージング

# よくある使用パターン
1. lazygit起動
2. Filesパネルで変更確認
3. Space で必要ファイルをステージング
4. c でコミットメッセージ入力
5. Enter でコミット実行
```

### 2. コミット操作

```bash
# コミット作成
c : コミットメッセージ入力画面
→ メッセージ入力後 Ctrl+Enter : コミット実行
→ Esc : コミットキャンセル

# コミット履歴操作（Commitsパネル）
Enter : コミット詳細表示
d : コミット削除（注意！）
e : コミットメッセージ編集
r : コミットをリセット
s : コミットをsquash
f : コミットをfixup

# Amend（直前コミット修正）
Shift+A : 前回コミットに追加修正
```

### 3. ブランチ操作

```bash
# ブランチ管理（Branchesパネル）
Tab → Branchesパネル選択

n : 新しいブランチ作成
Space : ブランチ切り替え
d : ブランチ削除
r : ブランチ名変更
M : ブランチをマージ
R : ブランチをリベース

# リモートブランチ操作
u : アップストリーム設定
p : プル（リモートから変更取得）
P : プッシュ（リモートに変更送信）
f : フォースプッシュ（注意！）
```

### 4. マージとリベース

```bash
# マージ操作
1. Branchesパネルでマージ先ブランチを選択
2. マージするブランチにカーソル移動
3. M : マージ実行

# リベース操作
1. Branchesパネルでリベース対象ブランチ選択
2. ベースとするブランチにカーソル移動
3. R : リベース実行

# コンフリクト解決
コンフリクト発生時 → Filesパネルで該当ファイル選択
→ Enter で詳細表示 → 手動編集または：
← → : Previous/Next conflict
u : undo
```

### 5. Stash操作

```bash
# Stash管理（Stashパネル）
Tab → Stashパネル（４番目のパネル）

# ファイルをStash
Filesパネルで s : 選択ファイルをstash
S : 全変更をstash（メッセージ付き）

# Stash操作
Space : stash適用（pop）
g : stash適用（keep）
d : stash削除
r : stash名前変更
```

## 実用例とワークフロー

### 1. 日常的な開発ワークフロー

```bash
# 朝の作業開始
lazygit
→ Branchesパネル → main選択 → p (pull) → 最新状態に更新

# 新機能開発
→ Branchesパネル → n (new branch) → "feature/new-feature"
→ ファイル編集（外部エディタ）
→ lazygit → Filesパネル → 変更確認
→ Space（ステージング）→ c（コミット）

# 作業完了後
→ Branchesパネル → P（プッシュ）
→ GitHubでPR作成
```

### 2. 複雑な変更の管理

```bash
# 大きな変更を分割してコミット
1. lazygit起動
2. Filesパネルで1つ目のファイル選択
3. Enter → 詳細画面で部分ステージング
4. Space で必要な行のみステージング
5. Esc → c でコミット
6. 2つ目の変更も同様に処理

# 複数ファイルの変更を論理的にグループ化
- ファイルA, B → "Add user authentication"
- ファイルC, D → "Update UI components"  
- ファイルE → "Fix documentation typos"
```

### 3. チーム開発でのワークフロー

```bash
# 他の人の変更を取り込み
→ Branchesパネル → main選択 → p (pull)
→ feature-branchに切り替え → R (rebase)
→ コンフリクトあれば解決

# PR前の整理
→ Commitsパネル → 不要なコミット削除
→ 関連するコミットをsquash (s)
→ コミットメッセージを整理 (r)

# 緊急修正（hotfix）
→ Branchesパネル → main選択 → n (hotfix/bug-name)
→ 修正 → コミット → P (push)
```

### 4. 高度なGit操作

```bash
# インタラクティブリベース
→ Commitsパネル → リベース開始点選択
→ i (interactive rebase)
→ squash, edit, drop などを選択

# Cherry-pick
→ Commitsパネル → 取り込みたいコミット選択
→ c (cherry-pick)

# Reset操作
→ Commitsパネル → 戻りたいコミット選択
→ r (reset) → soft/mixed/hard選択

# Reflog確認
→ Commitsパネル → R (reflog) → 失ったコミット復元
```

## 設定とカスタマイズ

### 1. 設定ファイル作成

```bash
# 設定ファイルの場所
# macOS/Linux: ~/.config/lazygit/config.yml
# Windows: %APPDATA%/lazygit/config.yml

mkdir -p ~/.config/lazygit
```

### 2. 基本設定例

```yaml
# ~/.config/lazygit/config.yml

# 全般設定
gui:
  # テーマ設定
  theme:
    lightTheme: false
    activeBorderColor:
      - cyan
      - bold
    inactiveBorderColor:
      - white
    selectedLineBgColor:
      - blue

  # 表示設定
  showFileTree: true
  showRandomTip: true
  showCommandLog: false
  
# Git設定
git:
  # マージツール設定
  merging:
    manualCommit: false
    args: ""
  
  # ログ設定
  log:
    order: "topo-order" # date-order, author-date-order, topo-order
    showGraph: "always" # always, never, when-maximised
    showWholeGraph: false

# カスタムコマンド
customCommands:
  - key: "C"
    command: "git add . && git commit -m 'WIP'"
    description: "Quick commit all changes"
    context: "files"
  
  - key: "P"
    command: "git push --force-with-lease"
    description: "Safe force push"
    context: "global"

# OS固有設定
os:
  editCommand: "code"
  editCommandTemplate: "{{editor}} {{filename}}"
  openCommand: "open {{filename}}"
```

### 3. カラーテーマ設定

```yaml
# ダークテーマ
gui:
  theme:
    lightTheme: false
    activeBorderColor: ["#00ff00", "bold"]
    inactiveBorderColor: ["#ffffff"]
    selectedLineBgColor: ["#264f78"]
    optionsTextColor: ["#0087ff"]

# ライトテーマ  
gui:
  theme:
    lightTheme: true
    activeBorderColor: ["#0087ff", "bold"]
    inactiveBorderColor: ["#000000"]
    selectedLineBgColor: ["#e6f3ff"]
```

### 4. カスタムキーバインド

```yaml
# キーバインド変更
keybinding:
  universal:
    quit: "q"
    return: "esc"
    quitWithoutChangingDirectory: "Q"
    togglePanel: "tab"
    prevItem: "<up>"
    nextItem: "<down>"
    prevPage: "<pgup>"
    nextPage: "<pgdown>"
    scrollLeft: "H"
    scrollRight: "L"
  
  files:
    commitChanges: "c"
    commitChangesWithoutHook: "w"
    amendLastCommit: "A"
    commitChangesWithEditor: "C"
    
  branches:
    createPullRequest: "o"
    viewPullRequestOptions: "O"
    copyPullRequestURL: "<c-o>"
```

## エディタ連携

### 1. VS Code連携

```yaml
# ~/.config/lazygit/config.yml
os:
  editCommand: "code"
  editCommandTemplate: "{{editor}} {{filename}}"

# またはターミナルで
export EDITOR="code -w"
```

### 2. Vim連携

```yaml
os:
  editCommand: "vim"
  editCommandTemplate: "{{editor}} +{{line}} {{filename}}"
```

### 3. その他エディタ

```yaml
# Sublime Text
os:
  editCommand: "subl"
  editCommandTemplate: "{{editor}} {{filename}}:{{line}}"

# Atom
os:
  editCommand: "atom"
  editCommandTemplate: "{{editor}} {{filename}}:{{line}}"
```

## トラブルシューティング

### 1. よくある問題と解決法

```bash
# lazygitが起動しない
# Gitリポジトリ内で実行されているか確認
cd /path/to/git/repo
lazygit

# 設定ファイルが読み込まれない
# パス確認
echo $HOME/.config/lazygit/config.yml
ls -la ~/.config/lazygit/

# 日本語文字化け
export LANG=ja_JP.UTF-8
export LC_ALL=ja_JP.UTF-8
```

### 2. パフォーマンス最適化

```yaml
# 大きなリポジトリでの設定
git:
  # ログ表示数を制限
  log:
    order: "topo-order"
    showGraph: "when-maximised"
  
  # 差分表示を制限
  paging:
    externalDiffCommand: "delta --dark --paging=never"
    
# UI応答性向上
gui:
  scrollHeight: 2
  scrollPastBottom: true
  mouseEvents: true
  skipDiscardChangeWarning: false
  skipStashWarning: true
```

### 3. セキュリティ設定

```yaml
# 危険なコマンドに確認を追加
gui:
  skipDiscardChangeWarning: false
  skipStashWarning: false
  skipResetWarning: false

# フォースプッシュの制限
git:
  # カスタムコマンドで安全なフォースプッシュ
customCommands:
  - key: "P"
    command: "git push --force-with-lease"
    description: "Safe force push"
    context: "global"
```

## 他ツールとの連携

### 1. GitHub CLI (gh)連携

```yaml
# PRの作成・管理
customCommands:
  - key: "o"
    command: "gh pr create --web"
    description: "Create PR in browser"
    context: "global"
    
  - key: "O"
    command: "gh pr view --web"
    description: "View PR in browser"
    context: "global"
```

### 2. tig連携

```bash
# lazygit代替としてのtig
alias lg="lazygit"
alias tg="tig"

# 用途による使い分け
lazygit  # インタラクティブな操作
tig      # 履歴閲覧・調査
```

### 3. Delta連携（差分表示改善）

```yaml
# ~/.config/lazygit/config.yml
git:
  paging:
    colorArg: always
    pager: delta --dark --paging=never --24-bit-color=never --syntax-theme='Monokai Extended'
    externalDiffCommand: delta --dark --paging=never --syntax-theme='Monokai Extended'
```

```bash
# Deltaインストール
brew install git-delta

# または
cargo install git-delta
```

## Tips & 上級テクニック

### 1. 効率的なワークフロー

```bash
# 高速作業のコツ
1. キーボードから手を離さない
2. Tab でパネル移動を習慣化
3. Space でのステージング/アンステージングを活用
4. Enter で詳細確認してから操作

# よく使うキーの組み合わせ
Tab → Files → Space → c → "commit message" → Enter
Tab → Branches → n → "branch-name" → Enter
```

### 2. カスタムコマンド活用

```yaml
# 便利なカスタムコマンド
customCommands:
  # 全て破棄
  - key: "D"
    command: "git reset --hard HEAD && git clean -fd"
    description: "Hard reset and clean"
    context: "global"
    
  # 最新にリベース
  - key: "u"
    command: "git fetch origin && git rebase origin/main"
    description: "Update with rebase"
    context: "global"
    
  # ログを美しく表示
  - key: "l"
    command: "git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
    description: "Pretty log"
    context: "global"
```

### 3. チーム規約との統合

```yaml
# コミットメッセージテンプレート
git:
  commitMessageTemplate: |
    {{.Type}}{{if .Scope}}({{.Scope}}){{end}}: {{.Description}}
    
    {{.Body}}
    
    {{.Footer}}

# ブランチ命名規則
customCommands:
  - key: "b"
    command: 'read -p "Feature name: " name && git checkout -b "feature/$name"'
    description: "Create feature branch"
    context: "global"
```

---

このドキュメントは、lazygitを効率的に活用するための包括的なガイドです。基本操作から高度なカスタマイズまで、Gitワークフローを劇的に改善するための実用的な情報を提供しています。