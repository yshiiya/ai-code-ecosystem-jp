# GitHub CLI（gh-cli）完全ガイド

## 概要

GitHub CLI（gh-cli）は、GitHubの機能をコマンドラインから直接操作できる公式ツールです。ブラウザを開かなくても、リポジトリの作成、Issue・Pull Request の管理、リリースの作成など、GitHubの主要な機能をターミナルから実行できます。

開発者の生産性向上に大きく貢献し、GitHubワークフローを効率化する強力なツールです。

## インストール方法

### macOS（Homebrew使用）

```bash
# Homebrew経由でインストール（推奨）
brew install gh

# インストール確認
gh --version
```

### Windows

#### Scoop使用
```powershell
# Scoopがない場合は先にインストール
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')

# GitHub CLIをインストール
scoop bucket add github-gh https://github.com/cli/scoop-gh.git
scoop install gh
```

#### Chocolatey使用
```powershell
# GitHub CLIをインストール
choco install gh

# インストール確認
gh --version
```

#### 手動インストール
1. [GitHub CLIリリースページ](https://github.com/cli/cli/releases)にアクセス
2. 最新版のWindows用MSIファイルをダウンロード
3. ダウンロードしたファイルを実行してインストール

### Linux

#### Ubuntu/Debian
```bash
# 公式リポジトリを追加
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

# パッケージ更新とインストール
sudo apt update
sudo apt install gh
```

#### CentOS/RHEL/Fedora
```bash
# Fedora
sudo dnf install gh

# CentOS/RHEL（EPEL有効化後）
sudo yum install gh
```

#### Arch Linux
```bash
# pacman経由でインストール
sudo pacman -S github-cli
```

#### Snap使用（Ubuntu系）
```bash
sudo snap install gh
```

## 初期設定

### 1. GitHub認証

```bash
# GitHub認証開始
gh auth login
```

認証プロセス：

1. **認証先選択**
   ```
   ? What account do you want to log into?
   > GitHub.com
     GitHub Enterprise Server
   ```

2. **認証方法選択**
   ```
   ? What is your preferred protocol for Git operations?
   > HTTPS
     SSH
   ```

3. **認証タイプ選択**
   ```
   ? How would you like to authenticate GitHub CLI?
   > Login with a web browser
     Paste an authentication token
   ```

4. **ブラウザ認証**（推奨）
   - ワンタイムコードが表示される
   - Enterキーでブラウザが開く
   - コードを入力して認証完了

### 2. 認証確認

```bash
# 現在の認証状況確認
gh auth status

# 認証トークンの権限確認
gh auth token
```

### 3. デフォルト設定

```bash
# エディタ設定
gh config set editor "code"  # VS Code使用
gh config set editor "vim"   # Vim使用

# ブラウザ設定
gh config set browser "chrome"

# 設定確認
gh config list
```

## 基本的な使い方（よく使うコマンド10選）

### 1. リポジトリ操作

```bash
# リポジトリ作成
gh repo create my-project --public
gh repo create my-project --private --clone

# リポジトリクローン
gh repo clone owner/repo-name

# リポジトリ一覧表示
gh repo list
gh repo list --limit 50

# リポジトリ詳細表示
gh repo view owner/repo-name
```

### 2. Issue操作

```bash
# Issue一覧表示
gh issue list
gh issue list --state open --assignee @me

# Issue作成
gh issue create --title "Bug report" --body "Description"

# Issue詳細表示
gh issue view 123

# Issue終了
gh issue close 123
```

### 3. Pull Request操作

```bash
# PR一覧表示
gh pr list
gh pr list --state open --author @me

# PR作成
gh pr create --title "New feature" --body "Description"

# PR詳細表示
gh pr view 456

# PRマージ
gh pr merge 456 --squash --delete-branch
```

### 4. ブランチ・コミット操作

```bash
# ブランチ一覧
gh api repos/:owner/:repo/branches

# 最新コミット表示
gh api repos/:owner/:repo/commits --jq '.[0]'

# 特定コミット詳細
gh api repos/:owner/:repo/commits/SHA
```

### 5. リリース管理

```bash
# リリース一覧
gh release list

# リリース作成
gh release create v1.0.0 --title "Version 1.0.0" --notes "Release notes"

# リリース詳細表示
gh release view v1.0.0
```

### 6. Gist管理

```bash
# Gist作成
gh gist create file.txt
echo "Hello" | gh gist create --filename hello.txt

# Gist一覧
gh gist list

# Gist表示
gh gist view GIST_ID
```

### 7. GitHub Actions

```bash
# ワークフロー実行履歴
gh run list

# 特定実行の詳細
gh run view RUN_ID

# ワークフロー手動実行
gh workflow run workflow.yml
```

### 8. 通知管理

```bash
# 通知一覧
gh api notifications

# 未読通知数
gh api notifications | jq 'length'
```

### 9. 検索機能

```bash
# リポジトリ検索
gh search repos "machine learning" --language python

# Issue検索
gh search issues "bug" --repo owner/repo

# ユーザー検索
gh search users "location:tokyo"
```

### 10. エイリアス設定

```bash
# エイリアス作成
gh alias set pv 'pr view'
gh alias set ic 'issue create'

# エイリアス一覧
gh alias list
```

## 実用例

### 1. Issue作成の例

```bash
# バグレポート作成
gh issue create \
  --title "Login button not working on mobile" \
  --body "The login button doesn't respond on iOS Safari. Steps to reproduce: 1. Open app on mobile 2. Tap login button 3. Nothing happens" \
  --label bug,mobile \
  --assignee username

# 機能リクエスト作成
gh issue create \
  --title "Add dark mode support" \
  --body "Users are requesting dark mode support for better user experience" \
  --label enhancement,feature-request \
  --milestone "v2.0"
```

### 2. プルリクエストレビューの例

```bash
# PR一覧確認
gh pr list --search "is:open review-requested:@me"

# PR詳細確認とチェックアウト
gh pr view 123
gh pr checkout 123

# コードレビュー後の承認
gh pr review 123 --approve --body "LGTM! Great implementation."

# 修正要求
gh pr review 123 --request-changes --body "Please update the documentation"

# PRマージ
gh pr merge 123 --squash --delete-branch
```

### 3. リポジトリクローンと設定の例

```bash
# フォークしてクローン
gh repo fork owner/original-repo --clone

# 複数リポジトリの一括クローン
gh repo list owner --limit 100 | cut -f1 | xargs -I {} gh repo clone {}

# テンプレートからリポジトリ作成
gh repo create my-new-project \
  --template owner/template-repo \
  --private \
  --clone
```

### 4. リリース管理の例

```bash
# 自動リリース作成（タグから）
gh release create v2.1.0 \
  --title "Version 2.1.0 - Performance Improvements" \
  --notes-file CHANGELOG.md \
  --prerelease

# アセット付きリリース
gh release create v2.1.0 \
  --title "Version 2.1.0" \
  --notes "Bug fixes and improvements" \
  ./dist/app-v2.1.0.zip \
  ./dist/app-v2.1.0.tar.gz

# ドラフトリリース作成
gh release create v2.2.0 \
  --draft \
  --title "Version 2.2.0 (Draft)" \
  --generate-notes
```

### 5. チーム作業での活用例

```bash
# 自分に割り当てられたIssue確認
gh issue list --assignee @me

# レビュー待ちPR確認
gh pr list --search "is:open review-requested:@me"

# 自分が作成したPRの状態確認
gh pr list --author @me

# 特定ブランチのPR作成
git checkout feature-branch
gh pr create --fill  # コミットメッセージから自動生成

# PRの詳細確認とマージ可能性チェック
gh pr view 456 --json mergeable,reviews,statusCheckRollup
```

## Tips & Tricks

### 1. 効率的なエイリアス

```bash
# よく使うコマンドをエイリアス化
gh alias set prs 'pr list --state open --author @me'
gh alias set issues 'issue list --assignee @me'
gh alias set reviews 'pr list --search "is:open review-requested:@me"'

# 複雑なコマンドもエイリアス化
gh alias set cleanup 'pr list --state merged --limit 10 --json number --jq ".[].number" | xargs -I {} gh pr delete {}'
```

### 2. JSON出力とjq連携

```bash
# PR情報をJSONで取得して加工
gh pr list --json number,title,author --jq '.[] | select(.author.login == "username")'

# Issue統計情報取得
gh issue list --state all --json state --jq 'group_by(.state) | map({state: .[0].state, count: length})'
```

### 3. 自動化スクリプト例

```bash
#!/bin/bash
# daily-review.sh - デイリーレビュースクリプト

echo "=== Today's GitHub Activity ==="
echo
echo "📝 Issues assigned to you:"
gh issue list --assignee @me --limit 5

echo
echo "🔍 PRs waiting for your review:"
gh pr list --search "is:open review-requested:@me" --limit 5

echo
echo "✅ Your open PRs:"
gh pr list --author @me --state open --limit 5
```

### 4. GitHub Actionsとの連携

```bash
# ワークフロー実行とログ確認
gh workflow run ci.yml
gh run watch  # リアルタイムでログ監視

# 失敗したワークフロー再実行
gh run list --status failure --limit 5 --json databaseId --jq '.[0].databaseId' | xargs gh run rerun
```

### 5. 設定ファイルカスタマイズ

```yaml
# ~/.config/gh/config.yml
git_protocol: https
editor: code
browser: chrome
prompt: enabled
pager: less
```

## 他ツールとの連携

### 1. Git連携

```bash
# Gitフックでgh使用
# .git/hooks/post-commit
#!/bin/bash
if [[ $(git branch --show-current) == "main" ]]; then
    gh issue list --state open --json number --jq '.[0].number' | xargs -I {} gh issue close {}
fi
```

### 2. CI/CD連携

```yaml
# GitHub Actions内でgh使用
name: Auto PR Comment
on: pull_request

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Comment on PR
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh pr comment ${{ github.event.number }} --body "Thanks for your contribution!"
```

### 3. VS Code連携

```json
// settings.json
{
  "terminal.integrated.shellArgs.osx": ["-c", "gh completion --shell zsh > ~/.gh_completion && echo 'source ~/.gh_completion' >> ~/.zshrc"]
}
```

### 4. Slack/Discord通知連携

```bash
#!/bin/bash
# gh-slack-notify.sh
PR_COUNT=$(gh pr list --search "is:open review-requested:@me" --json number --jq 'length')
if [ $PR_COUNT -gt 0 ]; then
    curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"You have $PR_COUNT PRs waiting for review!\"}" \
    $SLACK_WEBHOOK_URL
fi
```

### 5. 開発環境統合

```bash
# .bashrc / .zshrc
# GitHub CLI補完とエイリアス
eval "$(gh completion --shell zsh)"
alias ghs="gh status"
alias ghp="gh pr create --fill"
alias ghi="gh issue create"

# 現在のリポジトリ情報表示関数
ghinfo() {
    echo "Repository: $(gh repo view --json nameWithOwner --jq '.nameWithOwner')"
    echo "Open Issues: $(gh issue list --state open --json number --jq 'length')"
    echo "Open PRs: $(gh pr list --state open --json number --jq 'length')"
}
```

---

このドキュメントは、GitHub CLIを効果的に活用するための包括的なガイドです。日常的な開発作業からチーム管理まで、幅広い場面で活用できる実用的な情報を提供しています。