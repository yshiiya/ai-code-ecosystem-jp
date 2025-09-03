/**
 * AI Code Ecosystem Japan - Community Insights Agent Types
 * コミュニティ分析エージェント関連の型定義
 */

// SNSプラットフォームの種類
export type PlatformType =
	| "twitter"
	| "reddit"
	| "hackernews"
	| "qiita"
	| "zenn"
	| "github";

// AIツールカテゴリ
export type AIToolCategory =
	| "code_completion"
	| "code_generation"
	| "code_review"
	| "chat_assistant"
	| "testing"
	| "documentation"
	| "deployment"
	| "monitoring"
	| "design"
	| "data_analysis";

// センチメントの種類
export type SentimentType = "positive" | "negative" | "neutral" | "mixed";

// トレンドの種類
export type TrendType =
	| "rising"
	| "declining"
	| "stable"
	| "viral"
	| "emerging";

// 言語設定
export type LanguageType = "ja" | "en" | "mixed";

// ソーシャルメディアの投稿データ
export interface SocialPost {
	/** 投稿の一意ID */
	id: string;
	/** プラットフォーム */
	platform: PlatformType;
	/** 投稿者のユーザー名/ID */
	author: string;
	/** 投稿者の表示名 */
	authorDisplayName?: string;
	/** 投稿内容 */
	content: string;
	/** 投稿日時 */
	createdAt: string;
	/** エンゲージメント数（いいね、RT、コメント等） */
	engagement: {
		likes: number;
		shares: number;
		comments: number;
		views?: number;
	};
	/** 投稿のURL */
	url: string;
	/** メンションされているAIツール */
	mentionedTools: string[];
	/** 検出されたハッシュタグ */
	hashtags: string[];
	/** 投稿の言語 */
	language: LanguageType;
	/** 添付されたメディア情報 */
	media?: MediaInfo[];
}

// メディア情報
export interface MediaInfo {
	/** メディアタイプ */
	type: "image" | "video" | "gif" | "link";
	/** メディアのURL */
	url: string;
	/** タイトル（リンクの場合） */
	title?: string;
	/** 説明文 */
	description?: string;
}

// センチメント分析結果
export interface SentimentAnalysis {
	/** 投稿ID */
	postId: string;
	/** センチメントの種類 */
	sentiment: SentimentType;
	/** センチメントの信頼度スコア（0-1） */
	confidence: number;
	/** 詳細なスコア */
	scores: {
		positive: number;
		negative: number;
		neutral: number;
	};
	/** 感情の詳細分析 */
	emotions?: {
		joy: number;
		anger: number;
		fear: number;
		surprise: number;
		sadness: number;
	};
	/** 分析対象のテキスト */
	analyzedText: string;
	/** 分析エンジン */
	engine: "openai" | "azure_cognitive" | "mock";
	/** 分析日時 */
	analyzedAt: string;
}

// AIツールの言及情報
export interface ToolMention {
	/** ツール名 */
	toolName: string;
	/** ツールのカテゴリ */
	category: AIToolCategory;
	/** 言及回数 */
	mentionCount: number;
	/** 言及している投稿のID一覧 */
	postIds: string[];
	/** 全体のセンチメント */
	overallSentiment: SentimentType;
	/** センチメント分布 */
	sentimentDistribution: {
		positive: number;
		negative: number;
		neutral: number;
		mixed: number;
	};
	/** 最初の言及日 */
	firstMentionDate: string;
	/** 最新の言及日 */
	lastMentionDate: string;
	/** エンゲージメント合計 */
	totalEngagement: number;
	/** 公式アカウントからの言及があるか */
	hasOfficialMention: boolean;
}

// トレンド分析結果
export interface TrendAnalysis {
	/** 分析対象期間 */
	period: {
		start: string;
		end: string;
	};
	/** トレンドの種類 */
	trendType: TrendType;
	/** トレンドスコア（-1から1） */
	trendScore: number;
	/** 言及数の変化 */
	mentionGrowth: {
		current: number;
		previous: number;
		growthRate: number;
	};
	/** エンゲージメントの変化 */
	engagementGrowth: {
		current: number;
		previous: number;
		growthRate: number;
	};
	/** トレンドの要因 */
	factors: TrendFactor[];
	/** 予測される今後のトレンド */
	prediction?: {
		nextWeek: TrendType;
		confidence: number;
	};
}

// トレンド要因
export interface TrendFactor {
	/** 要因の種類 */
	type:
		| "product_launch"
		| "feature_update"
		| "controversy"
		| "partnership"
		| "community_event";
	/** 要因の説明 */
	description: string;
	/** 影響度（0-1） */
	impact: number;
	/** 関連する投稿ID */
	relatedPostIds: string[];
}

// コミュニティ分析設定
export interface CommunityAnalysisConfig {
	/** 監視対象のプラットフォーム */
	platforms: PlatformType[];
	/** 監視対象のAIツール */
	targetTools: string[];
	/** 分析期間（日数） */
	analysisPeriodDays: number;
	/** データ収集の頻度（分） */
	collectionIntervalMinutes: number;
	/** センチメント分析を実行するか */
	enableSentimentAnalysis: boolean;
	/** トレンド分析を実行するか */
	enableTrendAnalysis: boolean;
	/** 日本語コンテンツのみ分析するか */
	japaneseOnly: boolean;
	/** 最小エンゲージメント数 */
	minEngagement: number;
	/** API設定 */
	apiConfigs: Record<PlatformType, PlatformAPIConfig>;
}

// プラットフォームAPI設定
export interface PlatformAPIConfig {
	/** API キー */
	apiKey?: string;
	/** API シークレット */
	apiSecret?: string;
	/** アクセストークン */
	accessToken?: string;
	/** トークンシークレット */
	tokenSecret?: string;
	/** レート制限（リクエスト/分） */
	rateLimit: number;
	/** リクエスト間隔（ms） */
	requestInterval: number;
	/** タイムアウト（ms） */
	timeout: number;
	/** モック実装を使用するか */
	useMock?: boolean;
}

// 週次レポート
export interface WeeklyReport {
	/** レポート生成日 */
	generatedAt: string;
	/** 対象期間 */
	period: {
		start: string;
		end: string;
	};
	/** エグゼクティブサマリー */
	summary: {
		/** 総投稿数 */
		totalPosts: number;
		/** 総エンゲージメント */
		totalEngagement: number;
		/** トップ3のトレンドツール */
		topTrendingTools: ToolMention[];
		/** 主要なインサイト */
		keyInsights: string[];
	};
	/** プラットフォーム別統計 */
	platformStats: Record<PlatformType, PlatformStats>;
	/** ツール別分析 */
	toolAnalysis: ToolMention[];
	/** トレンド分析 */
	trendAnalysis: TrendAnalysis[];
	/** センチメント分析サマリー */
	sentimentSummary: {
		overall: SentimentType;
		distribution: Record<SentimentType, number>;
		topPositiveTools: string[];
		topNegativeTools: string[];
	};
	/** 注目すべき投稿 */
	notablePosts: SocialPost[];
	/** レポートの信頼度 */
	confidence: number;
}

// プラットフォーム統計
export interface PlatformStats {
	/** 投稿数 */
	postCount: number;
	/** 総エンゲージメント */
	totalEngagement: number;
	/** アクティブユーザー数 */
	activeUsers: number;
	/** 平均エンゲージメント率 */
	avgEngagementRate: number;
	/** トップハッシュタグ */
	topHashtags: string[];
	/** 言語分布 */
	languageDistribution: Record<LanguageType, number>;
}

// データソース設定
export interface DataSource {
	/** ソース名 */
	name: string;
	/** プラットフォーム */
	platform: PlatformType;
	/** 検索クエリまたはキーワード */
	query: string[];
	/** 監視するアカウント */
	accounts?: string[];
	/** ハッシュタグ */
	hashtags?: string[];
	/** 除外キーワード */
	excludeKeywords?: string[];
	/** アクティブかどうか */
	active: boolean;
	/** データ収集の優先度（1-10） */
	priority: number;
}

// バッチ処理結果
export interface BatchProcessResult {
	/** 処理開始時間 */
	startTime: string;
	/** 処理終了時間 */
	endTime: string;
	/** 処理時間（ms） */
	duration: number;
	/** 処理した投稿数 */
	processedPosts: number;
	/** 成功した分析数 */
	successfulAnalyses: number;
	/** 失敗した分析数 */
	failedAnalyses: number;
	/** エラー情報 */
	errors: string[];
	/** 生成されたレポート */
	generatedReports: string[];
}

// 分析エンジンのインターフェース
export interface AnalysisEngine {
	/** エンジン名 */
	name: string;
	/** 初期化 */
	initialize(config: any): Promise<void>;
	/** センチメント分析を実行 */
	analyzeSentiment(text: string): Promise<SentimentAnalysis>;
	/** トレンド分析を実行 */
	analyzeTrends(mentions: ToolMention[]): Promise<TrendAnalysis[]>;
	/** エンジンの状態を取得 */
	getStatus(): Promise<{ healthy: boolean; lastCheck: string }>;
}

// キーワード抽出結果
export interface KeywordExtraction {
	/** 抽出されたキーワード */
	keywords: string[];
	/** キーワードの重要度スコア */
	scores: Record<string, number>;
	/** コンテキスト情報 */
	context: string;
	/** 抽出エンジン */
	engine: string;
}

// 影響力のあるユーザー
export interface InfluentialUser {
	/** ユーザー名 */
	username: string;
	/** 表示名 */
	displayName: string;
	/** プラットフォーム */
	platform: PlatformType;
	/** フォロワー数 */
	followers: number;
	/** 影響力スコア */
	influenceScore: number;
	/** 専門分野 */
	expertise: AIToolCategory[];
	/** 最近の言及ツール */
	recentMentions: string[];
	/** エンゲージメント率 */
	engagementRate: number;
}

// コンテンツ分類結果
export interface ContentClassification {
	/** 投稿ID */
	postId: string;
	/** メインカテゴリ */
	primaryCategory: AIToolCategory;
	/** サブカテゴリ */
	secondaryCategories: AIToolCategory[];
	/** 信頼度スコア */
	confidence: number;
	/** 検出されたトピック */
	topics: string[];
	/** 感情の強度 */
	emotionalIntensity: number;
}

// 全ての型をエクスポート（interfaceとして定義されているものは自動的にエクスポート）
