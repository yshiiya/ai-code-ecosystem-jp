#!/usr/bin/env ts-node

/**
 * AI Code Ecosystem Japan - Translation Agent
 * 英語コンテンツを日本語に翻訳するエージェント
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import * as yaml from "js-yaml";

// 翻訳関連の型定義（CommonJS用）
interface TranslationOptions {
	preserveCodeBlocks: boolean;
	preserveUrls: boolean;
	preserveMarkdownStructure: boolean;
	useGlossary: boolean;
	targetTone: "formal" | "casual" | "technical";
}

interface TranslationResult {
	originalText: string;
	translatedText: string;
	glossaryMatches: string[];
	confidence: number;
	timestamp: string;
}

interface Glossary {
	ai_terms: Record<string, string>;
	dev_tools: Record<string, string>;
	languages: Record<string, string>;
	ui_ux: Record<string, string>;
	business: Record<string, string>;
	keep_english: string[];
	context_patterns: {
		development: Record<string, string>;
		features: Record<string, string>;
		documentation: Record<string, string>;
	};
	translation_notes: string[];
}

class TranslationAgent {
	private glossary!: Glossary;
	private projectRoot: string;
	private defaultOptions: TranslationOptions;

	constructor() {
		this.projectRoot = join(__dirname, "../..");
		this.defaultOptions = {
			preserveCodeBlocks: true,
			preserveUrls: true,
			preserveMarkdownStructure: true,
			useGlossary: true,
			targetTone: "technical",
		};

		this.loadGlossary();
		console.log("🌐 Translation Agent initialized");
	}

	/**
	 * 用語集を読み込み
	 */
	private loadGlossary(): void {
		const glossaryPath = join(__dirname, "glossary.yaml");

		if (!existsSync(glossaryPath)) {
			throw new Error(`Glossary file not found: ${glossaryPath}`);
		}

		try {
			const glossaryContent = readFileSync(glossaryPath, "utf8");
			this.glossary = yaml.load(glossaryContent) as Glossary;
			console.log("📚 Glossary loaded successfully");
		} catch (error) {
			throw new Error(`Failed to load glossary: ${error}`);
		}
	}

	/**
	 * テキストから保護すべき要素を抽出・マスク
	 */
	private maskProtectedElements(text: string): {
		maskedText: string;
		protectedElements: Map<string, string>;
	} {
		const protectedElements = new Map<string, string>();
		let maskedText = text;
		let maskCounter = 0;

		// コードブロックを保護
		const codeBlockRegex = /```[\s\S]*?```/g;
		maskedText = maskedText.replace(codeBlockRegex, (match) => {
			const mask = `__CODE_BLOCK_${maskCounter}__`;
			protectedElements.set(mask, match);
			maskCounter++;
			return mask;
		});

		// インラインコードを保護
		const inlineCodeRegex = /`[^`]+`/g;
		maskedText = maskedText.replace(inlineCodeRegex, (match) => {
			const mask = `__INLINE_CODE_${maskCounter}__`;
			protectedElements.set(mask, match);
			maskCounter++;
			return mask;
		});

		// URLを保護
		const urlRegex = /https?:\/\/[^\s]+/g;
		maskedText = maskedText.replace(urlRegex, (match) => {
			const mask = `__URL_${maskCounter}__`;
			protectedElements.set(mask, match);
			maskCounter++;
			return mask;
		});

		// Markdownリンクを保護
		const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
		maskedText = maskedText.replace(linkRegex, (match, text, url) => {
			const mask = `__LINK_${maskCounter}__`;
			protectedElements.set(mask, match);
			maskCounter++;
			return mask;
		});

		// ファイルパスを保護
		const filePathRegex = /(?:\.\/|\/)[^\s]+\.[a-zA-Z0-9]+/g;
		maskedText = maskedText.replace(filePathRegex, (match) => {
			const mask = `__FILE_PATH_${maskCounter}__`;
			protectedElements.set(mask, match);
			maskCounter++;
			return mask;
		});

		return { maskedText, protectedElements };
	}

	/**
	 * マスクされた要素を復元
	 */
	private restoreProtectedElements(
		text: string,
		protectedElements: Map<string, string>,
	): string {
		let restoredText = text;

		protectedElements.forEach((originalValue, mask) => {
			restoredText = restoredText.replace(new RegExp(mask, "g"), originalValue);
		});

		return restoredText;
	}

	/**
	 * 用語集ベースの翻訳を適用
	 */
	private applyGlossaryTranslation(text: string): {
		translatedText: string;
		matches: string[];
	} {
		let translatedText = text;
		const matches: string[] = [];

		// すべての用語カテゴリを統合
		const allTerms = {
			...this.glossary.ai_terms,
			...this.glossary.dev_tools,
			...this.glossary.languages,
			...this.glossary.ui_ux,
			...this.glossary.business,
			...this.glossary.context_patterns.development,
			...this.glossary.context_patterns.features,
			...this.glossary.context_patterns.documentation,
		};

		// 長い用語から順に置換（部分一致を避けるため）
		const sortedTerms = Object.entries(allTerms).sort(
			(a, b) => b[0].length - a[0].length,
		);

		sortedTerms.forEach(([english, japanese]) => {
			// 英語のまま残す用語はスキップ
			if (this.glossary.keep_english.includes(english)) {
				return;
			}

			// 大文字小文字を区別しない置換
			const regex = new RegExp(
				`\\b${english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
				"gi",
			);
			if (regex.test(translatedText)) {
				translatedText = translatedText.replace(regex, japanese);
				matches.push(english);
			}
		});

		return { translatedText, matches };
	}

	/**
	 * モック翻訳API（実際のAPI連携まえの仮実装）
	 */
	private async mockTranslateAPI(
		text: string,
		options: TranslationOptions,
	): Promise<string> {
		// 実際の実装では、OpenAI GPT-4、DeepL API、または Google Translate APIを使用
		console.log("🤖 Mock translation API called");

		// シンプルな翻訳パターンの適用
		let translatedText = text;

		// 基本的な英語フレーズを日本語に
		const basicPhrases = {
			"Getting Started": "はじめに",
			"Quick Start": "クイックスタート",
			Installation: "インストール",
			Configuration: "設定",
			Documentation: "ドキュメント",
			Examples: "例",
			Tutorial: "チュートリアル",
			Guide: "ガイド",
			Overview: "概要",
			Features: "機能",
			"How to use": "使用方法",
			"Step by step": "ステップバイステップ",
			Prerequisites: "前提条件",
			Requirements: "要件",
			Dependencies: "依存関係",
			License: "ライセンス",
			Contributing: "貢献",
			Issues: "課題",
			Feedback: "フィードバック",
			Support: "サポート",
		};

		Object.entries(basicPhrases).forEach(([english, japanese]) => {
			const regex = new RegExp(`\\b${english}\\b`, "gi");
			translatedText = translatedText.replace(regex, japanese);
		});

		// 簡単な文構造の翻訳パターン
		// "This is a..." -> "これは...です"
		translatedText = translatedText.replace(
			/This is a ([^.]+)\./g,
			"これは$1です。",
		);
		translatedText = translatedText.replace(
			/This is an ([^.]+)\./g,
			"これは$1です。",
		);

		// "You can..." -> "...することができます"
		translatedText = translatedText.replace(
			/You can ([^.]+)\./g,
			"$1することができます。",
		);

		return translatedText;
	}

	/**
	 * メインの翻訳処理
	 */
	public async translateText(
		text: string,
		options: Partial<TranslationOptions> = {},
	): Promise<TranslationResult> {
		const mergedOptions = { ...this.defaultOptions, ...options };
		const startTime = Date.now();

		console.log("🌐 Starting translation...");

		try {
			// 1. 保護すべき要素をマスク
			const { maskedText, protectedElements } =
				this.maskProtectedElements(text);

			// 2. 用語集ベースの翻訳を適用
			let translatedText = maskedText;
			let glossaryMatches: string[] = [];

			if (mergedOptions.useGlossary) {
				const glossaryResult = this.applyGlossaryTranslation(maskedText);
				translatedText = glossaryResult.translatedText;
				glossaryMatches = glossaryResult.matches;
			}

			// 3. AI翻訳API呼び出し（モック実装）
			translatedText = await this.mockTranslateAPI(
				translatedText,
				mergedOptions,
			);

			// 4. 保護された要素を復元
			translatedText = this.restoreProtectedElements(
				translatedText,
				protectedElements,
			);

			// 5. 翻訳結果を生成
			const result: TranslationResult = {
				originalText: text,
				translatedText,
				glossaryMatches,
				confidence: 0.85, // モック値
				timestamp: new Date().toISOString(),
			};

			const processingTime = Date.now() - startTime;
			console.log(`✅ Translation completed in ${processingTime}ms`);

			return result;
		} catch (error) {
			console.error("❌ Translation failed:", error);
			throw error;
		}
	}

	/**
	 * ファイルを翻訳
	 */
	public async translateFile(
		inputPath: string,
		outputPath: string,
		options: Partial<TranslationOptions> = {},
	): Promise<TranslationResult> {
		console.log(`📄 Translating file: ${inputPath}`);

		if (!existsSync(inputPath)) {
			throw new Error(`Input file not found: ${inputPath}`);
		}

		const content = readFileSync(inputPath, "utf8");
		const result = await this.translateText(content, options);

		// 翻訳結果を出力ファイルに保存
		writeFileSync(outputPath, result.translatedText);

		// メタデータも保存
		const metadataPath = outputPath.replace(
			/\.[^.]+$/,
			".translation-meta.json",
		);
		writeFileSync(
			metadataPath,
			JSON.stringify(
				{
					inputFile: inputPath,
					outputFile: outputPath,
					glossaryMatches: result.glossaryMatches,
					confidence: result.confidence,
					timestamp: result.timestamp,
					options,
				},
				null,
				2,
			),
		);

		console.log(`✅ File translated and saved to: ${outputPath}`);

		return result;
	}

	/**
	 * 翻訳品質チェック
	 */
	public validateTranslation(result: TranslationResult): {
		isValid: boolean;
		issues: string[];
		suggestions: string[];
	} {
		const issues: string[] = [];
		const suggestions: string[] = [];

		// 基本的な品質チェック
		if (result.confidence < 0.7) {
			issues.push("翻訳の信頼度が低いです");
			suggestions.push("人手による確認が必要です");
		}

		// Markdownの構造が保持されているかチェック
		const originalHeaders = result.originalText.match(/^#{1,6}\s/gm) || [];
		const translatedHeaders = result.translatedText.match(/^#{1,6}\s/gm) || [];

		if (originalHeaders.length !== translatedHeaders.length) {
			issues.push("Markdownヘッダーの構造が変更されています");
			suggestions.push("見出しレベルを確認してください");
		}

		// コードブロックが保持されているかチェック
		const originalCodeBlocks =
			result.originalText.match(/```[\s\S]*?```/g) || [];
		const translatedCodeBlocks =
			result.translatedText.match(/```[\s\S]*?```/g) || [];

		if (originalCodeBlocks.length !== translatedCodeBlocks.length) {
			issues.push("コードブロックが正しく保持されていません");
			suggestions.push("コードブロックの前後を確認してください");
		}

		return {
			isValid: issues.length === 0,
			issues,
			suggestions,
		};
	}

	/**
	 * 翻訳統計を取得
	 */
	public getTranslationStats(result: TranslationResult): {
		originalWordCount: number;
		translatedWordCount: number;
		glossaryTermsUsed: number;
		processingTime: string;
	} {
		return {
			originalWordCount: result.originalText.split(/\s+/).length,
			translatedWordCount: result.translatedText.split(/\s+/).length,
			glossaryTermsUsed: result.glossaryMatches.length,
			processingTime: result.timestamp,
		};
	}
}

// CLI実行時の処理
async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.log(`
🌐 Translation Agent Usage:

  Basic translation:
    ts-node translate_content.ts "Hello World"
    
  File translation:
    ts-node translate_content.ts --file input.md output.md
    
  Options:
    --tone formal|casual|technical
    --no-glossary
    --preserve-structure
    
  Examples:
    ts-node translate_content.ts --file README.md README.ja.md --tone technical
    ts-node translate_content.ts "This is a powerful AI tool" --tone formal
		`);
		process.exit(0);
	}

	const agent = new TranslationAgent();

	try {
		if (args[0] === "--file") {
			// ファイル翻訳モード
			const inputPath = args[1];
			const outputPath = args[2] || inputPath.replace(/\.md$/, ".ja.md");

			const result = await agent.translateFile(inputPath, outputPath);
			const validation = agent.validateTranslation(result);
			const stats = agent.getTranslationStats(result);

			console.log("\n📊 Translation Results:");
			console.log(`  Original words: ${stats.originalWordCount}`);
			console.log(`  Translated words: ${stats.translatedWordCount}`);
			console.log(`  Glossary terms used: ${stats.glossaryTermsUsed}`);
			console.log(`  Confidence: ${result.confidence}`);

			if (!validation.isValid) {
				console.log("\n⚠️  Translation Issues:");
				validation.issues.forEach((issue) => console.log(`  - ${issue}`));
				console.log("\n💡 Suggestions:");
				validation.suggestions.forEach((suggestion) =>
					console.log(`  - ${suggestion}`),
				);
			}
		} else {
			// テキスト翻訳モード
			const text = args[0];
			const result = await agent.translateText(text);

			console.log("\n📝 Translation Result:");
			console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
			console.log(`Original: ${result.originalText}`);
			console.log(`Japanese: ${result.translatedText}`);
			console.log(`Glossary matches: ${result.glossaryMatches.join(", ")}`);
			console.log(`Confidence: ${result.confidence}`);
			console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		}
	} catch (error) {
		console.error("❌ Translation failed:", error);
		process.exit(1);
	}
}

// モジュールエクスポート
export { TranslationAgent };

// CLI実行（ESモジュール形式）
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
