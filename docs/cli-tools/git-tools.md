# Git関連ツール 完全ガイド

## 📌 Git基本とAIコーディング

GitはAIコーディングにおいて重要な役割を果たします。Claude CodeやAiderは自動的にGitコミットを作成し、変更履歴を管理します。

## 🔧 必須Gitツール

### GitHub CLI (gh)
- **用途**: GitHub操作をCLIで完結
- **重要度**: ⭐⭐⭐⭐⭐

**インストール**
```bash
# Mac
brew install gh

# Windows
winget install GitHub.cli

# Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg
```

**基本コマンド**
```bash
# 認証
gh auth login

# リポジトリ操作
gh repo create my-project --public
gh repo clone owner/repo
gh repo view --web

# Issue操作
gh issue create --title "Bug fix" --body "Description"
gh issue list --label bug
gh issue close 123

# PR操作
gh pr create --title "Feature" --body "Description"
gh pr list
gh pr checkout 456
gh pr merge 456 --squash

# Actions
gh run list
gh run view
gh run download

# Gist
gh gist create file.txt --public
```

**Claude Codeとの連携**
```bash
# Claude CodeでPR作成
claude-code "変更を加えて"
gh pr create --title "AI-generated changes"

# レビューコメント取得
gh pr view 123 --comments | claude-code "このフィードバックに対応"
```

---

### lazygit
- **用途**: TUIでGit操作
- **重要度**: ⭐⭐⭐⭐⭐

**インストール**
```bash
# Mac
brew install lazygit

# Windows
scoop install lazygit

# Linux
go install github.com/jesseduffield/lazygit@latest
```

**特徴**
- ビジュアルなブランチグラフ
- インタラクティブなリベース
- チェリーピック
- スタッシュ管理
- サブモジュール対応

**キーバインド**
```
スペース: ステージ/アンステージ
c: コミット
p: プッシュ
P: プル
b: ブランチ操作
?: ヘルプ
```

---

### tig
- **用途**: Gitログビューア
- **重要度**: ⭐⭐⭐⭐

**インストール**
```bash
brew install tig  # Mac
apt install tig   # Ubuntu
```

**使い方**
```bash
# ログ表示
tig

# 特定ファイルの履歴
tig path/to/file

# Blame view
tig blame file.txt

# ステータス
tig status
```

---

### git-flow
- **用途**: ブランチ戦略の標準化
- **重要度**: ⭐⭐⭐

**インストールと初期化**
```bash
brew install git-flow

# プロジェクトで初期化
git flow init

# 機能ブランチ
git flow feature start new-feature
git flow feature finish new-feature

# リリース
git flow release start 1.0.0
git flow release finish 1.0.0
```

---

## 🎨 Git UI/GUIツール

### Fork
- **OS**: Mac/Windows
- **料金**: $49.99（買い切り）
- **特徴**: 美しいUI、高速

### GitKraken
- **OS**: 全OS対応
- **料金**: 無料〜$4.95/月
- **特徴**: ビジュアルマージ、統合機能豊富

### Sourcetree
- **OS**: Mac/Windows
- **料金**: 無料
- **特徴**: Atlassian製、初心者向け

### GitHub Desktop
- **OS**: Mac/Windows
- **料金**: 無料
- **特徴**: GitHub公式、シンプル

---

## 🚀 高度なGitツール

### git-extras
**追加コマンド集**
```bash
brew install git-extras

# 便利なコマンド
git summary              # プロジェクト要約
git effort              # コード貢献度
git changelog           # CHANGELOG生成
git ignore python       # .gitignore追加
git info               # リモート情報
git standup            # 最近のコミット
```

### diff-so-fancy
**見やすいdiff表示**
```bash
brew install diff-so-fancy

# 設定
git config --global core.pager "diff-so-fancy | less --tabs=4 -RFX"
```

### git-delta
**構文ハイライト付きdiff**
```bash
brew install git-delta

# ~/.gitconfig
[core]
    pager = delta
[delta]
    navigate = true
    light = false
    side-by-side = true
```

---

## ⚙️ Git設定最適化

### グローバル設定
```bash
# 基本情報
git config --global user.name "Your Name"
git config --global user.email "email@example.com"

# エディタ
git config --global core.editor "vim"

# 改行コード
git config --global core.autocrlf input  # Mac/Linux
git config --global core.autocrlf true   # Windows

# 日本語ファイル名
git config --global core.quotepath false

# プッシュ設定
git config --global push.default current
git config --global push.autoSetupRemote true

# プル設定
git config --global pull.rebase true

# エイリアス
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm commit
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'"
```

### .gitignore テンプレート
```bash
# グローバル.gitignore
git config --global core.excludesfile ~/.gitignore_global

# 内容例
.DS_Store
*.swp
*.swo
.env
node_modules/
.vscode/
.idea/
```

---

## 🔐 Git認証・セキュリティ

### SSH鍵設定
```bash
# 鍵生成
ssh-keygen -t ed25519 -C "email@example.com"

# GitHubに追加
gh ssh-key add ~/.ssh/id_ed25519.pub

# 接続テスト
ssh -T git@github.com
```

### GPG署名
```bash
# GPG鍵生成
gpg --full-generate-key

# Git設定
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true

# GitHubに公開鍵追加
gpg --armor --export YOUR_KEY_ID | gh gpg-key add
```

### 認証情報管理
```bash
# Mac: Keychain
git config --global credential.helper osxkeychain

# Windows: Manager
git config --global credential.helper manager

# Linux: Store (暗号化)
git config --global credential.helper store
```

---

## 📊 Git統計・分析

### git-stats
```bash
npm install -g git-stats

# 統計表示
git-stats
```

### git-quick-stats
```bash
git clone https://github.com/arzzen/git-quick-stats.git
cd git-quick-stats
make install

# 使用
git-quick-stats
```

---

## 🔄 Git ワークフロー

### AIコーディング向けワークフロー
```bash
# 1. ブランチ作成
git checkout -b feature/ai-enhancement

# 2. Claude Codeで開発
claude-code "機能を実装"

# 3. 変更確認
git diff
tig status

# 4. コミット（Claudeが自動作成）
git log --oneline

# 5. PR作成
gh pr create --web

# 6. レビュー対応
gh pr view --comments
claude-code "レビューコメントに対応"

# 7. マージ
gh pr merge --squash
```

---

## 🎯 トラブルシューティング

### よくある問題と解決
```bash
# コンフリクト解決
git status
git mergetool
# または
lazygit  # ビジュアルに解決

# 間違ったコミットを取り消し
git reset --soft HEAD~1  # コミットのみ取り消し
git reset --hard HEAD~1  # 変更も取り消し

# 特定ファイルを前の状態に
git checkout HEAD~1 -- file.txt

# リモートの変更を強制取得
git fetch --all
git reset --hard origin/main
```

---

## 📚 学習リソース

### 公式ドキュメント
- [Pro Git Book](https://git-scm.com/book/ja/v2)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [lazygit Wiki](https://github.com/jesseduffield/lazygit/wiki)

### インタラクティブ学習
- [Learn Git Branching](https://learngitbranching.js.org/)
- [Oh My Git!](https://ohmygit.org/)

---
*最終更新: 2025年8月30日*