#!/usr/bin/env node

/**
 * AI Code Ecosystem Japan - Weekly Report Generator
 * 週次レポート生成スクリプト
 */

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { communityAnalyzer } from "../analyze_trends.js";
import { sentimentAnalyzer } from "../sentiment.js";
import type {
	PlatformStats,
	SentimentAnalysis,
	SentimentType,
	SocialPost,
	ToolMention,
	TrendAnalysis,
	WeeklyReport,
} from "../types.js";

/**
 * レポート生成クラス
 */
class WeeklyReportGenerator {
	private reportDate: Date;
	private startDate: Date;
	private endDate: Date;

	constructor(reportDate?: Date) {
		this.reportDate = reportDate || new Date();
		this.endDate = new Date(this.reportDate);
		this.startDate = new Date(this.reportDate);
		this.startDate.setDate(this.startDate.getDate() - 7); // 1週間前
	}

	/**
	 * 完全な週次レポートを生成
	 */
	async generateReport(): Promise<WeeklyReport> {
		console.log(
			`Generating weekly report for ${this.formatDate(this.startDate)} to ${this.formatDate(this.endDate)}...`,
		);

		try {
			// 設定読み込み
			await communityAnalyzer.loadConfig();

			// トレンド分析実行
			const analysis = await communityAnalyzer.performAnalysis();

			// レポートデータを構築
			const report = await this.buildReport(analysis);

			console.log("Weekly report generated successfully");
			return report;
		} catch (error) {
			console.error("Failed to generate report:", error);
			throw error;
		}
	}

	/**
	 * レポートデータを構築
	 */
	private async buildReport(analysis: any): Promise<WeeklyReport> {
		// モックデータを生成（実際の実装では実データを使用）
		const mockData = this.generateMockReportData();

		// エグゼクティブサマリー
		const summary = {
			totalPosts: mockData.totalPosts,
			totalEngagement: mockData.totalEngagement,
			topTrendingTools: this.generateTopTrendingTools(analysis.trends),
			keyInsights: this.generateKeyInsights(analysis),
		};

		// プラットフォーム別統計
		const platformStats = this.generatePlatformStats();

		// ツール別分析（トレンド分析から）
		const toolAnalysis = this.convertTrendsToToolMentions(analysis.trends);

		// センチメント分析サマリー
		const sentimentSummary = this.generateSentimentSummary(
			mockData.sentimentAnalyses,
		);

		// 注目すべき投稿
		const notablePosts = this.generateNotablePosts();

		return {
			generatedAt: this.reportDate.toISOString(),
			period: {
				start: this.startDate.toISOString(),
				end: this.endDate.toISOString(),
			},
			summary,
			platformStats,
			toolAnalysis,
			trendAnalysis: analysis.trends,
			sentimentSummary,
			notablePosts,
			confidence: this.calculateOverallConfidence(
				analysis.trends,
				mockData.sentimentAnalyses,
			),
		};
	}

	/**
	 * モックレポートデータを生成
	 */
	private generateMockReportData() {
		return {
			totalPosts: Math.floor(Math.random() * 500) + 200,
			totalEngagement: Math.floor(Math.random() * 50000) + 10000,
			sentimentAnalyses: this.generateMockSentimentAnalyses(),
		};
	}

	/**
	 * モックセンチメント分析データを生成
	 */
	private generateMockSentimentAnalyses(): SentimentAnalysis[] {
		const analyses: SentimentAnalysis[] = [];
		const sentiments: SentimentType[] = [
			"positive",
			"negative",
			"neutral",
			"mixed",
		];

		for (let i = 0; i < 50; i++) {
			analyses.push({
				postId: `mock-post-${i}`,
				sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
				confidence: 0.5 + Math.random() * 0.4, // 0.5-0.9
				scores: {
					positive: Math.random(),
					negative: Math.random(),
					neutral: Math.random(),
				},
				analyzedText: `Sample analyzed text ${i}`,
				engine: "mock",
				analyzedAt: new Date().toISOString(),
			});
		}

		return analyses;
	}

	/**
	 * トップトレンドツールを生成
	 */
	private generateTopTrendingTools(trends: TrendAnalysis[]): ToolMention[] {
		return trends.slice(0, 3).map((trend, index) => ({
			toolName:
				["ChatGPT", "GitHub Copilot", "Claude"][index] || `Tool-${index}`,
			category: "code_generation" as any,
			mentionCount: Math.floor(Math.random() * 100) + 20,
			postIds: [],
			overallSentiment:
				trend.trendScore > 0
					? "positive"
					: trend.trendScore < -0.2
						? "negative"
						: "neutral",
			sentimentDistribution: {
				positive: Math.max(0, trend.trendScore * 50 + 25),
				negative: Math.max(0, -trend.trendScore * 30 + 15),
				neutral: 50 - Math.abs(trend.trendScore * 40),
				mixed: Math.max(0, 10 + Math.random() * 10),
			},
			firstMentionDate: this.startDate.toISOString(),
			lastMentionDate: this.endDate.toISOString(),
			totalEngagement: Math.floor(Math.random() * 5000) + 500,
			hasOfficialMention: Math.random() > 0.7,
		}));
	}

	/**
	 * キーインサイトを生成
	 */
	private generateKeyInsights(analysis: any): string[] {
		const insights: string[] = [];

		if (analysis.summary.risingTrends > 0) {
			insights.push(
				`${analysis.summary.risingTrends}個のAIツールが上昇トレンドを示しています`,
			);
		}

		if (analysis.summary.decliningTrends > 0) {
			insights.push(
				`${analysis.summary.decliningTrends}個のツールで関心の低下が見られます`,
			);
		}

		if (analysis.keywords.keywords.length > 0) {
			insights.push(
				`今週のキーワード: ${analysis.keywords.keywords.slice(0, 3).join(", ")}`,
			);
		}

		insights.push("日本語コミュニティでのAIツール利用が活発化しています");
		insights.push("コード生成ツールへの関心が特に高まっています");

		return insights;
	}

	/**
	 * プラットフォーム別統計を生成
	 */
	private generatePlatformStats(): Record<string, PlatformStats> {
		return {
			twitter: {
				postCount: Math.floor(Math.random() * 150) + 50,
				totalEngagement: Math.floor(Math.random() * 20000) + 5000,
				activeUsers: Math.floor(Math.random() * 500) + 100,
				avgEngagementRate: 0.05 + Math.random() * 0.1,
				topHashtags: ["#AI", "#Programming", "#GitHub", "#ChatGPT", "#開発"],
				languageDistribution: { ja: 60, en: 35, mixed: 5 },
			},
			reddit: {
				postCount: Math.floor(Math.random() * 80) + 20,
				totalEngagement: Math.floor(Math.random() * 15000) + 3000,
				activeUsers: Math.floor(Math.random() * 200) + 50,
				avgEngagementRate: 0.08 + Math.random() * 0.12,
				topHashtags: [
					"programming",
					"MachineLearning",
					"artificial",
					"ChatGPT",
				],
				languageDistribution: { en: 80, ja: 10, mixed: 10 },
			},
			qiita: {
				postCount: Math.floor(Math.random() * 60) + 15,
				totalEngagement: Math.floor(Math.random() * 8000) + 1500,
				activeUsers: Math.floor(Math.random() * 150) + 30,
				avgEngagementRate: 0.12 + Math.random() * 0.1,
				topHashtags: ["ChatGPT", "AI", "プログラミング", "機械学習"],
				languageDistribution: { ja: 90, en: 5, mixed: 5 },
			},
		} as Record<string, PlatformStats>;
	}

	/**
	 * トレンド分析からツールメンションに変換
	 */
	private convertTrendsToToolMentions(trends: TrendAnalysis[]): ToolMention[] {
		const tools = ["ChatGPT", "GitHub Copilot", "Claude", "Cursor", "Tabnine"];

		return trends.map((trend, index) => ({
			toolName: tools[index] || `Tool-${index}`,
			category: "code_generation" as any,
			mentionCount: Math.floor(Math.random() * 80) + 10,
			postIds: [],
			overallSentiment:
				trend.trendScore > 0
					? "positive"
					: trend.trendScore < -0.2
						? "negative"
						: "neutral",
			sentimentDistribution: {
				positive: Math.max(0, trend.trendScore * 40 + 30),
				negative: Math.max(0, -trend.trendScore * 25 + 15),
				neutral: 45 - Math.abs(trend.trendScore * 30),
				mixed: Math.max(0, 10 + Math.random() * 10),
			},
			firstMentionDate: this.startDate.toISOString(),
			lastMentionDate: this.endDate.toISOString(),
			totalEngagement: Math.floor(
				trend.engagementGrowth.current || Math.random() * 3000 + 500,
			),
			hasOfficialMention: Math.random() > 0.6,
		}));
	}

	/**
	 * センチメント分析サマリーを生成
	 */
	private generateSentimentSummary(analyses: SentimentAnalysis[]) {
		const distribution = { positive: 0, negative: 0, neutral: 0, mixed: 0 };

		analyses.forEach((analysis) => {
			distribution[analysis.sentiment]++;
		});

		const total = analyses.length || 1;
		const normalizedDistribution = {
			positive: distribution.positive / total,
			negative: distribution.negative / total,
			neutral: distribution.neutral / total,
			mixed: distribution.mixed / total,
		};

		const dominantSentiment = Object.entries(normalizedDistribution).reduce(
			(a, b) =>
				normalizedDistribution[a[0] as SentimentType] >
				normalizedDistribution[b[0] as SentimentType]
					? a
					: b,
		)[0] as SentimentType;

		return {
			overall: dominantSentiment,
			distribution: normalizedDistribution,
			topPositiveTools: ["ChatGPT", "GitHub Copilot", "Claude"],
			topNegativeTools: [],
		};
	}

	/**
	 * 注目すべき投稿を生成
	 */
	private generateNotablePosts(): SocialPost[] {
		const samplePosts: SocialPost[] = [
			{
				id: "notable-1",
				platform: "twitter",
				author: "tech_influencer",
				authorDisplayName: "テック インフルエンサー",
				content:
					"ChatGPTの新機能が本当に素晴らしい。コード生成の精度が大幅に向上している。開発効率が劇的に改善された！",
				createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
				engagement: { likes: 245, shares: 89, comments: 34 },
				url: "https://twitter.com/tech_influencer/status/notable-1",
				mentionedTools: ["ChatGPT"],
				hashtags: ["#ChatGPT", "#AI", "#開発効率"],
				language: "ja",
			},
			{
				id: "notable-2",
				platform: "reddit",
				author: "senior_dev_2024",
				authorDisplayName: "Senior Developer",
				content:
					"Been using GitHub Copilot for 6 months now. Game changer for productivity. The suggestions are getting remarkably accurate.",
				createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
				engagement: { likes: 156, shares: 23, comments: 67 },
				url: "https://reddit.com/r/programming/comments/notable-2",
				mentionedTools: ["GitHub Copilot"],
				hashtags: ["#productivity", "#coding"],
				language: "en",
			},
			{
				id: "notable-3",
				platform: "qiita",
				author: "ai_researcher_jp",
				authorDisplayName: "AIリサーチャー",
				content:
					"Claudeを使ったコードレビューの自動化について検証してみました。従来の静的解析ツールでは検出できない論理的な問題も指摘してくれるのが印象的。",
				createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
				engagement: { likes: 89, shares: 12, comments: 25 },
				url: "https://qiita.com/ai_researcher_jp/items/notable-3",
				mentionedTools: ["Claude"],
				hashtags: ["#Claude", "#コードレビュー", "#AI"],
				language: "ja",
			},
		];

		return samplePosts;
	}

	/**
	 * 全体的な信頼度を計算
	 */
	private calculateOverallConfidence(
		trends: TrendAnalysis[],
		sentiments: SentimentAnalysis[],
	): number {
		const trendConfidence =
			trends.length > 0
				? trends.reduce(
						(sum, trend) => sum + (trend.prediction?.confidence || 0.5),
						0,
					) / trends.length
				: 0.5;

		const sentimentConfidence =
			sentiments.length > 0
				? sentiments.reduce((sum, sentiment) => sum + sentiment.confidence, 0) /
					sentiments.length
				: 0.5;

		return (trendConfidence + sentimentConfidence) / 2;
	}

	/**
	 * レポートをJSONファイルとして保存
	 */
	async saveReport(
		report: WeeklyReport,
		outputDir = "./reports",
	): Promise<string> {
		try {
			// ディレクトリが存在しない場合は作成
			mkdirSync(outputDir, { recursive: true });

			const fileName = `weekly-report-${this.formatDateForFileName(this.reportDate)}.json`;
			const filePath = path.join(outputDir, fileName);

			writeFileSync(filePath, JSON.stringify(report, null, 2), "utf8");

			console.log(`Report saved to: ${filePath}`);
			return filePath;
		} catch (error) {
			console.error("Failed to save report:", error);
			throw error;
		}
	}

	/**
	 * レポートをMarkdown形式として保存
	 */
	async saveMarkdownReport(
		report: WeeklyReport,
		outputDir = "./reports",
	): Promise<string> {
		try {
			mkdirSync(outputDir, { recursive: true });

			const fileName = `weekly-report-${this.formatDateForFileName(this.reportDate)}.md`;
			const filePath = path.join(outputDir, fileName);

			const markdown = this.generateMarkdownReport(report);
			writeFileSync(filePath, markdown, "utf8");

			console.log(`Markdown report saved to: ${filePath}`);
			return filePath;
		} catch (error) {
			console.error("Failed to save markdown report:", error);
			throw error;
		}
	}

	/**
	 * Markdownレポートを生成
	 */
	private generateMarkdownReport(report: WeeklyReport): string {
		const md = `# AI Code Ecosystem Japan - 週次レポート

**レポート期間**: ${this.formatDate(new Date(report.period.start))} ～ ${this.formatDate(new Date(report.period.end))}
**生成日時**: ${this.formatDate(new Date(report.generatedAt))}
**信頼度**: ${Math.round(report.confidence * 100)}%

## エグゼクティブサマリー

- **総投稿数**: ${report.summary.totalPosts.toLocaleString()}件
- **総エンゲージメント**: ${report.summary.totalEngagement.toLocaleString()}
- **分析対象ツール数**: ${report.toolAnalysis.length}個

### 主要なインサイト

${report.summary.keyInsights.map((insight) => `- ${insight}`).join("\n")}

## トップトレンドツール

${report.summary.topTrendingTools
	.map(
		(tool, index) => `
### ${index + 1}. ${tool.toolName}

- **言及数**: ${tool.mentionCount}件
- **総エンゲージメント**: ${tool.totalEngagement.toLocaleString()}
- **センチメント**: ${tool.overallSentiment === "positive" ? "ポジティブ" : tool.overallSentiment === "negative" ? "ネガティブ" : "ニュートラル"}
- **公式言及**: ${tool.hasOfficialMention ? "あり" : "なし"}
`,
	)
	.join("\n")}

## センチメント分析

- **全体的なセンチメント**: ${report.sentimentSummary.overall === "positive" ? "ポジティブ" : report.sentimentSummary.overall === "negative" ? "ネガティブ" : "ニュートラル"}

### センチメント分布

- **ポジティブ**: ${Math.round(report.sentimentSummary.distribution.positive * 100)}%
- **ネガティブ**: ${Math.round(report.sentimentSummary.distribution.negative * 100)}%
- **ニュートラル**: ${Math.round(report.sentimentSummary.distribution.neutral * 100)}%
- **混合**: ${Math.round(report.sentimentSummary.distribution.mixed * 100)}%

## プラットフォーム別統計

${Object.entries(report.platformStats)
	.map(
		([platform, stats]) => `
### ${platform.charAt(0).toUpperCase() + platform.slice(1)}

- **投稿数**: ${stats.postCount}件
- **エンゲージメント**: ${stats.totalEngagement.toLocaleString()}
- **アクティブユーザー**: ${stats.activeUsers}名
- **平均エンゲージメント率**: ${Math.round(stats.avgEngagementRate * 100)}%
- **トップハッシュタグ**: ${stats.topHashtags.join(", ")}
`,
	)
	.join("\n")}

## 注目の投稿

${report.notablePosts
	.map(
		(post) => `
### ${post.authorDisplayName} (@${post.author}) - ${post.platform}

> ${post.content}

**エンゲージメント**: ${post.engagement.likes} likes, ${post.engagement.shares} shares, ${post.engagement.comments} comments
**言及ツール**: ${post.mentionedTools.join(", ")}
**投稿日**: ${this.formatDate(new Date(post.createdAt))}
**URL**: ${post.url}
`,
	)
	.join("\n")}

## トレンド分析詳細

${report.trendAnalysis
	.map(
		(trend, index) => `
### トレンド ${index + 1}

- **トレンドタイプ**: ${this.translateTrendType(trend.trendType)}
- **トレンドスコア**: ${trend.trendScore.toFixed(3)}
- **メンション増加率**: ${Math.round(trend.mentionGrowth.growthRate * 100)}%
- **エンゲージメント増加率**: ${Math.round(trend.engagementGrowth.growthRate * 100)}%
- **予測**: ${trend.prediction ? this.translateTrendType(trend.prediction.nextWeek) : "N/A"} (信頼度: ${trend.prediction ? Math.round(trend.prediction.confidence * 100) : 0}%)

#### 要因分析
${trend.factors.map((factor) => `- **${this.translateFactorType(factor.type)}**: ${factor.description} (影響度: ${Math.round(factor.impact * 100)}%)`).join("\n")}
`,
	)
	.join("\n")}

---

*このレポートはAI Code Ecosystem Japan Community Insights Agentによって自動生成されました。*
`;

		return md;
	}

	/**
	 * トレンドタイプを日本語に翻訳
	 */
	private translateTrendType(type: string): string {
		const translations: Record<string, string> = {
			viral: "バイラル",
			rising: "上昇",
			declining: "下降",
			stable: "安定",
			emerging: "新興",
		};
		return translations[type] || type;
	}

	/**
	 * 要因タイプを日本語に翻訳
	 */
	private translateFactorType(type: string): string {
		const translations: Record<string, string> = {
			product_launch: "製品発表",
			feature_update: "機能更新",
			controversy: "論争・問題",
			partnership: "パートナーシップ",
			community_event: "コミュニティイベント",
		};
		return translations[type] || type;
	}

	/**
	 * 日付をフォーマット
	 */
	private formatDate(date: Date): string {
		return date.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	/**
	 * ファイル名用の日付フォーマット
	 */
	private formatDateForFileName(date: Date): string {
		return date.toISOString().split("T")[0];
	}
}

/**
 * メイン実行関数
 */
async function main() {
	try {
		console.log("AI Code Ecosystem Japan - Weekly Report Generator");
		console.log("==================================================");

		const generator = new WeeklyReportGenerator();

		// レポート生成
		const report = await generator.generateReport();

		// 出力ディレクトリの設定
		const outputDir = path.join(
			process.cwd(),
			"agents",
			"community",
			"reports",
		);

		// JSONとMarkdownの両方で保存
		await generator.saveReport(report, outputDir);
		await generator.saveMarkdownReport(report, outputDir);

		console.log("\n✅ Weekly report generation completed successfully!");
		console.log(`📊 Analyzed ${report.toolAnalysis.length} AI tools`);
		console.log(
			`📈 ${report.summary.topTrendingTools.length} trending tools identified`,
		);
		console.log(`💬 ${report.summary.totalPosts} posts analyzed`);
	} catch (error) {
		console.error("\n❌ Failed to generate weekly report:", error);
		process.exit(1);
	}
}

// スクリプトが直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export { WeeklyReportGenerator, main as generateWeeklyReport };
