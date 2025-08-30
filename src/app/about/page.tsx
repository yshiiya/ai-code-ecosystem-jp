import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - AI Code Ecosystem Japan',
  description: 'AI Code Ecosystem Japanについて。ミッション、ビジョン、運営方針',
  keywords: 'About, AI Code Ecosystem Japan, ミッション, ビジョン',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">About AI Code Ecosystem Japan</h1>
        <p className="text-xl text-gray-600">
          日本のAIコーディング文化を創造し、すべての人がプログラミングの力を手にできる未来へ
        </p>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-primary-600">🎯 ミッション</h2>
        <p className="text-lg leading-relaxed mb-4">
          AI Code Ecosystem Japanは、日本語話者のためのAIコーディング情報プラットフォームです。
          私たちは、言語の壁を取り除き、最新のAIコーディング技術を日本のすべての人に届けることを使命としています。
        </p>
        <p className="text-lg leading-relaxed">
          特に、プログラミング経験のない方々が、AIの力を借りて自分のアイデアを形にできるよう、
          分かりやすい情報と実践的なガイドを提供します。
        </p>
      </section>

      <section className="bg-primary-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-primary-700">🌟 ビジョン</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">誰もがクリエイターになれる世界</h3>
            <p className="text-gray-700">
              プログラミングの専門知識がなくても、アイデアを実現できる社会を目指します。
            </p>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">日本発のイノベーション</h3>
            <p className="text-gray-700">
              日本独自のAIコーディング文化を育み、世界に発信していきます。
            </p>
          </div>
          <div className="bg-white p-4 rounded">
            <h3 className="font-semibold mb-2">コミュニティの力</h3>
            <p className="text-gray-700">
              ユーザー同士が学び合い、助け合えるコミュニティを構築します。
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">📋 提供する価値</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary-600">情報の集約</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• 最新ツールの日本語情報</li>
              <li>• 実践的な使い方ガイド</li>
              <li>• 比較・選定の支援</li>
              <li>• トラブルシューティング</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary-600">学習支援</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• 初心者向けチュートリアル</li>
              <li>• 実践プロジェクト例</li>
              <li>• ベストプラクティス</li>
              <li>• コミュニティサポート</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">🚀 今後の展開</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="text-2xl mr-4">📚</span>
            <div>
              <h3 className="font-semibold mb-1">Phase 1: 情報整備（現在）</h3>
              <p className="text-sm text-gray-700">
                主要ツールの情報収集と整理、基本的なガイドの作成
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-4">🎥</span>
            <div>
              <h3 className="font-semibold mb-1">Phase 2: コンテンツ拡充</h3>
              <p className="text-sm text-gray-700">
                動画チュートリアル、実践プロジェクト、テンプレート提供
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-4">👥</span>
            <div>
              <h3 className="font-semibold mb-1">Phase 3: コミュニティ構築</h3>
              <p className="text-sm text-gray-700">
                フォーラム、Q&A、ユーザー投稿、イベント開催
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-4">🌏</span>
            <div>
              <h3 className="font-semibold mb-1">Phase 4: グローバル展開</h3>
              <p className="text-sm text-gray-700">
                日本発のAIコーディング文化を世界へ発信
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">🤝 協力・貢献</h2>
        <p className="text-lg mb-6">
          AI Code Ecosystem Japanは、コミュニティの皆様と共に成長していきます。
          以下の方法で、プロジェクトに貢献いただけます：
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">コンテンツ貢献</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• ツールレビューの投稿</li>
              <li>• 使い方Tipsの共有</li>
              <li>• 翻訳・ローカライズ</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">技術貢献</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• GitHubでの開発協力</li>
              <li>• バグ報告・修正</li>
              <li>• 新機能の提案</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 text-center">
          <a
            href="https://github.com/yourusername/ai-code-ecosystem-jp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            GitHubで貢献する →
          </a>
        </div>
      </section>

      <section className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">お問い合わせ</h2>
        <p className="text-gray-700 mb-6">
          ご質問、ご提案、パートナーシップのご相談など、お気軽にお問い合わせください。
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="mailto:contact@ai-code-ecosystem.jp"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            メールで問い合わせ
          </a>
          <a
            href="https://twitter.com/aicode_jp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Twitterでフォロー
          </a>
        </div>
      </section>
    </div>
  )
}