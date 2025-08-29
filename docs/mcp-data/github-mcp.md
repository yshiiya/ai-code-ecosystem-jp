# GitHub MCP - 詳細情報

## 基本情報
- **開発元**: Anthropic
- **カテゴリ**: 開発ツール連携
- **用途**: GitHub API統合
- **最終更新**: 2025年8月29日
- **ステータス**: 🟢 安定版

## 概要
GitHub MCPは、AIアシスタントがGitHubリポジトリ、Issue、Pull Request、Actionsなどと直接やり取りできるようにするMCPサーバーです。コード管理からプロジェクト管理まで幅広くサポート。

## 主要機能
- **リポジトリ操作**: 作成、クローン、フォーク
- **Issue管理**: 作成、更新、クローズ、検索
- **PR操作**: 作成、レビュー、マージ
- **ファイル操作**: 読み取り、作成、更新、削除
- **Actions連携**: ワークフロー実行、ログ確認
- **検索機能**: コード、Issue、PR検索
- **Gist管理**: 作成、更新、共有

## インストール方法

### npmでインストール
```bash
# グローバルインストール
npm install -g @modelcontextprotocol/server-github

# またはローカルインストール
npm install @modelcontextprotocol/server-github
```

### 設定ファイル
```json
// ~/.claude/mcp.json または .mcp/config.json
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "args": [],
      "env": {
        "GITHUB_TOKEN": "ghp_YOUR_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

## GitHub Token設定

### Personal Access Token作成
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. 必要なスコープを選択：
   - `repo` - フルコントロール
   - `workflow` - Actions操作
   - `write:packages` - パッケージ管理
   - `admin:org` - 組織管理（必要に応じて）

### 環境変数設定
```bash
# .env または .bashrc/.zshrc
export GITHUB_TOKEN="ghp_YOUR_TOKEN_HERE"

# または直接MCPに渡す
mcp-server-github --token "ghp_YOUR_TOKEN_HERE"
```

## 使用可能なコマンド

### リポジトリ操作
```javascript
// リポジトリ情報取得
github.getRepository("owner/repo")

// 新規リポジトリ作成
github.createRepository({
  name: "new-repo",
  private: false,
  description: "Created via MCP"
})

// フォーク
github.forkRepository("original/repo")

// クローン（ローカル）
github.cloneRepository("owner/repo", "/local/path")
```

### Issue操作
```javascript
// Issue作成
github.createIssue({
  repo: "owner/repo",
  title: "Bug: 問題の説明",
  body: "詳細な説明",
  labels: ["bug", "high-priority"]
})

// Issue検索
github.searchIssues("is:open label:bug")

// Issue更新
github.updateIssue({
  repo: "owner/repo",
  number: 123,
  state: "closed"
})
```

### Pull Request操作
```javascript
// PR作成
github.createPullRequest({
  repo: "owner/repo",
  title: "feat: 新機能追加",
  head: "feature-branch",
  base: "main",
  body: "## 変更内容\n- 機能追加"
})

// PRレビュー
github.createReview({
  repo: "owner/repo",
  pull_number: 456,
  event: "APPROVE",
  body: "LGTM!"
})

// PRマージ
github.mergePullRequest({
  repo: "owner/repo",
  pull_number: 456,
  merge_method: "squash"
})
```

## Claude Codeでの使用例

```bash
# Issue一覧取得
Claude: "このリポジトリのopen issueを見せて"

# PR作成
Claude: "現在の変更でPRを作成して、タイトルは'feat: ユーザー認証機能追加'"

# コード検索
Claude: "organizationのすべてのリポジトリで'TODO'を検索"

# Actions実行
Claude: "deploy workflowを実行"

# ファイル取得
Claude: "main.tsの最新版を取得"
```

## 高度な使い方

### バッチ操作
```javascript
// 複数Issue一括クローズ
const issues = await github.listIssues({
  repo: "owner/repo",
  labels: ["wontfix"]
});

for (const issue of issues) {
  await github.closeIssue({
    repo: "owner/repo",
    number: issue.number
  });
}
```

### 自動化ワークフロー
```javascript
// PR自動マージ設定
if (pr.checks.allPassed && pr.reviews.approved >= 2) {
  await github.mergePullRequest({
    repo: "owner/repo",
    pull_number: pr.number,
    merge_method: "rebase"
  });
}
```

## セキュリティ設定

### 権限の最小化
```json
{
  "github": {
    "command": "mcp-server-github",
    "args": [
      "--readonly",  // 読み取り専用モード
      "--repos", "owner/repo1,owner/repo2"  // 特定リポジトリのみ
    ]
  }
}
```

### トークンスコープ
| 操作 | 必要なスコープ |
|-----|--------------|
| 読み取り | `repo:status`, `public_repo` |
| Issue操作 | `repo` |
| PR操作 | `repo`, `write:discussion` |
| Actions | `workflow` |
| 組織管理 | `admin:org` |

## トラブルシューティング

### よくあるエラー
```bash
# 認証エラー
Error: Bad credentials
→ トークンが正しいか確認

# 権限エラー
Error: Resource not accessible by integration
→ トークンのスコープを確認

# レート制限
Error: API rate limit exceeded
→ 少し待つか、トークンを使用
```

### デバッグモード
```bash
# 詳細ログ出力
MCP_DEBUG=true mcp-server-github

# 特定の操作のみログ
MCP_DEBUG_FILTER="github:*" mcp-server-github
```

## ベストプラクティス

1. **トークン管理**
   - 環境変数使用
   - 定期的な更新
   - 最小権限の原則

2. **エラーハンドリング**
   - レート制限対策
   - リトライロジック
   - 適切なログ記録

3. **効率的な使用**
   - バッチ処理活用
   - キャッシュ利用
   - 非同期処理

## 統計と制限

- **API制限**: 5,000リクエスト/時（認証済み）
- **検索制限**: 30リクエスト/分
- **ファイルサイズ**: 最大100MB
- **同時接続**: 制限なし

## 関連リソース
- [GitHub API ドキュメント](https://docs.github.com/rest)
- [MCP GitHub実装](https://github.com/anthropics/mcp-servers/tree/main/packages/github)
- [Personal Access Token ガイド](https://docs.github.com/authentication)

---
*最終確認日: 2025年8月29日*
*次回更新予定: 2025年9月15日*