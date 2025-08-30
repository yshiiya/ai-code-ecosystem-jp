import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ガイド - AI Code Ecosystem Japan',
  description: 'AIコーディングツールの使い方、ベストプラクティス、チュートリアル',
  keywords: 'AIコーディング, ガイド, チュートリアル, ベストプラクティス',
}

export default function GuidesPage() {
  const guides = [
    {
      category: '🚀 はじめに',
      items: [
        { 
          title: 'AIコーディングとは？', 
          href: '/guides/what-is-ai-coding',
          description: 'AIコーディングの基本概念と可能性'
        },
        { 
          title: '非エンジニアのためのAIコーディング入門', 
          href: '/guides/for-non-engineers',
          description: 'プログラミング未経験者向けの始め方ガイド'
        },
        { 
          title: '環境構築ガイド', 
          href: '/guides/setup',
          description: 'Mac/Windows別の環境構築手順'
        },
      ]
    },
    {
      category: '🛠️ ツール別ガイド',
      items: [
        { 
          title: 'Claude Code完全ガイド', 
          href: '/guides/claude-code-guide',
          description: 'Claude Codeの詳細な使い方とTips'
        },
        { 
          title: 'GitHub Copilot活用術', 
          href: '/guides/github-copilot-guide',
          description: '効率的なコード補完の使い方'
        },
        { 
          title: 'Cursor vs Windsurf 比較', 
          href: '/guides/cursor-vs-windsurf',
          description: 'AI IDE選びのポイント'
        },
      ]
    },
    {
      category: '💡 実践テクニック',
      items: [
        { 
          title: 'プロンプトエンジニアリング', 
          href: '/guides/prompt-engineering',
          description: '効果的なプロンプトの書き方'
        },
        { 
          title: 'AIペアプログラミング', 
          href: '/guides/pair-programming',
          description: 'AIと協働する開発手法'
        },
        { 
          title: 'コードレビューの自動化', 
          href: '/guides/code-review',
          description: 'AIを使ったコード品質向上'
        },
      ]
    },
    {
      category: '📚 ユースケース',
      items: [
        { 
          title: 'Webアプリ開発', 
          href: '/guides/web-development',
          description: 'React/Next.jsプロジェクトの構築'
        },
        { 
          title: 'データ分析・可視化', 
          href: '/guides/data-analysis',
          description: 'PythonとAIでデータ分析'
        },
        { 
          title: '業務自動化スクリプト', 
          href: '/guides/automation',
          description: '日常業務を自動化する'
        },
      ]
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">ガイド & チュートリアル</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AIコーディングを始めるための包括的なガイド集。
          初心者から上級者まで、レベルに応じた学習コンテンツを提供。
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-2xl mb-12">
        <h2 className="text-2xl font-bold mb-4">🎯 おすすめの学習パス</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <h3 className="font-semibold mb-2">初心者向け</h3>
            <ol className="text-sm space-y-1">
              <li>1. AIコーディングとは？</li>
              <li>2. 環境構築ガイド</li>
              <li>3. Claude Code入門</li>
            </ol>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <h3 className="font-semibold mb-2">実践者向け</h3>
            <ol className="text-sm space-y-1">
              <li>1. プロンプトエンジニアリング</li>
              <li>2. ツール比較と選択</li>
              <li>3. 実践プロジェクト</li>
            </ol>
          </div>
          <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
            <h3 className="font-semibold mb-2">上級者向け</h3>
            <ol className="text-sm space-y-1">
              <li>1. MCP開発</li>
              <li>2. カスタムツール作成</li>
              <li>3. エンタープライズ導入</li>
            </ol>
          </div>
        </div>
      </div>

      {guides.map((section) => (
        <section key={section.category}>
          <h2 className="text-2xl font-bold mb-6">{section.category}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((guide) => (
              <div
                key={guide.href}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                <p className="text-gray-700 mb-3">{guide.description}</p>
                <div className="text-sm text-primary-600 font-medium">
                  近日公開予定
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="bg-gray-100 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">📹 動画コンテンツ（準備中）</h2>
        <p className="text-gray-700 mb-6">
          より分かりやすく学べる動画チュートリアルを準備中です。
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">5分で分かるシリーズ</h3>
            <p className="text-sm text-gray-600">各ツールの概要を短時間で理解</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">実践ハンズオン</h3>
            <p className="text-sm text-gray-600">実際にアプリを作りながら学ぶ</p>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">Tips & Tricks</h3>
            <p className="text-sm text-gray-600">効率化のための小技集</p>
          </div>
        </div>
      </section>
    </div>
  )
}