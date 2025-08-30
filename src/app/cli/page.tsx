import { Metadata } from 'next'
import Link from 'next/link'
import { cliTools } from '@/lib/data'

export const metadata: Metadata = {
  title: 'CLI・開発環境ツール - AI Code Ecosystem Japan',
  description: 'ターミナル、シェル、Git、検索ツールなど開発環境を強化するCLIツール一覧',
  keywords: 'CLI, ターミナル, iTerm2, Warp, Git, lazygit, fzf, ripgrep',
}

export default function CLIPage() {
  const cliByCategory = cliTools.reduce((acc, cli) => {
    if (!acc[cli.category]) {
      acc[cli.category] = []
    }
    acc[cli.category].push(cli)
    return acc
  }, {} as Record<string, typeof cliTools>)

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">CLI・開発環境ツール</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AIコーディングを支える強力なCLIツールと開発環境。
          ターミナル、シェル、Git、検索ツールで開発効率を最大化。
        </p>
      </div>

      <div className="bg-primary-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">なぜCLIツールが重要か？</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">🚀 AI時代のCLI</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Claude CodeやAiderなどのCLIツールとの連携</li>
              <li>• 高速なファイル操作と検索</li>
              <li>• Git操作の効率化</li>
              <li>• 自動化とスクリプティング</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">⚡ 生産性向上</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• キーボードのみでの高速操作</li>
              <li>• 複雑なタスクの自動化</li>
              <li>• リモート環境での作業</li>
              <li>• バージョン管理の簡素化</li>
            </ul>
          </div>
        </div>
      </div>

      {Object.entries(cliByCategory).map(([category, categoryCLIs]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
            {category}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCLIs.map((cli) => (
              <Link
                key={cli.id}
                href={`/cli/${cli.id}`}
                className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold mb-2">{cli.name}</h3>
                <div className="flex gap-1 mb-3">
                  {cli.os.map((os) => (
                    <span key={os} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      {os === 'mac' ? '🍎 Mac' : os === 'windows' ? '🪟 Win' : '🐧 Linux'}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-3">{cli.description}</p>
                <div className="text-sm text-primary-600 font-medium">
                  詳細を見る →
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="bg-gray-100 p-8 rounded-2xl mt-12">
        <h2 className="text-2xl font-bold mb-4">おすすめセットアップ</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🍎 Mac環境</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• iTerm2 + Oh My Zsh</li>
              <li>• Homebrew でツール管理</li>
              <li>• GitHub CLI + lazygit</li>
              <li>• fzf + ripgrep で高速検索</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🪟 Windows環境</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Windows Terminal + WSL2</li>
              <li>• Scoop でツール管理</li>
              <li>• Git Bash + GitHub CLI</li>
              <li>• PowerShell 7 カスタマイズ</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🐧 Linux環境</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Alacritty + Fish Shell</li>
              <li>• apt/yum でツール管理</li>
              <li>• tmux でセッション管理</li>
              <li>• neovim + プラグイン</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}