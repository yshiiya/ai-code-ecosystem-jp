import Link from "next/link"
import ToolCard from "@/components/ToolCard"
import { tools, mcpServers, cliTools } from "@/lib/data"

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          AI Code Ecosystem Japan
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          AIコーディングツールとエコシステムの日本語総合情報サイト
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/tools"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            ツールを探す
          </Link>
          <Link
            href="/guides/getting-started"
            className="bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-900 transition"
          >
            始め方ガイド
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-3xl font-bold text-primary-600">15+</div>
          <div className="text-gray-600 mt-2">AIツール</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-3xl font-bold text-primary-600">30+</div>
          <div className="text-gray-600 mt-2">MCP</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-3xl font-bold text-primary-600">50+</div>
          <div className="text-gray-600 mt-2">CLIツール</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-3xl font-bold text-primary-600">100+</div>
          <div className="text-gray-600 mt-2">ガイド記事</div>
        </div>
      </section>

      {/* Featured Tools */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">主要AIコーディングツール</h2>
          <Link href="/tools" className="text-primary-600 hover:underline">
            すべて見る →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.slice(0, 6).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* MCP Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Model Context Protocol (MCP)</h2>
          <Link href="/mcp" className="text-primary-600 hover:underline">
            すべて見る →
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700 mb-4">
            MCPは、AIアシスタントと外部システムを接続するためのオープンスタンダードプロトコルです。
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mcpServers.slice(0, 4).map((mcp) => (
              <Link
                key={mcp.id}
                href={`/mcp/${mcp.id}`}
                className="block p-4 border rounded-lg hover:border-primary-500 transition"
              >
                <h3 className="font-semibold">{mcp.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{mcp.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CLI Tools Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">CLI・開発環境ツール</h2>
          <Link href="/cli" className="text-primary-600 hover:underline">
            すべて見る →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cliTools.slice(0, 6).map((cli) => (
            <div
              key={cli.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{cli.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{cli.category}</p>
              <p className="text-sm text-gray-700 mt-2">{cli.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section className="bg-primary-50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-6">始め方ガイド</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/guides/beginner"
            className="block bg-white p-6 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">🎯 初心者向け</h3>
            <p className="text-gray-700">
              AIコーディングを始めるための基本的な知識と環境構築方法
            </p>
          </Link>
          <Link
            href="/guides/tool-selection"
            className="block bg-white p-6 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">🔍 ツール選択ガイド</h3>
            <p className="text-gray-700">
              あなたに最適なAIコーディングツールの選び方
            </p>
          </Link>
          <Link
            href="/guides/best-practices"
            className="block bg-white p-6 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">💡 ベストプラクティス</h3>
            <p className="text-gray-700">
              効率的なAIコーディングのための実践的なTips
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}