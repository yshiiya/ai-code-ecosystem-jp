"use client";

import { useState } from "react";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/lib/data";
import { Cpu, Puzzle, Bot, Terminal, Code2, Filter } from "lucide-react";

// カテゴリー説明とアイコンの定義
const categoryInfo: Record<string, { description: string; icon: React.ReactNode; color: string }> = {
	"AIネイティブIDE": {
		description: "AIを中心に設計された統合開発環境。従来のエディタを超えた全く新しい開発体験を提供",
		icon: <Cpu className="w-5 h-5" />,
		color: "bg-purple-100 text-purple-700 border-purple-200",
	},
	"IDE拡張機能": {
		description: "既存のVS CodeやJetBrains IDEに追加するAI支援機能。使い慣れた環境をAIで強化",
		icon: <Puzzle className="w-5 h-5" />,
		color: "bg-blue-100 text-blue-700 border-blue-200",
	},
	"自律エージェント": {
		description: "指示を与えると自動的にコードを書き、修正し、完成まで導くAIアシスタント",
		icon: <Bot className="w-5 h-5" />,
		color: "bg-green-100 text-green-700 border-green-200",
	},
	"コマンドラインツール": {
		description: "ターミナルから直接利用できるAIツール。CLIワークフローに統合可能",
		icon: <Terminal className="w-5 h-5" />,
		color: "bg-orange-100 text-orange-700 border-orange-200",
	},
	"基盤技術・API": {
		description: "他のツールの基盤となるAIモデルやAPI。直接利用または統合開発に使用",
		icon: <Code2 className="w-5 h-5" />,
		color: "bg-gray-100 text-gray-700 border-gray-200",
	},
};

export default function ToolsPage() {
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	
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

	// フィルタリング処理
	const filteredCategories = selectedCategory
		? { [selectedCategory]: toolsByCategory[selectedCategory] }
		: toolsByCategory;

	// カテゴリーの順序を定義
	const categoryOrder = [
		"AIネイティブIDE",
		"IDE拡張機能",
		"自律エージェント",
		"コマンドラインツール",
		"基盤技術・API",
	];

	const sortedCategories = Object.entries(filteredCategories).sort(
		(a, b) => categoryOrder.indexOf(a[0]) - categoryOrder.indexOf(b[0])
	);

	return (
		<div className="space-y-8">
			{/* ヘッダー */}
			<div className="text-center mb-12">
				<h1 className="text-4xl font-bold mb-4">AIコーディングツール一覧</h1>
				<p className="text-xl text-gray-600 max-w-3xl mx-auto">
					最新のAIコーディングツールを比較・検討。あなたの開発スタイルに最適なツールを見つけましょう。
				</p>
			</div>

			{/* カテゴリーフィルター */}
			<div className="mb-8">
				<div className="flex items-center justify-center gap-2 mb-4">
					<Filter className="w-5 h-5 text-gray-600" />
					<span className="text-sm font-medium text-gray-600">カテゴリーで絞り込み</span>
				</div>
				<div className="flex flex-wrap gap-2 justify-center">
					<button
						className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
							!selectedCategory 
								? "bg-primary-600 text-white border-primary-600" 
								: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
						}`}
						onClick={() => setSelectedCategory(null)}
					>
						すべて ({tools.length})
					</button>
					{categoryOrder.map((category) => {
						const info = categoryInfo[category];
						const count = toolsByCategory[category]?.length || 0;
						if (count === 0) return null;
						
						return (
							<button
								key={category}
								className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
									selectedCategory === category
										? info.color
										: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
								}`}
								onClick={() => setSelectedCategory(
									selectedCategory === category ? null : category
								)}
							>
								{info.icon}
								<span>{category} ({count})</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* カテゴリー別ツール表示 */}
			{sortedCategories.map(([category, categoryTools]) => {
				const info = categoryInfo[category];
				return (
					<section key={category} id={category.replace(/\s+/g, "-")} className="scroll-mt-20">
						<div className="mb-6">
							<div className="flex items-center gap-3 mb-3">
								<div className={`p-2 rounded-lg ${info?.color || "bg-gray-100"}`}>
									{info?.icon}
								</div>
								<h2 className="text-2xl font-bold">{category}</h2>
								<span className="text-sm text-gray-500">({categoryTools.length}ツール)</span>
							</div>
							{info?.description && (
								<p className="text-gray-600 ml-11">{info.description}</p>
							)}
						</div>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{categoryTools.map((tool) => (
								<ToolCard key={tool.id} tool={tool} />
							))}
						</div>
					</section>
				);
			})}

			{/* ツール選びのガイド */}
			<section className="bg-gradient-to-r from-primary-50 to-blue-50 p-8 rounded-2xl mt-12">
				<h2 className="text-2xl font-bold mb-6">🎯 あなたに合ったツールの選び方</h2>
				<div className="grid md:grid-cols-3 gap-6">
					<div className="bg-white p-4 rounded-lg">
						<h3 className="text-lg font-semibold mb-3 text-purple-700">初心者向け</h3>
						<ul className="space-y-2 text-sm text-gray-700">
							<li className="flex items-start gap-2">
								<span className="text-purple-500 mt-0.5">▶</span>
								<div>
									<strong>GitHub Copilot</strong>
									<br />無料プランあり・VS Code統合
								</div>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-purple-500 mt-0.5">▶</span>
								<div>
									<strong>Cline</strong>
									<br />完全無料・透明性の高いエージェント
								</div>
							</li>
						</ul>
					</div>
					
					<div className="bg-white p-4 rounded-lg">
						<h3 className="text-lg font-semibold mb-3 text-blue-700">プロ開発者向け</h3>
						<ul className="space-y-2 text-sm text-gray-700">
							<li className="flex items-start gap-2">
								<span className="text-blue-500 mt-0.5">▶</span>
								<div>
									<strong>Cursor</strong>
									<br />AIファーストIDE・高度な補完
								</div>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-blue-500 mt-0.5">▶</span>
								<div>
									<strong>Claude Code</strong>
									<br />自律的な問題解決・MCP対応
								</div>
							</li>
						</ul>
					</div>
					
					<div className="bg-white p-4 rounded-lg">
						<h3 className="text-lg font-semibold mb-3 text-green-700">企業向け</h3>
						<ul className="space-y-2 text-sm text-gray-700">
							<li className="flex items-start gap-2">
								<span className="text-green-500 mt-0.5">▶</span>
								<div>
									<strong>Amazon Q</strong>
									<br />AWS統合・セキュリティ重視
								</div>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-green-500 mt-0.5">▶</span>
								<div>
									<strong>Tabnine</strong>
									<br />プライベートAI学習対応
								</div>
							</li>
						</ul>
					</div>
				</div>
				
				<div className="mt-6 p-4 bg-white/50 rounded-lg">
					<p className="text-sm text-gray-600">
						💡 <strong>選び方のコツ：</strong>まずは無料ツール（Cline、Aider）や無料プラン（GitHub Copilot）から始めて、
						自分の開発スタイルに合うものを見つけましょう。その後、有料ツールへの移行を検討するのがおすすめです。
					</p>
				</div>
			</section>
		</div>
	);
}
