import { cliTools } from "@/lib/data";
import { getCLIData } from "@/lib/markdown";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PageProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { id } = await params;
	const cli = cliTools.find((c) => c.id === id);

	if (!cli) {
		return {
			title: "CLI Tool Not Found",
		};
	}

	return {
		title: `${cli.name} - CLI Tool - AI Code Ecosystem Japan`,
		description: cli.description,
		keywords: `${cli.name}, CLI, ${cli.category}, 開発ツール`,
	};
}

export default async function CLIPage({ params }: PageProps) {
	const { id } = await params;
	const cli = cliTools.find((c) => c.id === id);
	const markdownData = await getCLIData(id);

	if (!cli) {
		notFound();
	}

	return (
		<div className="max-w-4xl mx-auto">
			<nav className="mb-6">
				<Link href="/cli" className="text-primary-600 hover:underline">
					← CLIツール一覧に戻る
				</Link>
			</nav>

			<div className="bg-white rounded-lg shadow-lg p-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">{cli.name}</h1>
					<div className="flex gap-2 mb-4">
						<span className="bg-primary-100 text-primary-700 px-3 py-1 rounded">
							{cli.category}
						</span>
						<div className="flex gap-1">
							{cli.os.map((os) => (
								<span
									key={os}
									className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
								>
									{os === "mac"
										? "macOS"
										: os === "windows"
											? "Windows"
											: "Linux"}
								</span>
							))}
						</div>
					</div>
					<p className="text-lg text-gray-700">{cli.description}</p>
				</div>

				{markdownData ? (
					<div className="prose prose-lg max-w-none">
						<ReactMarkdown
							remarkPlugins={[remarkGfm]}
							components={{
								h1: ({ children }) => (
									<h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>
								),
								h2: ({ children }) => (
									<h2 className="text-xl font-semibold mt-6 mb-3">
										{children}
									</h2>
								),
								h3: ({ children }) => (
									<h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>
								),
								ul: ({ children }) => (
									<ul className="list-disc list-inside mb-4">{children}</ul>
								),
								ol: ({ children }) => (
									<ol className="list-decimal list-inside mb-4">{children}</ol>
								),
								li: ({ children }) => <li className="mb-1">{children}</li>,
								p: ({ children }) => <p className="mb-4">{children}</p>,
								code: ({ children, className }) => {
									const isInline = !className;
									return isInline ? (
										<code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
											{children}
										</code>
									) : (
										<code className={className}>{children}</code>
									);
								},
								pre: ({ children }) => (
									<pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
										{children}
									</pre>
								),
								a: ({ href, children }) => (
									<a
										href={href}
										className="text-primary-600 hover:underline"
										target={href?.startsWith("http") ? "_blank" : undefined}
										rel={
											href?.startsWith("http")
												? "noopener noreferrer"
												: undefined
										}
									>
										{children}
									</a>
								),
								blockquote: ({ children }) => (
									<blockquote className="border-l-4 border-primary-500 pl-4 italic mb-4">
										{children}
									</blockquote>
								),
							}}
						>
							{markdownData.content}
						</ReactMarkdown>
					</div>
				) : (
					<div className="bg-gray-50 p-6 rounded-lg">
						<h2 className="text-xl font-semibold mb-4">基本情報</h2>
						<div className="space-y-3">
							<div>
								<span className="font-medium">カテゴリ:</span> {cli.category}
							</div>
							<div>
								<span className="font-medium">対応OS:</span>{" "}
								{cli.os
									.map((os) =>
										os === "mac"
											? "macOS"
											: os === "windows"
												? "Windows"
												: "Linux",
									)
									.join(", ")}
							</div>
							<div>
								<span className="font-medium">説明:</span> {cli.description}
							</div>
						</div>
						<div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
							<p className="text-sm text-yellow-800">
								詳細なドキュメントは準備中です。
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
