import { Metadata } from 'next'
import Link from 'next/link'
import { mcpServers } from '@/lib/data'

export const metadata: Metadata = {
  title: 'MCP (Model Context Protocol) - AI Code Ecosystem Japan',
  description: 'Model Context Protocol サーバー一覧。GitHub、Filesystem、Slack連携など',
  keywords: 'MCP, Model Context Protocol, Claude Code, GitHub MCP, Filesystem MCP',
}

export default function MCPPage() {
  const mcpByCategory = mcpServers.reduce((acc, mcp) => {
    if (!acc[mcp.category]) {
      acc[mcp.category] = []
    }
    acc[mcp.category].push(mcp)
    return acc
  }, {} as Record<string, typeof mcpServers>)

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Model Context Protocol (MCP)</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          MCPは、AIアシスタントと外部システムを接続するためのオープンスタンダードプロトコルです。
          データソース、ツール、計算リソースへの安全なアクセスを提供します。
        </p>
      </div>

      <div className="bg-primary-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">MCPとは？</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">🔌 主な特徴</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• AIと外部システムの標準化された接続</li>
              <li>• セキュアなデータアクセス</li>
              <li>• プラグイン方式の拡張性</li>
              <li>• Claude Codeとの完全統合</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">🚀 利用メリット</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• ローカルファイルへの安全なアクセス</li>
              <li>• GitHub/GitLab統合</li>
              <li>• データベース接続</li>
              <li>• カスタムツールの作成</li>
            </ul>
          </div>
        </div>
      </div>

      {Object.entries(mcpByCategory).map(([category, categoryMCPs]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
            {category}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryMCPs.map((mcp) => (
              <Link
                key={mcp.id}
                href={`/mcp/${mcp.id}`}
                className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{mcp.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    mcp.status === 'stable' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {mcp.status === 'stable' ? '安定版' : 'コミュニティ'}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{mcp.description}</p>
                <div className="text-sm text-primary-600 font-medium">
                  詳細を見る →
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="bg-gray-100 p-8 rounded-2xl mt-12">
        <h2 className="text-2xl font-bold mb-4">MCPサーバーの導入方法</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">1. Claude Codeの設定ファイルを編集</h3>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-sm">
              <code>{`# ~/.claude/claude_desktop_config.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"]
    }
  }
}`}</code>
            </pre>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">2. 環境変数の設定</h3>
            <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-sm">
              <code>{`# APIキーなどの設定
export GITHUB_TOKEN="your-token-here"`}</code>
            </pre>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">3. Claude Codeを再起動</h3>
            <p className="text-gray-700">設定を反映させるためにClaude Codeを再起動します。</p>
          </div>
        </div>
      </section>
    </div>
  )
}