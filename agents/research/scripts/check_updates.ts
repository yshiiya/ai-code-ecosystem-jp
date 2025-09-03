#!/usr/bin/env ts-node

/**
 * AI Tool Research Agent - 更新チェックスクリプト
 * 各AIツールの最新情報を収集し、更新があれば通知
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import * as yaml from "js-yaml";

// 型定義
interface ToolSource {
	official: {
		website?: string;
		blog?: string;
		github?: string;
		docs?: string;
		changelog?: string;
	};
	monitoring: {
		rss?: string;
		github_releases?: string;
		twitter?: string;
		changelog_api?: string;
	};
	update_frequency: string;
}

interface UpdateInfo {
	tool: string;
	timestamp: string;
	type: "version" | "feature" | "price" | "announcement";
	title: string;
	description: string;
	url?: string;
	importance: "low" | "medium" | "high" | "critical";
}

class ResearchAgent {
	private sourcesPath = join(__dirname, "../../config/sources.yaml");
	private reportsPath = join(__dirname, "../reports");
	private sources: Record<string, ToolSource> = {};
	private updates: UpdateInfo[] = [];

	constructor() {
		this.loadSources();
		this.ensureReportsDirectory();
	}

	/**
	 * 情報源設定を読み込み
	 */
	private loadSources() {
		try {
			const fileContent = readFileSync(this.sourcesPath, "utf8");
			const config = yaml.load(fileContent) as any;
			this.sources = config.tools;
			console.log(
				`✅ ${Object.keys(this.sources).length}個のツール情報源を読み込みました`,
			);
		} catch (error) {
			console.error("❌ 情報源の読み込みに失敗:", error);
			process.exit(1);
		}
	}

	/**
	 * レポートディレクトリを確認・作成
	 */
	private ensureReportsDirectory() {
		if (!existsSync(this.reportsPath)) {
			mkdirSync(this.reportsPath, { recursive: true });
			console.log("📁 レポートディレクトリを作成しました");
		}
	}

	/**
	 * GitHubリリースをチェック
	 */
	private async checkGitHubReleases(
		tool: string,
		repo: string,
	): Promise<UpdateInfo | null> {
		try {
			// GitHub APIを使用（実際の実装では認証トークンが必要）
			const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;
			console.log(`  🔍 GitHub: ${repo}をチェック中...`);

			// シミュレーション用のダミーデータ
			// 実際の実装ではfetchを使用
			const mockRelease = {
				tag_name: "v1.2.0",
				name: "Release v1.2.0",
				body: "New features and improvements",
				html_url: `https://github.com/${repo}/releases/latest`,
				published_at: new Date().toISOString(),
			};

			return {
				tool,
				timestamp: new Date().toISOString(),
				type: "version",
				title: `${tool}: ${mockRelease.name}`,
				description: mockRelease.body,
				url: mockRelease.html_url,
				importance: "medium",
			};
		} catch (error) {
			console.error(`  ❌ ${tool}のGitHubチェックエラー:`, error);
			return null;
		}
	}

	/**
	 * RSS/ブログ更新をチェック
	 */
	private async checkBlogUpdates(
		tool: string,
		rssUrl: string,
	): Promise<UpdateInfo | null> {
		try {
			console.log(`  📰 RSS: ${rssUrl}をチェック中...`);

			// シミュレーション用のダミーデータ
			// 実際の実装ではRSSパーサーを使用
			return {
				tool,
				timestamp: new Date().toISOString(),
				type: "announcement",
				title: `${tool}: 新機能のお知らせ`,
				description: "最新の機能アップデートについて",
				url: rssUrl,
				importance: "low",
			};
		} catch (error) {
			console.error(`  ❌ ${tool}のRSSチェックエラー:`, error);
			return null;
		}
	}

	/**
	 * すべてのツールをチェック
	 */
	public async checkAllTools() {
		console.log("\n🚀 更新チェックを開始します...\n");

		for (const [toolName, source] of Object.entries(this.sources)) {
			console.log(`📌 ${toolName}をチェック中...`);

			// GitHubリリースチェック
			if (source.monitoring?.github_releases) {
				const update = await this.checkGitHubReleases(
					toolName,
					source.monitoring.github_releases,
				);
				if (update) this.updates.push(update);
			}

			// RSSチェック
			if (source.monitoring?.rss) {
				const update = await this.checkBlogUpdates(
					toolName,
					source.monitoring.rss,
				);
				if (update) this.updates.push(update);
			}

			// API経由のチェック（必要に応じて実装）
			if (source.monitoring?.changelog_api) {
				console.log(
					`  🔄 API: ${source.monitoring.changelog_api}をチェック中...`,
				);
			}
		}

		console.log(`\n✅ チェック完了: ${this.updates.length}件の更新を検出\n`);
	}

	/**
	 * レポートを生成
	 */
	public generateReport() {
		const timestamp = new Date().toISOString().split("T")[0];
		const reportPath = join(
			this.reportsPath,
			`update-report-${timestamp}.json`,
		);
		const markdownPath = join(
			this.reportsPath,
			`update-report-${timestamp}.md`,
		);

		// JSON形式で保存
		const reportData = {
			generated_at: new Date().toISOString(),
			total_updates: this.updates.length,
			updates: this.updates,
			summary: {
				critical: this.updates.filter((u) => u.importance === "critical")
					.length,
				high: this.updates.filter((u) => u.importance === "high").length,
				medium: this.updates.filter((u) => u.importance === "medium").length,
				low: this.updates.filter((u) => u.importance === "low").length,
			},
		};

		writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
		console.log(`📄 JSONレポート: ${reportPath}`);

		// Markdown形式でも保存
		const markdown = this.generateMarkdownReport(reportData);
		writeFileSync(markdownPath, markdown);
		console.log(`📝 Markdownレポート: ${markdownPath}`);
	}

	/**
	 * Markdownレポートを生成
	 */
	private generateMarkdownReport(data: any): string {
		let md = `# AIツール更新レポート\n\n`;
		md += `生成日時: ${new Date(data.generated_at).toLocaleString("ja-JP")}\n\n`;
		md += `## 📊 サマリー\n\n`;
		md += `- **総更新数**: ${data.total_updates}件\n`;
		md += `- **Critical**: ${data.summary.critical}件\n`;
		md += `- **High**: ${data.summary.high}件\n`;
		md += `- **Medium**: ${data.summary.medium}件\n`;
		md += `- **Low**: ${data.summary.low}件\n\n`;

		if (data.updates.length > 0) {
			md += `## 📋 更新詳細\n\n`;

			// 重要度別にグループ化
			const grouped = data.updates.reduce((acc: any, update: UpdateInfo) => {
				if (!acc[update.importance]) acc[update.importance] = [];
				acc[update.importance].push(update);
				return acc;
			}, {});

			// 重要度順に出力
			for (const importance of ["critical", "high", "medium", "low"]) {
				if (grouped[importance] && grouped[importance].length > 0) {
					md += `### ${this.getImportanceEmoji(importance)} ${importance.toUpperCase()}\n\n`;

					for (const update of grouped[importance]) {
						md += `#### ${update.title}\n`;
						md += `- **ツール**: ${update.tool}\n`;
						md += `- **タイプ**: ${this.getTypeLabel(update.type)}\n`;
						md += `- **説明**: ${update.description}\n`;
						if (update.url) md += `- **リンク**: [詳細を見る](${update.url})\n`;
						md += `- **検出時刻**: ${new Date(update.timestamp).toLocaleString("ja-JP")}\n\n`;
					}
				}
			}
		} else {
			md += `## ✅ 更新なし\n\n`;
			md += `現在、新しい更新はありません。\n`;
		}

		md += `\n---\n`;
		md += `*このレポートは自動生成されました*\n`;

		return md;
	}

	private getImportanceEmoji(importance: string): string {
		const emojis: Record<string, string> = {
			critical: "🚨",
			high: "⚠️",
			medium: "📌",
			low: "ℹ️",
		};
		return emojis[importance] || "📌";
	}

	private getTypeLabel(type: string): string {
		const labels: Record<string, string> = {
			version: "バージョン更新",
			feature: "新機能",
			price: "価格変更",
			announcement: "お知らせ",
		};
		return labels[type] || type;
	}

	/**
	 * 重要な更新を通知
	 */
	public notifyImportantUpdates() {
		const importantUpdates = this.updates.filter(
			(u) => u.importance === "critical" || u.importance === "high",
		);

		if (importantUpdates.length > 0) {
			console.log("\n🔔 重要な更新があります！\n");
			importantUpdates.forEach((update) => {
				console.log(
					`${this.getImportanceEmoji(update.importance)} ${update.title}`,
				);
				console.log(`  ${update.description}`);
				if (update.url) console.log(`  🔗 ${update.url}`);
				console.log("");
			});
		}
	}
}

// メイン実行
async function main() {
	const agent = new ResearchAgent();

	try {
		await agent.checkAllTools();
		agent.generateReport();
		agent.notifyImportantUpdates();

		console.log("\n✨ Research Agent実行完了\n");
	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
		process.exit(1);
	}
}

// スクリプト実行
if (require.main === module) {
	main();
}

export type { UpdateInfo };
export { ResearchAgent };
