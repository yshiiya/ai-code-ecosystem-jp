"use client";

import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/data";

export default function ToolsPage() {
	const toolsByCategory = tools.reduce(
		(acc, tool) => {
			if (!acc[tool.category]) {
				acc[tool.category] = [];
			}
			acc[tool.category].push(tool);
			return acc;
		},
		{} as Record<string, typeof tools>,
	);

	return (
		<div className="space-y-8">
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">AIコーディングツール一覧</h1>
				<p className="text-xl text-gray-600 max-w-3xl mx-auto">
					最新のAIコーディングツールを比較・検討。あなたに最適なツールを見つけましょう。
				</p>
			</div>

			<div className="mb-8">
				<div className="flex flex-wrap gap-2 justify-center">
					{Object.keys(toolsByCategory).map((category) => (
						<button
							key={category}
							className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition"
							onClick={() => {
								const element = document.getElementById(
									category.replace(/\s+/g, "-"),
								);
								element?.scrollIntoView({ behavior: "smooth" });
							}}
						>
							{category} ({toolsByCategory[category].length})
						</button>
					))}
				</div>
			</div>

			{Object.entries(toolsByCategory).map(([category, categoryTools]) => (
				<section key={category} id={category.replace(/\s+/g, "-")}>
					<h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category}</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{categoryTools.map((tool) => (
							<ToolCard key={tool.id} tool={tool} />
						))}
					</div>
				</section>
			))}

			<section className="bg-primary-50 p-8 rounded-2xl mt-12">
				<h2 className="text-2xl font-bold mb-4">ツール選びのポイント</h2>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-lg font-semibold mb-2">🎯 用途で選ぶ</h3>
						<ul className="space-y-1 text-gray-700">
							<li>• コード補完重視 → GitHub Copilot, Codeium</li>
							<li>• エージェント型 → Claude Code, Cline</li>
							<li>• IDE一体型 → Cursor, Windsurf</li>
							<li>• CLI環境 → Aider, Claude Code</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-2">💰 予算で選ぶ</h3>
						<ul className="space-y-1 text-gray-700">
							<li>• 無料 → Cline, Aider, Continue.dev</li>
							<li>• $10/月 → GitHub Copilot, Windsurf</li>
							<li>• $20/月 → Claude Code, Cursor</li>
							<li>• 企業向け → Amazon Q, GitHub Copilot Enterprise</li>
						</ul>
					</div>
				</div>
			</section>
		</div>
	);
}
