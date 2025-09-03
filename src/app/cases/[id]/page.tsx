import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCaseById, getDifficultyColor, getDifficultyLabel, useCases } from '@/lib/cases'
import { 
  Clock, 
  Users, 
  Wrench, 
  Target, 
  Github, 
  ArrowLeft, 
  CheckCircle,
  Code,
  Lightbulb,
  BookOpen
} from 'lucide-react'

interface CaseDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return useCases.map((useCase) => ({
    id: useCase.id,
  }))
}

export async function generateMetadata({ params }: CaseDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const useCase = getCaseById(id)
  
  if (!useCase) {
    return {
      title: 'ページが見つかりません',
    }
  }

  return {
    title: `${useCase.title} - 使用事例`,
    description: useCase.description,
    openGraph: {
      title: `${useCase.title} - 使用事例`,
      description: useCase.description,
      type: 'article',
    },
  }
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params
  const useCase = getCaseById(id)

  if (!useCase) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <section className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            使用事例一覧に戻る
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(useCase.difficulty)}`}>
                {getDifficultyLabel(useCase.difficulty)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {useCase.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {useCase.description}
            </p>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">所要時間</span>
                </div>
                <p className="text-gray-600">{useCase.estimatedTime}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">対象者</span>
                </div>
                <p className="text-gray-600">{useCase.targetAudience}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900">成果物</span>
                </div>
                <p className="text-gray-600">{useCase.outcome}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Code className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-900">技術数</span>
                </div>
                <p className="text-gray-600">{useCase.technologies.length}つの技術</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Tools Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Wrench className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">使用ツール</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {useCase.tools.map((tool, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100"
                      >
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-gray-900">{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    <h2 className="text-2xl font-bold text-gray-900">実装機能</h2>
                  </div>
                  <div className="space-y-3">
                    {useCase.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100"
                      >
                        <CheckCircle className="w-5 h-5 text-yellow-600" />
                        <span className="text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">使用技術</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {useCase.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Code Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-6 h-6 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">実装手順</h2>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    {useCase.id === 'beginner-html' && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-900 mb-3">1. 基本構造の作成</h3>
                          <p className="text-gray-600 mb-4">ChatGPTに以下のように質問します：</p>
                          <div className="bg-white p-4 rounded border">
                            <code className="text-sm text-gray-800">
                              「自己紹介サイトのHTML構造を作成してください。ヘッダー、プロフィール、スキル、お問い合わせのセクションを含めて」
                            </code>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-900 mb-3">2. スタイリング</h3>
                          <p className="text-gray-600 mb-4">レスポンシブ対応のCSSを追加：</p>
                          <div className="bg-white p-4 rounded border">
                            <code className="text-sm text-gray-800">
                              「モバイルフレンドリーなCSSスタイルを作成し、Bootstrap 5を使用してください」
                            </code>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-900 mb-3">3. インタラクティブ要素</h3>
                          <p className="text-gray-600 mb-4">JavaScriptでスムーススクロールを実装：</p>
                          <div className="bg-white p-4 rounded border">
                            <code className="text-sm text-gray-800">
                              「ナビゲーションメニューでスムーススクロールするJavaScriptコードを書いてください」
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                    {useCase.id === 'intermediate-react' && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-900 mb-3">1. プロジェクト初期化</h3>
                          <div className="bg-white p-4 rounded border">
                            <code className="text-sm text-gray-800">
                              {`npm create vite@latest todo-app -- --template react-ts
cd todo-app
npm install`}
                            </code>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-900 mb-3">2. GitHub Copilotを活用</h3>
                          <p className="text-gray-600 mb-4">コメントでAIに指示を出します：</p>
                          <div className="bg-white p-4 rounded border">
                            <code className="text-sm text-gray-800">
                              {`// TODOアイテムの型定義を作成
// タスク追加、削除、編集の機能を持つコンポーネント`}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                    {useCase.id === 'data-python' && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-900 mb-3">1. データ読み込み</h3>
                          <div className="bg-white p-4 rounded border">
                            <code className="text-sm text-gray-800">
                              {`import pandas as pd
import matplotlib.pyplot as plt

# CSVファイルを読み込み
df = pd.read_csv('sales_data.csv')`}
                            </code>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-900 mb-3">2. データ分析</h3>
                          <div className="bg-white p-4 rounded border">
                            <code className="text-sm text-gray-800">
                              {`# 月別売上トレンド分析
monthly_sales = df.groupby('month')['sales'].sum()`}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                    {useCase.id === 'automation-work' && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-900 mb-3">1. Google Apps Scriptプロジェクト作成</h3>
                          <p className="text-gray-600 mb-4">Claudeに以下を依頼：</p>
                          <div className="bg-white p-4 rounded border">
                            <code className="text-sm text-gray-800">
                              「Gmail APIを使用して、特定のキーワードを含むメールに自動返信するGoogle Apps Scriptを作成してください」
                            </code>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="font-bold text-gray-900 mb-3">2. トリガー設定</h3>
                          <div className="bg-white p-4 rounded border">
                            <code className="text-sm text-gray-800">
                              {`function createEmailTrigger() {
  ScriptApp.newTrigger('processEmails')
    .timeBased()
    .everyMinutes(5)
    .create();
}`}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* GitHub Repository */}
                {useCase.githubUrl && (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">サンプルコード</h3>
                    <a
                      href={useCase.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span className="font-medium">GitHubで見る</span>
                    </a>
                  </div>
                )}

                {/* Related Cases */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">関連事例</h3>
                  <div className="space-y-3">
                    {useCases
                      .filter(c => c.id !== useCase.id)
                      .slice(0, 3)
                      .map((relatedCase) => (
                        <Link
                          key={relatedCase.id}
                          href={`/cases/${relatedCase.id}`}
                          className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(relatedCase.difficulty)}`}>
                              {getDifficultyLabel(relatedCase.difficulty)}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {relatedCase.title}
                          </h4>
                        </Link>
                      ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="font-bold text-gray-900 mb-4">始めてみませんか？</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    この事例を参考に、あなたも同様のプロジェクトを作成できます。
                  </p>
                  <Link
                    href="/tools"
                    className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    ツールを探す
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}