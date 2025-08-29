# MCP (Model Context Protocol) 完全ガイド

## 📌 MCPとは

Model Context Protocol (MCP) は、AIアシスタントと外部システムを接続するためのオープンスタンダードプロトコルです。Anthropicが開発し、Claude Codeをはじめとする様々なAIツールで採用されています。

## 🎯 MCPの目的

- **コンテキスト拡張**: AIに外部データソースへのアクセスを提供
- **ツール統合**: 外部ツールやAPIとの連携を標準化
- **相互運用性**: 異なるAIシステム間での共通インターフェース

## 🏗️ アーキテクチャ

```
┌─────────────┐     MCP      ┌──────────────┐
│ AI Assistant│◄────────────►│ MCP Server   │
│(Claude Code)│   Protocol   │(GitHub, DB等)│
└─────────────┘              └──────────────┘
```

## 📊 MCPカテゴリ

### 1. データアクセス
- ファイルシステム、データベース、API連携

### 2. 開発ツール
- Git、GitHub、パッケージマネージャー

### 3. コミュニケーション
- Slack、Discord、メール

### 4. 生産性ツール
- カレンダー、タスク管理、ドキュメント

### 5. エンターテイメント
- 音楽、動画、ゲーム（デモ用途）

## 🚀 主要なMCPサーバー

### 公式MCP（Anthropic提供）
| 名称 | 用途 | ステータス |
|------|------|-----------|
| [GitHub MCP](./github-mcp.md) | GitHub連携 | 🟢 安定版 |
| [Filesystem MCP](./filesystem-mcp.md) | ファイル操作 | 🟢 安定版 |
| [Memory MCP](./memory-mcp.md) | 知識保存 | 🟢 安定版 |
| [Slack MCP](./slack-mcp.md) | Slack連携 | 🟢 安定版 |

### コミュニティMCP
| 名称 | 用途 | 開発者 |
|------|------|--------|
| [PostgreSQL MCP](./postgresql-mcp.md) | DB操作 | Community |
| [Stripe MCP](./stripe-mcp.md) | 決済連携 | Community |
| [Google Drive MCP](./google-drive-mcp.md) | Drive連携 | Community |
| [Spotify MCP](./spotify-mcp.md) | 音楽制御 | Community |

## 🔧 MCPの仕組み

### 基本的な流れ
1. **接続確立**: AIクライアントがMCPサーバーに接続
2. **能力交換**: サーバーが提供する機能を通知
3. **リクエスト**: AIが必要に応じて機能を呼び出し
4. **レスポンス**: サーバーが結果を返す

### プロトコル仕様
```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "params": {},
  "id": 1
}
```

## 💻 MCPサーバーの実装

### 基本構造
```typescript
// MCPサーバーの基本実装
import { Server } from '@modelcontextprotocol/sdk';

const server = new Server({
  name: 'my-mcp-server',
  version: '1.0.0'
});

// ツールの定義
server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'getData',
    description: 'Get data from source',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' }
      }
    }
  }]
}));

// ツールの実行
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  if (name === 'getData') {
    // 実際の処理
    return { result: 'data' };
  }
});

server.run();
```

## 📦 MCPのインストール方法

### npm経由
```bash
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-filesystem
```

### 設定ファイル
```json
// ~/.claude/mcp.json
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "args": ["--token", "YOUR_GITHUB_TOKEN"]
    },
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["--root", "/path/to/allowed/directory"]
    }
  }
}
```

## 🎯 使用例

### GitHub MCP
```bash
# リポジトリ情報取得
Claude: "GitHubでreact/reactリポジトリの最新issueを見せて"

# PR作成
Claude: "feature/new-componentブランチでPRを作成"
```

### Filesystem MCP
```bash
# ファイル読み取り
Claude: "src/main.tsの内容を見せて"

# ファイル作成
Claude: "READMEを日本語に翻訳して保存"
```

## 🔐 セキュリティ考慮事項

### アクセス制御
- ファイルシステム: 特定ディレクトリのみ許可
- API: トークン/認証情報の安全な管理
- ネットワーク: HTTPSのみ使用

### ベストプラクティス
1. 最小権限の原則
2. 認証情報の環境変数管理
3. ログ記録と監査
4. 定期的な権限レビュー

## 🚀 今後の展望

### 開発中のMCP
- LINE MCP（日本向け）
- Notion MCP（ドキュメント管理）
- Jira MCP（プロジェクト管理）

### 将来の機能
- マルチモーダル対応
- リアルタイム通信
- 分散MCP連携

## 📚 リソース

### 公式ドキュメント
- [MCP仕様書](https://modelcontextprotocol.io/docs)
- [MCPサーバー開発ガイド](https://github.com/anthropics/mcp-servers)
- [サンプル実装](https://github.com/anthropics/mcp-examples)

### コミュニティ
- [MCP Discord](https://discord.gg/mcp)
- [GitHub Discussions](https://github.com/anthropics/mcp/discussions)

## ❓ よくある質問

**Q: MCPはClaude Code専用？**
A: いいえ、オープンスタンダードで他のAIツールでも利用可能です。

**Q: 自作MCPサーバーは作れる？**
A: はい、SDKが提供されており、TypeScript/Pythonで開発可能です。

**Q: セキュリティは大丈夫？**
A: 適切に設定すれば安全です。権限管理が重要です。

---
*最終更新: 2025年8月29日*
*次回更新予定: 2025年9月15日*