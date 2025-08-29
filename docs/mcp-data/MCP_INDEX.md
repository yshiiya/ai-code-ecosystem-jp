# MCP (Model Context Protocol) インデックス

## 📊 MCP一覧と更新状況

最終更新: 2025年8月29日

### 公式MCP (Anthropic提供)
| MCP名 | 用途 | ステータス | ドキュメント | 最終更新 |
|-------|------|-----------|-------------|----------|
| [GitHub MCP](./github-mcp.md) | GitHub連携 | 🟢 安定版 | ✅ | 2025/08/29 |
| [Filesystem MCP](./filesystem-mcp.md) | ファイル操作 | 🟢 安定版 | ✅ | 2025/08/29 |
| Memory MCP | 知識保存 | 🟢 安定版 | ⏳ | - |
| Slack MCP | Slack連携 | 🟢 安定版 | ⏳ | - |
| Puppeteer MCP | ブラウザ自動化 | 🟡 ベータ | ⏳ | - |

### データベースMCP
| MCP名 | 用途 | 開発元 | ドキュメント | ステータス |
|-------|------|--------|-------------|-----------|
| PostgreSQL MCP | PostgreSQL操作 | Community | ⏳ | 🟢 安定版 |
| MySQL MCP | MySQL操作 | Community | ⏳ | 🟡 開発中 |
| MongoDB MCP | MongoDB操作 | Community | ⏳ | 🟡 開発中 |
| Redis MCP | Redis操作 | Community | ⏳ | 🟡 開発中 |
| SQLite MCP | SQLite操作 | Community | ⏳ | 🟢 安定版 |

### API連携MCP
| MCP名 | 用途 | 開発元 | ドキュメント | ステータス |
|-------|------|--------|-------------|-----------|
| Stripe MCP | 決済処理 | Community | ⏳ | 🟢 安定版 |
| OpenAI MCP | OpenAI API | Community | ⏳ | 🟡 開発中 |
| Google Drive MCP | Drive操作 | Community | ⏳ | 🟢 安定版 |
| Notion MCP | Notion連携 | Community | ⏳ | 🟡 開発中 |
| Discord MCP | Discord連携 | Community | ⏳ | 🟡 開発中 |

### 開発ツールMCP
| MCP名 | 用途 | 開発元 | ドキュメント | ステータス |
|-------|------|--------|-------------|-----------|
| Docker MCP | Docker操作 | Community | ⏳ | 🟡 開発中 |
| Kubernetes MCP | K8s操作 | Community | ⏳ | 🔴 計画中 |
| Terraform MCP | IaC管理 | Community | ⏳ | 🔴 計画中 |
| npm MCP | パッケージ管理 | Community | ⏳ | 🟡 開発中 |

### 日本向けMCP
| MCP名 | 用途 | 開発元 | ドキュメント | ステータス |
|-------|------|--------|-------------|-----------|
| LINE MCP | LINE連携 | Community | ⏳ | 🔴 計画中 |
| Chatwork MCP | Chatwork連携 | Community | ⏳ | 🔴 計画中 |
| Backlog MCP | Backlog連携 | Community | ⏳ | 🔴 計画中 |
| Cybozu MCP | サイボウズ連携 | Community | ⏳ | 🔴 計画中 |

## 🔧 MCPの基本

### MCPとは
- **概要**: [MCP完全ガイド](./MCP_OVERVIEW.md)
- **仕組み**: AIと外部システムを接続するプロトコル
- **利点**: 標準化された連携方法

### セットアップ方法
1. MCPサーバーのインストール
2. 設定ファイルの作成
3. 認証情報の設定
4. AIツールとの接続

### 設定ファイル例
```json
// ~/.claude/mcp.json
{
  "mcpServers": {
    "github": {
      "command": "mcp-server-github",
      "env": {
        "GITHUB_TOKEN": "your_token"
      }
    },
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["--allowed-directories", "/path/to/dir"]
    }
  }
}
```

## 📈 利用統計

### 人気のMCP TOP 5
1. **GitHub MCP** - 開発者必須
2. **Filesystem MCP** - ファイル操作
3. **PostgreSQL MCP** - DB連携
4. **Slack MCP** - チーム連携
5. **Google Drive MCP** - ドキュメント管理

### 用途別推奨MCP

#### 個人開発
- Filesystem MCP
- GitHub MCP
- SQLite MCP

#### チーム開発
- GitHub MCP
- Slack MCP
- PostgreSQL MCP
- Docker MCP

#### エンタープライズ
- PostgreSQL MCP
- Kubernetes MCP
- Stripe MCP
- セキュリティMCP

## 🚀 MCPの開発

### 自作MCPの作成
```typescript
// 基本テンプレート
import { Server } from '@modelcontextprotocol/sdk';

const server = new Server({
  name: 'my-mcp',
  version: '1.0.0'
});

// ツール定義
server.setRequestHandler('tools/list', async () => ({
  tools: [/* ツール定義 */]
}));

server.run();
```

### 開発リソース
- [MCP SDK](https://github.com/anthropics/mcp-sdk)
- [開発ガイド](https://docs.mcp.io/development)
- [サンプルコード](https://github.com/anthropics/mcp-examples)

## 🔐 セキュリティ

### ベストプラクティス
1. **最小権限の原則**
   - 必要最小限のアクセス権限
   - 読み取り専用モードの活用

2. **認証情報管理**
   - 環境変数使用
   - シークレット管理ツール

3. **アクセス制御**
   - 許可リストの明示
   - 除外パターンの設定

### セキュリティチェックリスト
- [ ] トークンの安全な保管
- [ ] アクセス範囲の制限
- [ ] ログ記録の有効化
- [ ] 定期的な権限レビュー

## 📊 トラブルシューティング

### よくある問題
| 問題 | 原因 | 解決法 |
|------|------|--------|
| 接続エラー | ポート競合 | ポート変更 |
| 認証失敗 | トークン期限切れ | トークン更新 |
| タイムアウト | ネットワーク | タイムアウト値調整 |
| 権限エラー | アクセス権不足 | 権限設定確認 |

### デバッグ方法
```bash
# デバッグモード有効化
MCP_DEBUG=true claude-code

# ログレベル設定
MCP_LOG_LEVEL=debug mcp-server-github

# 接続テスト
mcp-test --server github --check-connection
```

## 🔄 更新情報

### 2025年8月の更新
- GitHub MCP: Actions連携強化
- Filesystem MCP: 監視機能追加
- PostgreSQL MCP: パフォーマンス改善

### 今後の予定
- **2025年9月**: LINE MCP開発開始
- **2025年10月**: Kubernetes MCP リリース
- **2025年11月**: 日本向けMCP拡充

## 📚 関連リソース

### 公式
- [MCP公式サイト](https://modelcontextprotocol.io)
- [GitHub](https://github.com/anthropics/mcp)
- [Discord](https://discord.gg/mcp)

### コミュニティ
- [MCP Japan](https://mcp-japan.dev)（準備中）
- [Qiita MCPタグ](https://qiita.com/tags/mcp)
- [Zenn MCP記事](https://zenn.dev/topics/mcp)

---
*このインデックスは定期的に更新されます*
*最終更新: 2025年8月29日*