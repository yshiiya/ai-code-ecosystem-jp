/**
 * AI Code Ecosystem Japan - Trend Analysis Agent
 * トレンド分析エージェント
 */

import { readFileSync } from "fs";
import path from "path";
import { load } from "js-yaml";
import { type SentimentAnalyzer, sentimentAnalyzer } from "./sentiment.js";
import {
	AIToolCategory,
	type AnalysisEngine,
	type CommunityAnalysisConfig,
	DataSource,
	type InfluentialUser,
	type KeywordExtraction,
	type PlatformType,
	type SocialPost,
	type ToolMention,
	type TrendAnalysis,
	type TrendFactor,
	type TrendType,
} from "./types.js";

// トレンドスコア計算の重み
const TREND_WEIGHTS = {
	mention_growth: 0.4,
	engagement_growth: 0.3,
	sentiment_improvement: 0.15,
	influential_user_mentions: 0.15,
};

// AIツールカテゴリの重要度
const CATEGORY_IMPORTANCE = {
	code_completion: 0.9,
	code_generation: 1.0,
	code_review: 0.7,
	chat_assistant: 0.8,
	testing: 0.6,
	documentation: 0.5,
	deployment: 0.6,
	monitoring: 0.5,
	design: 0.4,
	data_analysis: 0.7,
};

/**
 * モックデータ生成クラス
 */
class MockDataGenerator {
	/**
	 * モックソーシャル投稿を生成
	 */
	generateMockPosts(toolName: string, count = 50): SocialPost[] {
		const posts: SocialPost[] = [];
		const platforms: PlatformType[] = [
			"twitter",
			"reddit",
			"hackernews",
			"qiita",
			"zenn",
		];
		const authors = [
			"developer123",
			"ai_enthusiast",
			"codingpro",
			"techguru",
			"開発者A",
			"プログラマー太郎",
		];

		const positiveTemplates = [
			`${toolName}を使ってみたが、想像以上に効率的だった！`,
			`${toolName}のおかげで開発時間が半分になった`,
			`${toolName}は本当に革新的なツールだと思う`,
			`${toolName} is amazing! Really helpful for coding`,
			`Just tried ${toolName} and I'm impressed`,
			`${toolName}を導入してチーム全体の生産性が向上`,
		];

		const negativeTemplates = [
			`${toolName}使ってみたけど、まだ不安定な気がする`,
			`${toolName}は期待したほどではなかった`,
			`${toolName} has some bugs that need fixing`,
			`${toolName}の日本語対応がもう少し良ければ...`,
			`${toolName}は良いけど、価格が高すぎる`,
		];

		const neutralTemplates = [
			`${toolName}の新機能についてドキュメントを読んでいる`,
			`${toolName}を設定中。使い方を覚えないと`,
			`${toolName}のチュートリアルをやってみる`,
			`Testing ${toolName} for our project`,
			`${toolName}の比較記事を書いている`,
		];

		for (let i = 0; i < count; i++) {
			const platform = platforms[Math.floor(Math.random() * platforms.length)];
			const author = authors[Math.floor(Math.random() * authors.length)];
			const sentimentType = Math.random();

			let content: string;
			if (sentimentType < 0.4) {
				content =
					positiveTemplates[
						Math.floor(Math.random() * positiveTemplates.length)
					];
			} else if (sentimentType < 0.6) {
				content =
					negativeTemplates[
						Math.floor(Math.random() * negativeTemplates.length)
					];
			} else {
				content =
					neutralTemplates[Math.floor(Math.random() * neutralTemplates.length)];
			}

			const engagement = {
				likes: Math.floor(Math.random() * 100) + 1,
				shares: Math.floor(Math.random() * 20),
				comments: Math.floor(Math.random() * 30),
				views: Math.floor(Math.random() * 1000) + 100,
			};

			posts.push({
				id: `mock-${platform}-${i}-${Date.now()}`,
				platform,
				author,
				authorDisplayName: author,
				content,
				createdAt: new Date(
					Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
				).toISOString(),
				engagement,
				url: `https://${platform}.com/post/${i}`,
				mentionedTools: [toolName],
				hashtags: [`#${toolName.replace(/\s/g, "")}`, "#AI", "#Programming"],
				language:
					content.includes("は") || content.includes("を") ? "ja" : "en",
			});
		}

		return posts.sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		);
	}

	/**
	 * 影響力のあるユーザーのモックデータ生成
	 */
	generateInfluentialUsers(): InfluentialUser[] {
		return [
			{
				username: "tech_pioneer_jp",
				displayName: "テック先駆者",
				platform: "twitter",
				followers: 25000,
				influenceScore: 0.95,
				expertise: ["code_generation", "chat_assistant"],
				recentMentions: ["ChatGPT", "GitHub Copilot"],
				engagementRate: 0.08,
			},
			{
				username: "ai_dev_expert",
				displayName: "AI Developer Expert",
				platform: "reddit",
				followers: 15000,
				influenceScore: 0.88,
				expertise: ["code_completion", "testing"],
				recentMentions: ["Cursor", "Tabnine"],
				engagementRate: 0.12,
			},
			{
				username: "coding_master_2024",
				displayName: "コーディングマスター",
				platform: "qiita",
				followers: 8000,
				influenceScore: 0.82,
				expertise: ["code_review", "documentation"],
				recentMentions: ["Claude", "CodeWhisperer"],
				engagementRate: 0.15,
			},
		];
	}
}

/**
 * トレンド分析エンジン
 */
export class TrendAnalysisEngine implements AnalysisEngine {
	name = "trend-analysis-engine";
	private mockDataGenerator: MockDataGenerator;
	private sentimentAnalyzer: SentimentAnalyzer;
	private config: CommunityAnalysisConfig | null = null;

	constructor() {
		this.mockDataGenerator = new MockDataGenerator();
		this.sentimentAnalyzer = sentimentAnalyzer;
	}

	async initialize(config: CommunityAnalysisConfig): Promise<void> {
		this.config = config;
		console.log("Trend Analysis Engine initialized");
	}

	/**
	 * AIツールのトレンド分析を実行
	 */
	async analyzeTrends(
		toolMentions: ToolMention[] = [],
	): Promise<TrendAnalysis[]> {
		if (!this.config) {
			throw new Error("Engine not initialized");
		}

		const analyses: TrendAnalysis[] = [];
		const targetTools =
			this.config.targetTools.length > 0
				? this.config.targetTools
				: ["ChatGPT", "GitHub Copilot", "Claude", "Cursor", "Tabnine"];

		for (const toolName of targetTools) {
			try {
				const analysis = await this.analyzeSingleToolTrend(
					toolName,
					toolMentions,
				);
				analyses.push(analysis);

				// レート制限対策
				await this.delay(200);
			} catch (error) {
				console.error(`Failed to analyze trend for ${toolName}:`, error);
			}
		}

		return analyses.sort((a, b) => b.trendScore - a.trendScore);
	}

	/**
	 * 単一ツールのトレンド分析
	 */
	private async analyzeSingleToolTrend(
		toolName: string,
		existingMentions: ToolMention[],
	): Promise<TrendAnalysis> {
		const endDate = new Date();
		const startDate = new Date(
			endDate.getTime() - this.config!.analysisPeriodDays * 24 * 60 * 60 * 1000,
		);

		// モックデータの生成（実際の実装ではAPI呼び出し）
		const posts = this.mockDataGenerator.generateMockPosts(toolName, 100);

		// 投稿を期間でフィルタリング
		const currentPeriodPosts = posts.filter(
			(post) =>
				new Date(post.createdAt) >= startDate &&
				new Date(post.createdAt) <= endDate,
		);

		// 前期間の投稿（比較用）
		const previousStartDate = new Date(
			startDate.getTime() -
				this.config!.analysisPeriodDays * 24 * 60 * 60 * 1000,
		);
		const previousPeriodPosts = posts.filter(
			(post) =>
				new Date(post.createdAt) >= previousStartDate &&
				new Date(post.createdAt) < startDate,
		);

		// メンション数とエンゲージメントの変化を計算
		const mentionGrowth = this.calculateMentionGrowth(
			currentPeriodPosts,
			previousPeriodPosts,
		);
		const engagementGrowth = this.calculateEngagementGrowth(
			currentPeriodPosts,
			previousPeriodPosts,
		);

		// センチメント分析
		const sentimentAnalyses =
			await this.sentimentAnalyzer.analyzeBatch(currentPeriodPosts);
		const sentimentStats =
			this.sentimentAnalyzer.calculateSentimentStats(sentimentAnalyses);

		// トレンド要因の分析
		const trendFactors = await this.analyzeTrendFactors(
			toolName,
			currentPeriodPosts,
		);

		// トレンドスコアの計算
		const trendScore = this.calculateTrendScore(
			mentionGrowth,
			engagementGrowth,
			sentimentStats,
			trendFactors,
		);

		// トレンドタイプの決定
		const trendType = this.determineTrendType(
			trendScore,
			mentionGrowth.growthRate,
		);

		// 予測
		const prediction = this.predictTrend(
			trendScore,
			mentionGrowth,
			engagementGrowth,
		);

		return {
			period: {
				start: startDate.toISOString(),
				end: endDate.toISOString(),
			},
			trendType,
			trendScore,
			mentionGrowth,
			engagementGrowth,
			factors: trendFactors,
			prediction,
		};
	}

	/**
	 * メンション数の成長を計算
	 */
	private calculateMentionGrowth(
		current: SocialPost[],
		previous: SocialPost[],
	): {
		current: number;
		previous: number;
		growthRate: number;
	} {
		const currentCount = current.length;
		const previousCount = previous.length;
		const growthRate =
			previousCount === 0 ? 1 : (currentCount - previousCount) / previousCount;

		return {
			current: currentCount,
			previous: previousCount,
			growthRate,
		};
	}

	/**
	 * エンゲージメントの成長を計算
	 */
	private calculateEngagementGrowth(
		current: SocialPost[],
		previous: SocialPost[],
	): {
		current: number;
		previous: number;
		growthRate: number;
	} {
		const currentEngagement = current.reduce(
			(sum, post) =>
				sum +
				post.engagement.likes +
				post.engagement.shares +
				post.engagement.comments,
			0,
		);

		const previousEngagement = previous.reduce(
			(sum, post) =>
				sum +
				post.engagement.likes +
				post.engagement.shares +
				post.engagement.comments,
			0,
		);

		const growthRate =
			previousEngagement === 0
				? 1
				: (currentEngagement - previousEngagement) / previousEngagement;

		return {
			current: currentEngagement,
			previous: previousEngagement,
			growthRate,
		};
	}

	/**
	 * トレンド要因を分析
	 */
	private async analyzeTrendFactors(
		toolName: string,
		posts: SocialPost[],
	): Promise<TrendFactor[]> {
		const factors: TrendFactor[] = [];

		// 製品アップデートや発表の検出
		const updateKeywords = [
			"新機能",
			"新バージョン",
			"update",
			"release",
			"発表",
			"リリース",
		];
		const updatePosts = posts.filter((post) =>
			updateKeywords.some((keyword) =>
				post.content.toLowerCase().includes(keyword.toLowerCase()),
			),
		);

		if (updatePosts.length > 0) {
			factors.push({
				type: "feature_update",
				description: `${toolName}の機能アップデートや新バージョンに関する話題が${updatePosts.length}件検出されました`,
				impact: Math.min(1.0, (updatePosts.length / posts.length) * 2),
				relatedPostIds: updatePosts.map((p) => p.id),
			});
		}

		// コミュニティイベントの検出
		const eventKeywords = [
			"カンファレンス",
			"ワークショップ",
			"勉強会",
			"conference",
			"workshop",
			"meetup",
		];
		const eventPosts = posts.filter((post) =>
			eventKeywords.some((keyword) =>
				post.content.toLowerCase().includes(keyword.toLowerCase()),
			),
		);

		if (eventPosts.length > 0) {
			factors.push({
				type: "community_event",
				description: `${toolName}に関連するコミュニティイベントの話題が${eventPosts.length}件検出されました`,
				impact: Math.min(0.8, (eventPosts.length / posts.length) * 1.5),
				relatedPostIds: eventPosts.map((p) => p.id),
			});
		}

		// 論争や問題の検出
		const controversyKeywords = [
			"問題",
			"バグ",
			"批判",
			"不満",
			"issue",
			"bug",
			"problem",
			"controversy",
		];
		const controversyPosts = posts.filter((post) =>
			controversyKeywords.some((keyword) =>
				post.content.toLowerCase().includes(keyword.toLowerCase()),
			),
		);

		if (controversyPosts.length > posts.length * 0.3) {
			factors.push({
				type: "controversy",
				description: `${toolName}に関する問題や批判的な投稿が${controversyPosts.length}件検出されました`,
				impact: Math.min(0.9, (controversyPosts.length / posts.length) * 1.2),
				relatedPostIds: controversyPosts.slice(0, 10).map((p) => p.id),
			});
		}

		return factors;
	}

	/**
	 * トレンドスコアを計算
	 */
	private calculateTrendScore(
		mentionGrowth: { growthRate: number },
		engagementGrowth: { growthRate: number },
		sentimentStats: { dominantSentiment: any; averageConfidence: number },
		factors: TrendFactor[],
	): number {
		let score = 0;

		// メンション増加率の寄与
		score += Math.tanh(mentionGrowth.growthRate) * TREND_WEIGHTS.mention_growth;

		// エンゲージメント増加率の寄与
		score +=
			Math.tanh(engagementGrowth.growthRate) * TREND_WEIGHTS.engagement_growth;

		// センチメント改善の寄与
		const sentimentScore =
			sentimentStats.dominantSentiment === "positive"
				? 0.5
				: sentimentStats.dominantSentiment === "negative"
					? -0.3
					: 0;
		score +=
			sentimentScore *
			sentimentStats.averageConfidence *
			TREND_WEIGHTS.sentiment_improvement;

		// トレンド要因の寄与
		const factorImpact =
			factors.reduce((sum, factor) => sum + factor.impact, 0) /
				factors.length || 0;
		score += factorImpact * TREND_WEIGHTS.influential_user_mentions;

		// -1 から 1 の範囲にクランプ
		return Math.max(-1, Math.min(1, score));
	}

	/**
	 * トレンドタイプを決定
	 */
	private determineTrendType(
		trendScore: number,
		mentionGrowthRate: number,
	): TrendType {
		if (trendScore > 0.5 || mentionGrowthRate > 1.0) {
			return "viral";
		} else if (trendScore > 0.2 || mentionGrowthRate > 0.3) {
			return "rising";
		} else if (trendScore < -0.3 || mentionGrowthRate < -0.3) {
			return "declining";
		} else if (
			Math.abs(trendScore) < 0.1 &&
			Math.abs(mentionGrowthRate) < 0.1
		) {
			return "stable";
		} else {
			return "emerging";
		}
	}

	/**
	 * トレンドを予測
	 */
	private predictTrend(
		currentScore: number,
		mentionGrowth: { growthRate: number },
		engagementGrowth: { growthRate: number },
	): { nextWeek: TrendType; confidence: number } {
		// シンプルな線形予測モデル
		const momentum =
			(mentionGrowth.growthRate + engagementGrowth.growthRate) / 2;
		const predictedScore = currentScore + momentum * 0.3;

		const nextWeekTrend = this.determineTrendType(predictedScore, momentum);

		// 予測の信頼度（現在のデータの一貫性に基づく）
		const consistency =
			1 - Math.abs(mentionGrowth.growthRate - engagementGrowth.growthRate);
		const confidence = Math.max(0.1, Math.min(0.9, consistency * 0.7));

		return {
			nextWeek: nextWeekTrend,
			confidence,
		};
	}

	async analyzeSentiment(text: string): Promise<any> {
		// センチメント分析は別のエンジンに委譲
		return await this.sentimentAnalyzer.analyzePost({
			id: "temp",
			platform: "twitter",
			author: "temp",
			content: text,
			createdAt: new Date().toISOString(),
			engagement: { likes: 0, shares: 0, comments: 0 },
			url: "",
			mentionedTools: [],
			hashtags: [],
			language: "mixed",
		});
	}

	async getStatus(): Promise<{ healthy: boolean; lastCheck: string }> {
		return {
			healthy: this.config !== null,
			lastCheck: new Date().toISOString(),
		};
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

/**
 * キーワード抽出エンジン
 */
export class KeywordExtractor {
	/**
	 * 投稿からキーワードを抽出
	 */
	extractKeywords(posts: SocialPost[], maxKeywords = 20): KeywordExtraction {
		const allText = posts.map((p) => p.content).join(" ");
		const words = this.tokenize(allText);
		const frequencies = this.calculateFrequencies(words);
		const filtered = this.filterRelevantKeywords(frequencies);

		const topKeywords = Object.entries(filtered)
			.sort(([, a], [, b]) => b - a)
			.slice(0, maxKeywords)
			.map(([word]) => word);

		const scores: Record<string, number> = {};
		topKeywords.forEach((keyword) => {
			scores[keyword] =
				filtered[keyword] / Math.max(...Object.values(filtered));
		});

		return {
			keywords: topKeywords,
			scores,
			context: allText.substring(0, 200) + "...",
			engine: "simple-frequency",
		};
	}

	private tokenize(text: string): string[] {
		return text
			.toLowerCase()
			.replace(/[^\w\sあ-ん一-龯]/g, " ")
			.split(/\s+/)
			.filter((word) => word.length > 2);
	}

	private calculateFrequencies(words: string[]): Record<string, number> {
		const frequencies: Record<string, number> = {};
		words.forEach((word) => {
			frequencies[word] = (frequencies[word] || 0) + 1;
		});
		return frequencies;
	}

	private filterRelevantKeywords(
		frequencies: Record<string, number>,
	): Record<string, number> {
		const stopWords = new Set([
			"the",
			"is",
			"at",
			"which",
			"on",
			"and",
			"to",
			"for",
			"with",
			"by",
			"が",
			"は",
			"の",
			"に",
			"を",
			"で",
			"と",
			"から",
			"まで",
			"する",
			"です",
			"ます",
		]);

		const filtered: Record<string, number> = {};
		Object.entries(frequencies).forEach(([word, freq]) => {
			if (!stopWords.has(word) && freq >= 2) {
				filtered[word] = freq;
			}
		});

		return filtered;
	}
}

/**
 * コミュニティ分析のメインクラス
 */
export class CommunityAnalyzer {
	private trendEngine: TrendAnalysisEngine;
	private keywordExtractor: KeywordExtractor;
	private config: CommunityAnalysisConfig | null = null;

	constructor() {
		this.trendEngine = new TrendAnalysisEngine();
		this.keywordExtractor = new KeywordExtractor();
	}

	/**
	 * 設定を読み込み
	 */
	async loadConfig(configPath?: string): Promise<void> {
		try {
			const sourcesPath = configPath || path.join(__dirname, "sources.yaml");
			const sourcesData = readFileSync(sourcesPath, "utf8");
			const sources = load(sourcesData) as any;

			// 設定オブジェクトを構築
			this.config = {
				platforms: ["twitter", "reddit", "hackernews", "qiita", "zenn"],
				targetTools: sources.target_ai_tools?.code_generation || [
					"ChatGPT",
					"GitHub Copilot",
					"Claude",
				],
				analysisPeriodDays: sources.analysis_config?.collection_interval || 7,
				collectionIntervalMinutes:
					sources.analysis_config?.analysis_interval || 60,
				enableSentimentAnalysis:
					sources.analysis_config?.sentiment_analysis?.enabled || true,
				enableTrendAnalysis:
					sources.analysis_config?.trend_analysis?.enabled || true,
				japaneseOnly: sources.analysis_config?.languages?.primary === "ja",
				minEngagement: 5,
				apiConfigs: sources.api_configs || {},
			};

			await this.trendEngine.initialize(this.config);
		} catch (error) {
			console.error("Failed to load config:", error);
			throw error;
		}
	}

	/**
	 * 完全なトレンド分析を実行
	 */
	async performAnalysis(): Promise<{
		trends: TrendAnalysis[];
		keywords: KeywordExtraction;
		summary: {
			totalTools: number;
			risingTrends: number;
			decliningTrends: number;
			stableTrends: number;
		};
	}> {
		if (!this.config) {
			throw new Error("Configuration not loaded. Call loadConfig() first.");
		}

		console.log("Starting community analysis...");

		// トレンド分析実行
		const trends = await this.trendEngine.analyzeTrends();

		// サンプル投稿でキーワード抽出（実際の実装では実データを使用）
		const mockPosts =
			trends.length > 0
				? new MockDataGenerator().generateMockPosts("AI Tools", 50)
				: [];

		const keywords = this.keywordExtractor.extractKeywords(mockPosts);

		// サマリー統計
		const summary = {
			totalTools: trends.length,
			risingTrends: trends.filter(
				(t) => t.trendType === "rising" || t.trendType === "viral",
			).length,
			decliningTrends: trends.filter((t) => t.trendType === "declining").length,
			stableTrends: trends.filter((t) => t.trendType === "stable").length,
		};

		console.log(`Analysis completed. Analyzed ${summary.totalTools} tools.`);

		return {
			trends,
			keywords,
			summary,
		};
	}

	/**
	 * 設定情報を取得
	 */
	getConfig(): CommunityAnalysisConfig | null {
		return this.config;
	}
}

// デフォルトインスタンスをエクスポート
export const communityAnalyzer = new CommunityAnalyzer();

// 便利な関数をエクスポート
export async function analyzeAIToolTrends(configPath?: string): Promise<any> {
	await communityAnalyzer.loadConfig(configPath);
	return await communityAnalyzer.performAnalysis();
}
