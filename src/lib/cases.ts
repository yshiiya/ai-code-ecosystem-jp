export interface UseCase {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  targetAudience: string
  tools: string[]
  outcome: string
  features: string[]
  technologies: string[]
  githubUrl?: string
}

export const useCases: UseCase[] = [
  {
    id: 'beginner-html',
    title: '初心者：HTMLページ作成',
    description: 'プログラミング未経験者がAIツールを使って自己紹介サイトを作成する事例',
    difficulty: 'beginner',
    estimatedTime: '2-3時間',
    targetAudience: 'プログラミング未経験者',
    tools: ['ChatGPT', 'VS Code', 'Live Server'],
    outcome: '自己紹介サイト（HTML/CSS/JavaScript）',
    features: [
      'レスポンシブデザイン',
      'スムーススクロール',
      'お問い合わせフォーム',
      'ポートフォリオギャラリー'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    githubUrl: 'https://github.com/example/portfolio-site'
  },
  {
    id: 'intermediate-react',
    title: '中級者：Reactアプリ開発',
    description: '基本を学んだ人がGitHub CopilotとCursorを使ってTODOアプリを開発する事例',
    difficulty: 'intermediate',
    estimatedTime: '1-2日',
    targetAudience: 'プログラミング基礎知識のある人',
    tools: ['GitHub Copilot', 'Cursor', 'React', 'TypeScript'],
    outcome: 'TODOアプリ（React + TypeScript）',
    features: [
      'タスク追加・削除・編集',
      'カテゴリ分類',
      '優先度設定',
      'ローカルストレージ保存',
      'ダークモード'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    githubUrl: 'https://github.com/example/react-todo-app'
  },
  {
    id: 'data-python',
    title: 'データ分析：Pythonスクリプト作成',
    description: 'Excelユーザーが売上データの分析を自動化するPythonスクリプトを作成する事例',
    difficulty: 'intermediate',
    estimatedTime: '半日',
    targetAudience: 'Excel操作に慣れた事務職・営業職',
    tools: ['ChatGPT', 'Jupyter Notebook', 'Pandas', 'Matplotlib'],
    outcome: '売上データ分析スクリプト',
    features: [
      'CSVファイル読み込み',
      '売上トレンド分析',
      'グラフ自動生成',
      'レポート出力',
      '異常値検出'
    ],
    technologies: ['Python', 'Pandas', 'Matplotlib', 'Jupyter', 'NumPy'],
    githubUrl: 'https://github.com/example/sales-analysis'
  },
  {
    id: 'automation-work',
    title: '業務効率化：定型作業の自動化',
    description: '事務職が繰り返し作業をClaude + Google Apps Scriptで自動化する事例',
    difficulty: 'beginner',
    estimatedTime: '1-2時間',
    targetAudience: 'Google Workspace利用者',
    tools: ['Claude', 'Google Apps Script', 'Gmail API', 'Google Sheets'],
    outcome: 'メール自動返信システム',
    features: [
      'キーワード自動判定',
      'テンプレート自動選択',
      'データベース自動更新',
      '送信履歴記録',
      'エラー通知'
    ],
    technologies: ['Google Apps Script', 'Gmail API', 'Google Sheets API', 'JavaScript'],
    githubUrl: 'https://github.com/example/email-automation'
  }
]

export function getCaseById(id: string): UseCase | undefined {
  return useCases.find(useCase => useCase.id === id)
}

export function getDifficultyColor(difficulty: UseCase['difficulty']): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800'
    case 'advanced':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getDifficultyLabel(difficulty: UseCase['difficulty']): string {
  switch (difficulty) {
    case 'beginner':
      return '初級'
    case 'intermediate':
      return '中級'
    case 'advanced':
      return '上級'
    default:
      return '不明'
  }
}