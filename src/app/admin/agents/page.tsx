'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AgentStatus {
  name: string
  nameJp: string
  status: 'running' | 'success' | 'failed' | 'pending' | 'unknown'
  lastRun?: string
  nextRun?: string
  lastError?: string
  successRate?: number
  totalRuns?: number
}

interface WorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string
  created_at: string
  html_url: string
}

export default function AgentMonitoringDashboard() {
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      name: 'Research Agent',
      nameJp: 'リサーチエージェント',
      status: 'unknown',
      nextRun: '6時間ごと'
    },
    {
      name: 'Data Updater Agent',
      nameJp: 'データ更新エージェント',
      status: 'unknown',
      nextRun: '毎日 2:00'
    },
    {
      name: 'Content Creator Agent',
      nameJp: 'コンテンツ作成エージェント',
      status: 'unknown',
      nextRun: 'トリガーベース'
    },
    {
      name: 'Translation Agent',
      nameJp: '翻訳エージェント',
      status: 'pending',
      nextRun: '実装予定'
    },
    {
      name: 'Community Insights Agent',
      nameJp: 'コミュニティ分析エージェント',
      status: 'pending',
      nextRun: '実装予定'
    }
  ])

  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [repoUrl] = useState('https://github.com/yshiiya/ai-code-ecosystem-jp')

  // GitHubワークフロー実行履歴を取得（シミュレーション）
  useEffect(() => {
    const fetchWorkflowRuns = async () => {
      setIsLoading(true)
      
      // 実際の実装ではGitHub APIを使用
      // const response = await fetch('https://api.github.com/repos/yshiiya/ai-code-ecosystem-jp/actions/runs')
      
      // シミュレーションデータ
      const mockRuns: WorkflowRun[] = [
        {
          id: 1,
          name: 'Daily Agent Updates',
          status: 'completed',
          conclusion: 'success',
          created_at: new Date().toISOString(),
          html_url: `${repoUrl}/actions/runs/1`
        },
        {
          id: 2,
          name: 'Weekly Agent Report',
          status: 'in_progress',
          conclusion: '',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          html_url: `${repoUrl}/actions/runs/2`
        }
      ]
      
      setWorkflowRuns(mockRuns)
      
      // エージェントステータスを更新
      const updatedAgents = agents.map((agent, index) => {
        if (index < 2) {
          return {
            ...agent,
            status: 'success' as const,
            lastRun: new Date().toLocaleString('ja-JP'),
            successRate: 95 + Math.random() * 5,
            totalRuns: Math.floor(10 + Math.random() * 20)
          }
        }
        return agent
      })
      
      setAgents(updatedAgents)
      setLastUpdated(new Date())
      setIsLoading(false)
    }

    fetchWorkflowRuns()
    const interval = setInterval(fetchWorkflowRuns, 30000) // 30秒ごとに更新
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800 animate-pulse'
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return '🔄'
      case 'success': return '✅'
      case 'failed': return '❌'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  const triggerWorkflow = async (workflowName: string) => {
    alert(`ワークフロー "${workflowName}" の手動実行を開始します。\n\nGitHub Actionsページで確認してください: ${repoUrl}/actions`)
    
    // 実際の実装ではGitHub APIを使用
    // await fetch(`https://api.github.com/repos/yshiiya/ai-code-ecosystem-jp/actions/workflows/${workflowId}/dispatches`, {
    //   method: 'POST',
    //   headers: { 'Authorization': `token ${GITHUB_TOKEN}` },
    //   body: JSON.stringify({ ref: 'main' })
    // })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🤖 エージェント監視ダッシュボード
              </h1>
              <p className="text-gray-600 mt-2">
                AIエージェントの稼働状況をリアルタイムで監視
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">最終更新</p>
              <p className="text-lg font-medium">{lastUpdated.toLocaleString('ja-JP')}</p>
              {isLoading && <span className="text-blue-600">🔄 更新中...</span>}
            </div>
          </div>
          
          <div className="flex gap-4">
            <Link 
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              ← サイトに戻る
            </Link>
            <a 
              href={`${repoUrl}/actions`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              GitHub Actions →
            </a>
          </div>
        </div>

        {/* エージェントステータス */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {agents.map((agent) => (
            <div key={agent.name} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{agent.nameJp}</h2>
                  <p className="text-sm text-gray-500">{agent.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)} {agent.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                {agent.lastRun && (
                  <div>
                    <span className="text-gray-600">最終実行:</span>
                    <span className="ml-2 font-medium">{agent.lastRun}</span>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-600">次回実行:</span>
                  <span className="ml-2 font-medium">{agent.nextRun}</span>
                </div>
                
                {agent.successRate && (
                  <div>
                    <span className="text-gray-600">成功率:</span>
                    <span className="ml-2 font-medium">{agent.successRate.toFixed(1)}%</span>
                    <span className="text-gray-500 ml-1">({agent.totalRuns}回実行)</span>
                  </div>
                )}
                
                {agent.lastError && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-red-700 text-xs">
                    {agent.lastError}
                  </div>
                )}
              </div>
              
              {agent.status !== 'pending' && (
                <button
                  onClick={() => triggerWorkflow(agent.name)}
                  className="mt-4 w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition text-sm"
                >
                  手動実行
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ワークフロー実行履歴 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">📊 実行履歴</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">ワークフロー</th>
                  <th className="px-4 py-2 text-left">ステータス</th>
                  <th className="px-4 py-2 text-left">実行時刻</th>
                  <th className="px-4 py-2 text-left">アクション</th>
                </tr>
              </thead>
              <tbody>
                {workflowRuns.map((run) => (
                  <tr key={run.id} className="border-t">
                    <td className="px-4 py-3">{run.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        run.conclusion === 'success' ? 'bg-green-100 text-green-800' :
                        run.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {run.conclusion || run.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(run.created_at).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={run.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        詳細 →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* システムヘルス */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">💊 システムヘルス</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-3xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">稼働率</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-3xl font-bold text-blue-600">142</div>
              <div className="text-sm text-gray-600">総実行回数</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded">
              <div className="text-3xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-600">アクティブ</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-3xl font-bold text-purple-600">2.3s</div>
              <div className="text-sm text-gray-600">平均実行時間</div>
            </div>
          </div>
        </div>

        {/* 手動コントロール */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">🎮 手動コントロール</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => triggerWorkflow('daily-update')}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
            >
              🔄 日次更新を実行
            </button>
            <button
              onClick={() => triggerWorkflow('weekly-report')}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
            >
              📊 週次レポート生成
            </button>
            <button
              onClick={() => alert('ヘルスチェック実行中...')}
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition"
            >
              💊 ヘルスチェック
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
            >
              🔄 ダッシュボード更新
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}