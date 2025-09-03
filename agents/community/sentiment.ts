/**
 * AI Code Ecosystem Japan - Sentiment Analysis Agent
 * センチメント分析エージェント
 */

import type {
	AnalysisEngine,
	PlatformAPIConfig,
	SentimentAnalysis,
	SentimentType,
	SocialPost,
} from "./types.js";

// センチメント分析の重み付け設定
const SENTIMENT_WEIGHTS = {
	positive: {
		keywords: [
			"素晴らしい",
			"便利",
			"効率的",
			"すごい",
			"感動",
			"革新的",
			"おすすめ",
			"最高",
			"amazing",
			"great",
			"fantastic",
			"excellent",
			"helpful",
			"efficient",
		],
		weight: 1.2,
	},
	negative: {
		keywords: [
			"問題",
			"バグ",
			"不具合",
			"使いにくい",
			"最悪",
			"ひどい",
			"残念",
			"失望",
			"terrible",
			"awful",
			"horrible",
			"useless",
			"broken",
			"disappointing",
		],
		weight: 1.3,
	},
	neutral: {
		keywords: [
			"機能",
			"使用",
			"実装",
			"開発",
			"設定",
			"testing",
			"using",
			"implementing",
			"trying",
		],
		weight: 1.0,
	},
};

// 日本語感情表現の辞書
const JAPANESE_SENTIMENT_PATTERNS = {
	positive: [
		/すごく?良い/g,
		/めちゃくちゃ便利/g,
		/超効率的/g,
		/最高に使いやすい/g,
		/感動的/g,
		/革命的/g,
		/(いい|良い)感じ/g,
		/助かる/g,
		/おかげで/g,
	],
	negative: [
		/使いづらい/g,
		/不便/g,
		/イライラ/g,
		/ストレス/g,
		/期待外れ/g,
		/ガッカリ/g,
		/困って(いる|る)/g,
		/エラーが多い/g,
		/動かない/g,
	],
};

/**
 * モックセンチメント分析エンジン
 */
class MockSentimentEngine implements AnalysisEngine {
	name = "mock-sentiment-engine";

	async initialize(config: any): Promise<void> {
		console.log("Mock Sentiment Engine initialized");
	}

	/**
	 * テキストのセンチメントを分析
	 */
	async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
		// 基本スコア計算
		const scores = this.calculateBasicSentiment(text);

		// 日本語パターンマッチング
		const japaneseBoost = this.analyzeJapanesePatterns(text);

		// 最終スコア計算
		const finalScores = {
			positive: Math.min(1.0, scores.positive + japaneseBoost.positive),
			negative: Math.min(1.0, scores.negative + japaneseBoost.negative),
			neutral: Math.max(
				0.0,
				1.0 -
					(scores.positive +
						japaneseBoost.positive +
						scores.negative +
						japaneseBoost.negative),
			),
		};

		// 主要センチメント決定
		const sentiment = this.determinePrimarySentiment(finalScores);

		// 信頼度計算
		const confidence = this.calculateConfidence(finalScores, text);

		return {
			postId: "",
			sentiment,
			confidence,
			scores: finalScores,
			emotions: this.analyzeEmotions(text),
			analyzedText: text,
			engine: "mock",
			analyzedAt: new Date().toISOString(),
		};
	}

	/**
	 * 基本的なキーワードベースのセンチメント分析
	 */
	private calculateBasicSentiment(text: string): {
		positive: number;
		negative: number;
		neutral: number;
	} {
		const lowerText = text.toLowerCase();
		let positiveScore = 0;
		let negativeScore = 0;
		let neutralScore = 0;

		// ポジティブキーワードチェック
		SENTIMENT_WEIGHTS.positive.keywords.forEach((keyword) => {
			const matches = (lowerText.match(new RegExp(keyword, "g")) || []).length;
			positiveScore += matches * SENTIMENT_WEIGHTS.positive.weight;
		});

		// ネガティブキーワードチェック
		SENTIMENT_WEIGHTS.negative.keywords.forEach((keyword) => {
			const matches = (lowerText.match(new RegExp(keyword, "g")) || []).length;
			negativeScore += matches * SENTIMENT_WEIGHTS.negative.weight;
		});

		// ニュートラルキーワードチェック
		SENTIMENT_WEIGHTS.neutral.keywords.forEach((keyword) => {
			const matches = (lowerText.match(new RegExp(keyword, "g")) || []).length;
			neutralScore += matches * SENTIMENT_WEIGHTS.neutral.weight;
		});

		// 正規化
		const total = positiveScore + negativeScore + neutralScore || 1;
		return {
			positive: positiveScore / total,
			negative: negativeScore / total,
			neutral: neutralScore / total,
		};
	}

	/**
	 * 日本語特有の感情表現を分析
	 */
	private analyzeJapanesePatterns(text: string): {
		positive: number;
		negative: number;
	} {
		let positiveBoost = 0;
		let negativeBoost = 0;

		// ポジティブパターン
		JAPANESE_SENTIMENT_PATTERNS.positive.forEach((pattern) => {
			const matches = (text.match(pattern) || []).length;
			positiveBoost += matches * 0.2;
		});

		// ネガティブパターン
		JAPANESE_SENTIMENT_PATTERNS.negative.forEach((pattern) => {
			const matches = (text.match(pattern) || []).length;
			negativeBoost += matches * 0.2;
		});

		return { positive: positiveBoost, negative: negativeBoost };
	}

	/**
	 * 主要センチメントを決定
	 */
	private determinePrimarySentiment(scores: {
		positive: number;
		negative: number;
		neutral: number;
	}): SentimentType {
		const threshold = 0.1;

		if (
			scores.positive > scores.negative + threshold &&
			scores.positive > scores.neutral + threshold
		) {
			return "positive";
		} else if (
			scores.negative > scores.positive + threshold &&
			scores.negative > scores.neutral + threshold
		) {
			return "negative";
		} else if (
			Math.abs(scores.positive - scores.negative) < threshold &&
			Math.max(scores.positive, scores.negative) > scores.neutral
		) {
			return "mixed";
		} else {
			return "neutral";
		}
	}

	/**
	 * 感情の詳細分析
	 */
	private analyzeEmotions(text: string): {
		joy: number;
		anger: number;
		fear: number;
		surprise: number;
		sadness: number;
	} {
		const emotionKeywords = {
			joy: ["嬉しい", "楽しい", "幸せ", "happy", "joy", "excited", "pleased"],
			anger: ["怒り", "腹立つ", "イライラ", "angry", "frustrated", "annoyed"],
			fear: ["不安", "心配", "怖い", "worried", "concerned", "afraid"],
			surprise: [
				"驚き",
				"びっくり",
				"まさか",
				"surprised",
				"shocked",
				"unexpected",
			],
			sadness: ["悲しい", "残念", "がっかり", "sad", "disappointed", "upset"],
		};

		const emotions: any = {};

		Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
			let score = 0;
			keywords.forEach((keyword) => {
				const matches = (
					text.toLowerCase().match(new RegExp(keyword, "g")) || []
				).length;
				score += matches;
			});
			emotions[emotion] = Math.min(1.0, score * 0.3);
		});

		return emotions;
	}

	/**
	 * 信頼度を計算
	 */
	private calculateConfidence(
		scores: { positive: number; negative: number; neutral: number },
		text: string,
	): number {
		// テキストの長さによる信頼度調整
		const lengthFactor = Math.min(1.0, text.length / 100);

		// スコアの差による信頼度
		const maxScore = Math.max(scores.positive, scores.negative, scores.neutral);
		const scoreDifference =
			maxScore - Math.min(scores.positive, scores.negative, scores.neutral);

		// 基本信頼度
		const baseConfidence = scoreDifference * 0.7 + lengthFactor * 0.3;

		return Math.max(0.1, Math.min(1.0, baseConfidence));
	}

	async analyzeTrends(): Promise<any[]> {
		throw new Error("Trend analysis not implemented in sentiment engine");
	}

	async getStatus(): Promise<{ healthy: boolean; lastCheck: string }> {
		return {
			healthy: true,
			lastCheck: new Date().toISOString(),
		};
	}
}

/**
 * OpenAI GPTを使用したセンチメント分析エンジン（モック実装）
 */
class OpenAISentimentEngine implements AnalysisEngine {
	name = "openai-sentiment-engine";
	private apiConfig: PlatformAPIConfig | null = null;

	async initialize(config: PlatformAPIConfig): Promise<void> {
		this.apiConfig = config;
		console.log("OpenAI Sentiment Engine initialized (mock mode)");
	}

	async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
		// 実際の実装では、OpenAI APIを呼び出してセンチメント分析を実行
		// ここではモック実装として、より精密な分析をシミュレート

		await this.delay(500); // API呼び出しの遅延をシミュレート

		const prompt = this.buildSentimentPrompt(text);
		const mockResponse = this.simulateOpenAIResponse(text);

		return {
			postId: "",
			sentiment: mockResponse.sentiment,
			confidence: mockResponse.confidence,
			scores: mockResponse.scores,
			emotions: mockResponse.emotions,
			analyzedText: text,
			engine: "openai",
			analyzedAt: new Date().toISOString(),
		};
	}

	private buildSentimentPrompt(text: string): string {
		return `
Please analyze the sentiment of the following text about AI development tools:

Text: "${text}"

Please provide:
1. Overall sentiment (positive/negative/neutral/mixed)
2. Confidence score (0-1)
3. Detailed scores for positive, negative, neutral
4. Emotional analysis (joy, anger, fear, surprise, sadness)

Focus on opinions about AI coding tools, programming assistants, and development workflow.
    `;
	}

	private simulateOpenAIResponse(text: string): {
		sentiment: SentimentType;
		confidence: number;
		scores: { positive: number; negative: number; neutral: number };
		emotions: {
			joy: number;
			anger: number;
			fear: number;
			surprise: number;
			sadness: number;
		};
	} {
		// より精密なモック分析
		const mockEngine = new MockSentimentEngine();

		// 基本分析の結果を取得
		const basicAnalysis = mockEngine.analyzeSentiment(text);

		// OpenAI風の精密さを加える（実際の実装では実際のAPI呼び出し）
		const enhancedConfidence = Math.min(
			1.0,
			(basicAnalysis as any).confidence * 1.2,
		);

		return {
			sentiment: (basicAnalysis as any).sentiment,
			confidence: enhancedConfidence,
			scores: (basicAnalysis as any).scores,
			emotions: (basicAnalysis as any).emotions,
		};
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async analyzeTrends(): Promise<any[]> {
		throw new Error("Trend analysis not implemented in sentiment engine");
	}

	async getStatus(): Promise<{ healthy: boolean; lastCheck: string }> {
		return {
			healthy: this.apiConfig !== null,
			lastCheck: new Date().toISOString(),
		};
	}
}

/**
 * センチメント分析マネージャー
 */
export class SentimentAnalyzer {
	private engines: Map<string, AnalysisEngine> = new Map();
	private defaultEngine = "mock";

	constructor() {
		this.engines.set("mock", new MockSentimentEngine());
		this.engines.set("openai", new OpenAISentimentEngine());
	}

	/**
	 * エンジンを初期化
	 */
	async initializeEngine(
		engineName: string,
		config: PlatformAPIConfig,
	): Promise<void> {
		const engine = this.engines.get(engineName);
		if (!engine) {
			throw new Error(`Unknown sentiment engine: ${engineName}`);
		}
		await engine.initialize(config);
	}

	/**
	 * 単一投稿のセンチメント分析
	 */
	async analyzePost(
		post: SocialPost,
		engineName?: string,
	): Promise<SentimentAnalysis> {
		const engine = this.engines.get(engineName || this.defaultEngine);
		if (!engine) {
			throw new Error(`Engine not found: ${engineName || this.defaultEngine}`);
		}

		const result = await engine.analyzeSentiment(post.content);
		result.postId = post.id;
		return result;
	}

	/**
	 * 複数投稿の一括センチメント分析
	 */
	async analyzeBatch(
		posts: SocialPost[],
		engineName?: string,
	): Promise<SentimentAnalysis[]> {
		const results: SentimentAnalysis[] = [];
		const engine = this.engines.get(engineName || this.defaultEngine);

		if (!engine) {
			throw new Error(`Engine not found: ${engineName || this.defaultEngine}`);
		}

		for (const post of posts) {
			try {
				const result = await engine.analyzeSentiment(post.content);
				result.postId = post.id;
				results.push(result);

				// レート制限対策
				await this.delay(100);
			} catch (error) {
				console.error(`Failed to analyze post ${post.id}:`, error);
				// エラーの場合はニュートラルなセンチメントを返す
				results.push({
					postId: post.id,
					sentiment: "neutral",
					confidence: 0.1,
					scores: { positive: 0.33, negative: 0.33, neutral: 0.34 },
					analyzedText: post.content,
					engine: (engineName || this.defaultEngine) as
						| "openai"
						| "azure_cognitive"
						| "mock",
					analyzedAt: new Date().toISOString(),
				});
			}
		}

		return results;
	}

	/**
	 * センチメント分析結果の統計を計算
	 */
	calculateSentimentStats(analyses: SentimentAnalysis[]): {
		distribution: Record<SentimentType, number>;
		averageConfidence: number;
		totalAnalyses: number;
		dominantSentiment: SentimentType;
	} {
		const distribution: Record<SentimentType, number> = {
			positive: 0,
			negative: 0,
			neutral: 0,
			mixed: 0,
		};

		let totalConfidence = 0;

		analyses.forEach((analysis) => {
			distribution[analysis.sentiment]++;
			totalConfidence += analysis.confidence;
		});

		const totalAnalyses = analyses.length;
		const averageConfidence =
			totalAnalyses > 0 ? totalConfidence / totalAnalyses : 0;

		// 最も多いセンチメントを取得
		const dominantSentiment = Object.entries(distribution).reduce((a, b) =>
			distribution[a[0] as SentimentType] > distribution[b[0] as SentimentType]
				? a
				: b,
		)[0] as SentimentType;

		return {
			distribution,
			averageConfidence,
			totalAnalyses,
			dominantSentiment,
		};
	}

	/**
	 * エンジンの状態を取得
	 */
	async getEngineStatus(
		engineName: string,
	): Promise<{ healthy: boolean; lastCheck: string }> {
		const engine = this.engines.get(engineName);
		if (!engine) {
			return { healthy: false, lastCheck: "never" };
		}
		return await engine.getStatus();
	}

	/**
	 * 利用可能なエンジンのリストを取得
	 */
	getAvailableEngines(): string[] {
		return Array.from(this.engines.keys());
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

// デフォルトインスタンスをエクスポート
export const sentimentAnalyzer = new SentimentAnalyzer();

// 便利な関数をエクスポート
export async function analyzeSentiment(
	text: string,
	engine?: string,
): Promise<SentimentAnalysis> {
	const mockPost: SocialPost = {
		id: "temp-" + Date.now(),
		platform: "twitter",
		author: "temp",
		content: text,
		createdAt: new Date().toISOString(),
		engagement: { likes: 0, shares: 0, comments: 0 },
		url: "",
		mentionedTools: [],
		hashtags: [],
		language: "mixed",
	};

	return await sentimentAnalyzer.analyzePost(mockPost, engine);
}
