/**
 * AI Code Ecosystem Japan - Translation Agent Types
 * 翻訳エージェント関連の型定義
 */

// 基本的な翻訳オプション
export interface TranslationOptions {
	/** コードブロックを保護するか */
	preserveCodeBlocks: boolean;
	/** URLを保護するか */
	preserveUrls: boolean;
	/** Markdownの構造を保持するか */
	preserveMarkdownStructure: boolean;
	/** 用語集を使用するか */
	useGlossary: boolean;
	/** 翻訳のトーン */
	targetTone: "formal" | "casual" | "technical";
	/** 翻訳エンジン */
	translationEngine?: "openai" | "deepl" | "google" | "mock";
	/** API設定 */
	apiConfig?: TranslationAPIConfig;
}

// 翻訳API設定
export interface TranslationAPIConfig {
	/** APIキー */
	apiKey?: string;
	/** モデル名（OpenAI用） */
	model?: string;
	/** リクエスト当たりの最大トークン数 */
	maxTokens?: number;
	/** レスポンス温度（創造性パラメータ） */
	temperature?: number;
	/** リクエスト間隔（ms） */
	requestInterval?: number;
}

// 翻訳結果
export interface TranslationResult {
	/** 元のテキスト */
	originalText: string;
	/** 翻訳されたテキスト */
	translatedText: string;
	/** 用語集でマッチした用語 */
	glossaryMatches: string[];
	/** 翻訳の信頼度（0-1） */
	confidence: number;
	/** 処理時刻のタイムスタンプ */
	timestamp: string;
	/** 使用された翻訳エンジン */
	engine?: string;
	/** 処理時間（ms） */
	processingTime?: number;
	/** エラー情報 */
	error?: string;
}

// 用語集の構造
export interface Glossary {
	/** AI/ML分野の用語 */
	ai_terms: Record<string, string>;
	/** 開発ツール・フレームワーク */
	dev_tools: Record<string, string>;
	/** プログラミング言語 */
	languages: Record<string, string>;
	/** UI/UX用語 */
	ui_ux: Record<string, string>;
	/** ビジネス・戦略用語 */
	business: Record<string, string>;
	/** 英語のまま保持する固有名詞 */
	keep_english: string[];
	/** 文脈に応じた翻訳パターン */
	context_patterns: {
		development: Record<string, string>;
		features: Record<string, string>;
		documentation: Record<string, string>;
	};
	/** 翻訳時の注意事項 */
	translation_notes: string[];
}

// バッチ翻訳設定
export interface BatchTranslationConfig {
	/** ソースディレクトリ */
	sourceDir: string;
	/** 出力ディレクトリ */
	outputDir: string;
	/** 処理対象のファイルパターン */
	filePatterns: string[];
	/** 除外パターン */
	excludePatterns: string[];
	/** 翻訳オプション */
	options: TranslationOptions;
	/** 並列処理数の上限 */
	parallelLimit: number;
	/** バックアップを作成するか */
	createBackup: boolean;
	/** 既存ファイルを上書きするか */
	overwriteExisting: boolean;
	/** 進捗レポートを出力するか */
	generateReport?: boolean;
	/** レポート出力パス */
	reportPath?: string;
}

// バッチ翻訳レポート
export interface BatchTranslationReport {
	/** 処理対象の総ファイル数 */
	totalFiles: number;
	/** 成功した翻訳の数 */
	successCount: number;
	/** 失敗した翻訳の数 */
	failureCount: number;
	/** スキップされた翻訳の数 */
	skippedCount: number;
	/** 各ファイルの処理結果 */
	results: BatchFileResult[];
	/** 開始時刻 */
	startTime: string;
	/** 終了時刻 */
	endTime: string;
	/** 総処理時間（ms） */
	duration: number;
	/** 設定情報 */
	config?: BatchTranslationConfig;
}

// バッチ処理の単一ファイル結果
export interface BatchFileResult {
	/** ソースファイルのパス */
	sourceFile: string;
	/** 出力ファイルのパス */
	outputFile: string;
	/** 処理結果のステータス */
	status: "success" | "failure" | "skipped";
	/** エラーメッセージ（失敗・スキップ時） */
	error?: string;
	/** 翻訳結果（成功時） */
	translationResult?: TranslationResult;
	/** 処理時間（ms） */
	processingTime: number;
	/** ファイルサイズ情報 */
	fileSize?: {
		original: number;
		translated: number;
	};
}

// 翻訳品質検証結果
export interface TranslationValidation {
	/** 検証結果が有効かどうか */
	isValid: boolean;
	/** 発見された問題点 */
	issues: ValidationIssue[];
	/** 改善提案 */
	suggestions: string[];
	/** 品質スコア（0-100） */
	qualityScore: number;
}

// 検証で発見された問題
export interface ValidationIssue {
	/** 問題の種類 */
	type: "structure" | "content" | "glossary" | "formatting";
	/** 問題の重要度 */
	severity: "low" | "medium" | "high";
	/** 問題の説明 */
	description: string;
	/** 問題の位置（行番号など） */
	location?: string;
	/** 修正提案 */
	suggestion?: string;
}

// 翻訳統計情報
export interface TranslationStats {
	/** 元テキストの単語数 */
	originalWordCount: number;
	/** 翻訳後テキストの単語数 */
	translatedWordCount: number;
	/** 用語集で翻訳された用語数 */
	glossaryTermsUsed: number;
	/** 処理時間 */
	processingTime: string;
	/** 翻訳率（用語集カバー率） */
	translationCoverage: number;
	/** 文字数変化率 */
	textExpansionRatio: number;
}

// 翻訳エンジンのインターフェース
export interface TranslationEngine {
	/** エンジン名 */
	name: string;
	/** エンジンの初期化 */
	initialize(config: TranslationAPIConfig): Promise<void>;
	/** テキストを翻訳 */
	translate(text: string, options: TranslationOptions): Promise<string>;
	/** 利用可能な言語ペアを取得 */
	getSupportedLanguages(): Promise<LanguagePair[]>;
	/** 使用量情報を取得 */
	getUsage(): Promise<UsageInfo>;
}

// 言語ペア
export interface LanguagePair {
	/** ソース言語コード */
	source: string;
	/** ターゲット言語コード */
	target: string;
	/** 言語ペアの表示名 */
	displayName: string;
}

// API使用量情報
export interface UsageInfo {
	/** 今日の使用量 */
	dailyUsage: number;
	/** 月間使用量 */
	monthlyUsage: number;
	/** 使用制限 */
	limit: number;
	/** 残り使用可能量 */
	remaining: number;
	/** リセット日時 */
	resetTime: string;
}

// プロジェクト固有の翻訳設定
export interface ProjectTranslationConfig {
	/** プロジェクト名 */
	projectName: string;
	/** デフォルト言語 */
	defaultLanguage: string;
	/** サポート言語のリスト */
	supportedLanguages: string[];
	/** コンテンツディレクトリ */
	contentDirectory: string;
	/** 翻訳出力ディレクトリパターン */
	outputDirectoryPattern: string;
	/** カスタム用語集のパス */
	customGlossaryPath?: string;
	/** 翻訳対象外のファイル/ディレクトリ */
	excludePatterns: string[];
	/** 翻訳エンジンの設定 */
	engineConfig: Record<string, TranslationAPIConfig>;
}

// 全ての型をエクスポート（重複回避）
