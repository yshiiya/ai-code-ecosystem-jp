import { tools } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "AIツール比較 - AI Code Ecosystem Japan",
	description:
		"主要AIコーディングツールの詳細比較。機能、価格、特徴を一覧で確認",
	keywords: "AI比較, Claude Code, GitHub Copilot, Cursor, 料金比較",
};

export default function ComparePage() {
	const compareTools = tools.slice(0, 6); // 主要6ツール

	const features = [
		{ key: "price", label: "月額料金" },
		{ key: "context", label: "コンテキスト長" },
		{ key: "multiFile", label: "マルチファイル編集" },
		{ key: "agent", label: "エージェント機能" },
		{ key: "completion", label: "コード補完" },
		{ key: "chat", label: "チャット機能" },
		{ key: "ide", label: "IDE統合" },
		{ key: "mcp", label: "MCP対応" },
		{ key: "git", label: "Git統合" },
		{ key: "japanese", label: "日本語対応" },
		{ key: "local", label: "ローカルLLM" },
		{ key: "enterprise", label: "エンタープライズ" },
	];

	const toolFeatures: Record<string, Record<string, string | boolean>> = {
		"claude-code": {
			price: "$20/月",
			context: "200k",
			multiFile: true,
			agent: true,
			completion: false,
			chat: true,
			ide: "VS Code",
			mcp: true,
			git: true,
			japanese: "◎",
			local: false,
			enterprise: true,
		},
		"github-copilot": {
			price: "$10/月",
			context: "8k",
			multiFile: false,
			agent: false,
			completion: true,
			chat: true,
			ide: "全主要IDE",
			mcp: false,
			git: true,
			japanese: "○",
			local: false,
			enterprise: true,
		},
		cursor: {
			price: "$20/月",
			context: "32k",
			multiFile: true,
			agent: false,
			completion: true,
			chat: true,
			ide: "独立IDE",
			mcp: false,
			git: true,
			japanese: "△",
			local: false,
			enterprise: false,
		},
		windsurf: {
			price: "$10/月",
			context: "32k",
			multiFile: true,
			agent: true,
			completion: true,
			chat: true,
			ide: "独立IDE",
			mcp: false,
			git: true,
			japanese: "△",
			local: false,
			enterprise: false,
		},
		cline: {
			price: "無料",
			context: "可変",
			multiFile: true,
			agent: true,
			completion: false,
			chat: true,
			ide: "VS Code",
			mcp: false,
			git: true,
			japanese: "○",
			local: true,
			enterprise: false,
		},
		aider: {
			price: "無料",
			context: "可変",
			multiFile: true,
			agent: false,
			completion: false,
			chat: true,
			ide: "CLI",
			mcp: false,
			git: true,
			japanese: "△",
			local: true,
			enterprise: false,
		},
	};

	return (
		<div className="space-y-8">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">AIコーディングツール比較</h1>
				<p className="text-xl text-gray-600 max-w-3xl mx-auto">
					主要AIコーディングツールの機能、価格、特徴を詳細に比較。
					あなたのニーズに最適なツールを見つけましょう。
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full bg-white rounded-lg shadow-lg">
					<thead>
						<tr className="bg-gray-50">
							<th className="text-left p-4 font-semibold border-b">機能</th>
							{compareTools.map((tool) => (
								<th
									key={tool.id}
									className="p-4 font-semibold border-b text-center min-w-[120px]"
								>
									<div className="text-sm">{tool.name}</div>
									<div className="text-xs text-gray-500 font-normal mt-1">
										{tool.category}
									</div>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{features.map((feature, index) => (
							<tr
								key={feature.key}
								className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
							>
								<td className="p-4 font-medium border-b">{feature.label}</td>
								{compareTools.map((tool) => {
									const value = toolFeatures[tool.id]?.[feature.key];
									return (
										<td key={tool.id} className="p-4 border-b text-center">
											{typeof value === "boolean" ? (
												value ? (
													<span className="text-green-600 text-xl">✓</span>
												) : (
													<span className="text-gray-400 text-xl">✗</span>
												)
											) : (
												<span
													className={
														feature.key === "price" && value === "無料"
															? "text-green-600 font-semibold"
															: ""
													}
												>
													{value || "—"}
												</span>
											)}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="grid md:grid-cols-2 gap-8 mt-12">
				<section className="bg-primary-50 p-6 rounded-lg">
					<h2 className="text-xl font-bold mb-4">🎯 用途別おすすめ</h2>
					<div className="space-y-4">
						<div>
							<h3 className="font-semibold mb-1">初心者・非エンジニア</h3>
							<p className="text-sm text-gray-700">
								<strong>Claude Code</strong> -
								日本語対応が優秀で、エージェント機能により自動的にタスクを実行
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-1">プロ開発者</h3>
							<p className="text-sm text-gray-700">
								<strong>GitHub Copilot</strong> -
								全IDE対応で高速補完、企業導入実績多数
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-1">フルスタック開発</h3>
							<p className="text-sm text-gray-700">
								<strong>Cursor</strong> -
								IDE一体型で効率的、Composer機能で複数ファイル編集
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-1">無料で始めたい</h3>
							<p className="text-sm text-gray-700">
								<strong>Cline</strong> -
								オープンソースで完全無料、透明性の高い動作
							</p>
						</div>
					</div>
				</section>

				<section className="bg-gray-100 p-6 rounded-lg">
					<h2 className="text-xl font-bold mb-4">💡 選び方のポイント</h2>
					<ul className="space-y-3 text-sm">
						<li className="flex items-start">
							<span className="text-primary-600 mr-2">•</span>
							<div>
								<strong>予算</strong>:
								無料ツールから始めて、必要に応じて有料版へ
							</div>
						</li>
						<li className="flex items-start">
							<span className="text-primary-600 mr-2">•</span>
							<div>
								<strong>開発環境</strong>: 使用中のIDEとの互換性を確認
							</div>
						</li>
						<li className="flex items-start">
							<span className="text-primary-600 mr-2">•</span>
							<div>
								<strong>機能</strong>: コード補完重視かエージェント機能重視か
							</div>
						</li>
						<li className="flex items-start">
							<span className="text-primary-600 mr-2">•</span>
							<div>
								<strong>セキュリティ</strong>:
								企業利用の場合はエンタープライズ版を検討
							</div>
						</li>
						<li className="flex items-start">
							<span className="text-primary-600 mr-2">•</span>
							<div>
								<strong>学習曲線</strong>:
								初心者は日本語対応が充実したツールから
							</div>
						</li>
					</ul>
				</section>
			</div>

			<section className="bg-white p-8 rounded-lg shadow-sm">
				<h2 className="text-2xl font-bold mb-6">📊 詳細比較チャート</h2>
				<div className="grid md:grid-cols-3 gap-6">
					<div>
						<h3 className="font-semibold mb-3">価格帯別</h3>
						<div className="space-y-2 text-sm">
							<div className="p-2 bg-green-50 rounded">
								<strong className="text-green-700">無料</strong>: Cline, Aider,
								Continue.dev
							</div>
							<div className="p-2 bg-blue-50 rounded">
								<strong className="text-blue-700">$10/月</strong>: GitHub
								Copilot, Windsurf
							</div>
							<div className="p-2 bg-purple-50 rounded">
								<strong className="text-purple-700">$20/月</strong>: Claude
								Code, Cursor
							</div>
						</div>
					</div>
					<div>
						<h3 className="font-semibold mb-3">動作環境別</h3>
						<div className="space-y-2 text-sm">
							<div className="p-2 bg-gray-50 rounded">
								<strong>CLI</strong>: Claude Code, Aider
							</div>
							<div className="p-2 bg-gray-50 rounded">
								<strong>VS Code拡張</strong>: Cline, GitHub Copilot
							</div>
							<div className="p-2 bg-gray-50 rounded">
								<strong>独立IDE</strong>: Cursor, Windsurf
							</div>
						</div>
					</div>
					<div>
						<h3 className="font-semibold mb-3">特徴別</h3>
						<div className="space-y-2 text-sm">
							<div className="p-2 bg-yellow-50 rounded">
								<strong className="text-yellow-700">エージェント型</strong>:
								Claude Code, Cline, Windsurf
							</div>
							<div className="p-2 bg-orange-50 rounded">
								<strong className="text-orange-700">補完特化</strong>: GitHub
								Copilot, Codeium
							</div>
							<div className="p-2 bg-red-50 rounded">
								<strong className="text-red-700">Git統合</strong>: Aider, Claude
								Code
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
