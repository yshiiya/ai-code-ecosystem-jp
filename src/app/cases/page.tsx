import { Metadata } from 'next'
import Link from 'next/link'
import { useCases, getDifficultyColor, getDifficultyLabel } from '@/lib/cases'
import { Clock, Users, Wrench, Target, Github, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: '使用事例 - AI開発エコシステム',
  description: 'AIツールを活用した実際の開発事例をご紹介します。初心者から上級者まで、レベル別の実践例をご覧ください。',
  openGraph: {
    title: '使用事例 - AI開発エコシステム',
    description: 'AIツールを活用した実際の開発事例をご紹介します。',
    type: 'website',
  },
}

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              実際の<span className="text-blue-600">使用事例</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              AIツールを活用した実際の開発事例をご紹介します。<br />
              あなたのレベルに合った実践例から学び、すぐに始められます。
            </p>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {useCases.map((useCase) => (
              <Link
                key={useCase.id}
                href={`/cases/${useCase.id}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(useCase.difficulty)}`}>
                            {getDifficultyLabel(useCase.difficulty)}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {useCase.title}
                        </h2>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors group-hover:translate-x-1" />
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {useCase.description}
                    </p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {useCase.estimatedTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          {useCase.targetAudience}
                        </span>
                      </div>
                    </div>

                    {/* Tools */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Wrench className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">使用ツール</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {useCase.tools.map((tool, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Outcome */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-gray-700">成果物</span>
                      </div>
                      <p className="text-sm text-gray-600">{useCase.outcome}</p>
                    </div>

                    {/* Technologies */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {useCase.technologies.slice(0, 4).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {useCase.technologies.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{useCase.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* GitHub Link */}
                    {useCase.githubUrl && (
                      <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                        <Github className="w-4 h-4" />
                        <span>サンプルコードを見る</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                あなたのプロジェクトも始めてみませんか？
              </h3>
              <p className="text-gray-600 mb-8">
                これらの事例を参考に、AIツールを活用した開発を始めましょう。<br />
                適切なツールの選択から実装まで、段階的に学べます。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/tools"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  ツールを探す
                </Link>
                <Link
                  href="/getting-started"
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  始め方を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}