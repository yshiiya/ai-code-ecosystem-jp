# Filesystem MCP - 詳細情報

## 基本情報
- **開発元**: Anthropic
- **カテゴリ**: ファイルシステム操作
- **用途**: ローカルファイル管理
- **最終更新**: 2025年8月29日
- **ステータス**: 🟢 安定版

## 概要
Filesystem MCPは、AIアシスタントがローカルファイルシステムと安全にやり取りするためのMCPサーバーです。ファイルの読み書き、ディレクトリ操作、検索などを提供しつつ、セキュリティを確保します。

## 主要機能
- **ファイル操作**: 読み取り、書き込み、作成、削除
- **ディレクトリ操作**: 作成、削除、一覧表示
- **検索機能**: ファイル名、内容での検索
- **監視機能**: ファイル変更の監視
- **メタデータ**: ファイル情報取得
- **一括操作**: 複数ファイルの同時処理

## インストール方法

### npmでインストール
```bash
# グローバルインストール
npm install -g @modelcontextprotocol/server-filesystem

# ローカルインストール
npm install @modelcontextprotocol/server-filesystem
```

### 設定ファイル
```json
// ~/.claude/mcp.json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": [
        "--allowed-directories",
        "/Users/username/Documents,/Users/username/Projects"
      ],
      "env": {
        "FS_WATCH": "true",
        "FS_HIDDEN_FILES": "false"
      }
    }
  }
}
```

## セキュリティ設定

### アクセス制御
```json
{
  "filesystem": {
    "command": "mcp-server-filesystem",
    "args": [
      // 許可するディレクトリ
      "--allowed-directories", "/path/to/safe/directory",
      
      // 除外パターン
      "--exclude", "*.env,*.key,node_modules/**",
      
      // 読み取り専用モード
      "--readonly",
      
      // 隠しファイル非表示
      "--no-hidden"
    ]
  }
}
```

### 権限レベル
| レベル | 説明 | 設定 |
|--------|------|------|
| 読み取り専用 | ファイル読み取りのみ | `--readonly` |
| 制限付き書き込み | 特定拡張子のみ | `--allowed-extensions .txt,.md` |
| フル権限 | すべての操作 | デフォルト |

## 使用可能なコマンド

### ファイル操作
```javascript
// ファイル読み取り
filesystem.readFile("/path/to/file.txt")

// ファイル書き込み
filesystem.writeFile("/path/to/file.txt", "content")

// ファイル追記
filesystem.appendFile("/path/to/file.txt", "additional content")

// ファイル削除
filesystem.deleteFile("/path/to/file.txt")

// ファイルコピー
filesystem.copyFile("/source/file.txt", "/dest/file.txt")

// ファイル移動/リネーム
filesystem.moveFile("/old/path.txt", "/new/path.txt")
```

### ディレクトリ操作
```javascript
// ディレクトリ作成
filesystem.createDirectory("/path/to/new/directory")

// ディレクトリ一覧
filesystem.listDirectory("/path/to/directory", {
  recursive: true,
  includeHidden: false
})

// ディレクトリ削除
filesystem.removeDirectory("/path/to/directory", {
  recursive: true
})

// ディレクトリツリー
filesystem.getDirectoryTree("/path/to/root")
```

### 検索操作
```javascript
// ファイル名検索
filesystem.findFiles({
  pattern: "*.js",
  directory: "/project",
  recursive: true
})

// 内容検索
filesystem.searchInFiles({
  query: "TODO",
  directory: "/project",
  extensions: [".js", ".ts"]
})

// 正規表現検索
filesystem.regexSearch({
  pattern: /function\s+\w+/g,
  directory: "/src"
})
```

## Claude Codeでの使用例

```bash
# ファイル読み取り
Claude: "src/main.tsの内容を見せて"

# ファイル作成
Claude: "README.mdを日本語に翻訳して保存"

# ディレクトリ構造表示
Claude: "プロジェクトの構造を見せて"

# ファイル検索
Claude: "TODOコメントがあるファイルをすべて見つけて"

# 一括リネーム
Claude: "test_*.jsファイルをspec_*.jsにリネーム"
```

## 高度な使い方

### ファイル監視
```javascript
// ファイル変更監視
filesystem.watchFile("/path/to/file.txt", (event) => {
  console.log(`File ${event.type}: ${event.path}`);
});

// ディレクトリ監視
filesystem.watchDirectory("/project", {
  recursive: true,
  events: ["create", "modify", "delete"]
});
```

### バッチ処理
```javascript
// 複数ファイル一括読み取り
const files = await filesystem.readMultipleFiles([
  "/file1.txt",
  "/file2.txt",
  "/file3.txt"
]);

// 一括変換
await filesystem.processFiles({
  pattern: "*.md",
  operation: (content) => content.toUpperCase()
});
```

### テンプレート操作
```javascript
// プロジェクトテンプレート作成
filesystem.createFromTemplate({
  template: "/templates/react-app",
  destination: "/new-project",
  variables: {
    name: "MyApp",
    version: "1.0.0"
  }
});
```

## パフォーマンス設定

### キャッシュ設定
```json
{
  "filesystem": {
    "env": {
      "FS_CACHE": "true",
      "FS_CACHE_SIZE": "100MB",
      "FS_CACHE_TTL": "3600"
    }
  }
}
```

### 並列処理
```javascript
// 並列ファイル処理
const results = await Promise.all([
  filesystem.readFile("/file1.txt"),
  filesystem.readFile("/file2.txt"),
  filesystem.readFile("/file3.txt")
]);
```

## セーフティ機能

### バックアップ
```javascript
// 自動バックアップ
filesystem.enableBackup({
  directory: "/backup",
  beforeWrite: true,
  keepVersions: 5
});
```

### トランザクション
```javascript
// トランザクション処理
await filesystem.transaction(async (tx) => {
  await tx.writeFile("/file1.txt", "content1");
  await tx.writeFile("/file2.txt", "content2");
  // エラー時は自動ロールバック
});
```

## エラーハンドリング

### 一般的なエラー
```javascript
try {
  await filesystem.readFile("/protected/file");
} catch (error) {
  if (error.code === 'EACCES') {
    // アクセス拒否
  } else if (error.code === 'ENOENT') {
    // ファイル不存在
  }
}
```

### エラーコード
| コード | 説明 | 対処法 |
|--------|------|--------|
| EACCES | アクセス拒否 | 権限確認 |
| ENOENT | ファイル不存在 | パス確認 |
| EEXIST | 既存ファイル | 上書き確認 |
| ENOSPC | 容量不足 | 空き容量確保 |

## ベストプラクティス

1. **セキュリティ**
   - 最小権限の原則
   - 許可ディレクトリの明示
   - 機密ファイルの除外

2. **パフォーマンス**
   - キャッシュ活用
   - 並列処理
   - 大量ファイルのストリーミング

3. **エラー処理**
   - 適切な例外処理
   - バックアップ戦略
   - トランザクション利用

## 制限事項

- **ファイルサイズ**: 最大1GB/ファイル
- **同時操作**: 最大100ファイル
- **監視対象**: 最大1000ファイル
- **検索深度**: 最大10階層

## 関連リソース
- [MCP Filesystem仕様](https://github.com/anthropics/mcp-servers/tree/main/packages/filesystem)
- [Node.js fs module](https://nodejs.org/api/fs.html)
- [ファイルシステムベストプラクティス](https://docs.mcp.io/filesystem)

---
*最終確認日: 2025年8月29日*
*次回更新予定: 2025年9月15日*