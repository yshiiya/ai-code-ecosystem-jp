#!/usr/bin/env ts-node

/**
 * AI Code Ecosystem Japan - Batch Translation Script
 * 複数のファイル・ディレクトリを一括で翻訳するスクリプト
 */

import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	statSync,
	writeFileSync,
} from "fs";
import { basename, dirname, extname, join } from "path";
import { TranslationAgent } from "../translate_content";
import type {
	BatchFileResult,
	BatchTranslationConfig,
	BatchTranslationReport,
	TranslationOptions,
	TranslationResult,
} from "../types";

class BatchTranslator {
	private agent: TranslationAgent;
	private config: BatchTranslationConfig;
	private report: BatchTranslationReport;

	constructor(config: Partial<BatchTranslationConfig> = {}) {
		this.agent = new TranslationAgent();
		this.config = {
			sourceDir: config.sourceDir || "./content",
			outputDir: config.outputDir || "./content/ja",
			filePatterns: config.filePatterns || ["*.md", "*.mdx"],
			excludePatterns: config.excludePatterns || [
				"node_modules/**",
				".git/**",
				"dist/**",
			],
			options: config.options || {
				preserveCodeBlocks: true,
				preserveUrls: true,
				preserveMarkdownStructure: true,
				useGlossary: true,
				targetTone: "technical",
			},
			parallelLimit: config.parallelLimit || 3,
			createBackup: config.createBackup || true,
			overwriteExisting: config.overwriteExisting || false,
		};

		this.report = {
			totalFiles: 0,
			successCount: 0,
			failureCount: 0,
			skippedCount: 0,
			results: [],
			startTime: new Date().toISOString(),
			endTime: "",
			duration: 0,
		};

		console.log("📦 Batch Translator initialized");
		console.log(`Source: ${this.config.sourceDir}`);
		console.log(`Output: ${this.config.outputDir}`);
	}

	/**
	 * ファイルパターンマッチング
	 */
	private matchesPattern(filePath: string, patterns: string[]): boolean {
		return patterns.some((pattern) => {
			// シンプルなグロブパターン実装
			const regex = pattern
				.replace(/\*\*/g, "__DOUBLE_STAR__")
				.replace(/\*/g, "[^/]*")
				.replace(/__DOUBLE_STAR__/g, ".*");

			return new RegExp(`^${regex}$`).test(filePath);
		});
	}

	/**
	 * 翻訳対象ファイルを収集
	 */
	private collectFiles(dir: string, relativePath = ""): string[] {
		const files: string[] = [];

		if (!existsSync(dir)) {
			console.warn(`⚠️  Directory not found: ${dir}`);
			return files;
		}

		const entries = readdirSync(dir);

		for (const entry of entries) {
			const fullPath = join(dir, entry);
			const relativeFilePath = join(relativePath, entry);
			const stat = statSync(fullPath);

			// 除外パターンに一致する場合はスキップ
			if (this.matchesPattern(relativeFilePath, this.config.excludePatterns)) {
				continue;
			}

			if (stat.isDirectory()) {
				// サブディレクトリを再帰的に探索
				files.push(...this.collectFiles(fullPath, relativeFilePath));
			} else if (stat.isFile()) {
				// ファイルパターンに一致するかチェック
				if (this.matchesPattern(entry, this.config.filePatterns)) {
					files.push(fullPath);
				}
			}
		}

		return files;
	}

	/**
	 * 出力ファイルパスを生成
	 */
	private generateOutputPath(sourceFile: string): string {
		const relativePath = sourceFile.replace(this.config.sourceDir, "");
		const ext = extname(sourceFile);
		const baseName = basename(sourceFile, ext);
		const dir = dirname(relativePath);

		// 日本語ファイル名に変更（.ja.md形式）
		const outputFileName = `${baseName}.ja${ext}`;
		return join(this.config.outputDir, dir, outputFileName);
	}

	/**
	 * 単一ファイルの翻訳処理
	 */
	private async translateSingleFile(
		sourceFile: string,
	): Promise<BatchFileResult> {
		const startTime = Date.now();
		const outputFile = this.generateOutputPath(sourceFile);

		const result: BatchFileResult = {
			sourceFile,
			outputFile,
			status: "failure",
			processingTime: 0,
		};

		try {
			// 出力ファイルが既に存在し、上書きしない設定の場合
			if (existsSync(outputFile) && !this.config.overwriteExisting) {
				result.status = "skipped";
				result.error = "File already exists and overwrite is disabled";
				result.processingTime = Date.now() - startTime;
				return result;
			}

			// 出力ディレクトリを作成
			const outputDir = dirname(outputFile);
			if (!existsSync(outputDir)) {
				mkdirSync(outputDir, { recursive: true });
			}

			// バックアップ作成
			if (this.config.createBackup && existsSync(outputFile)) {
				const backupFile = `${outputFile}.backup.${Date.now()}`;
				const content = readFileSync(outputFile, "utf8");
				writeFileSync(backupFile, content);
				console.log(`💾 Backup created: ${backupFile}`);
			}

			// 翻訳実行
			console.log(`🌐 Translating: ${sourceFile}`);
			const translationResult = await this.agent.translateFile(
				sourceFile,
				outputFile,
				this.config.options,
			);

			result.status = "success";
			result.translationResult = translationResult;
			result.processingTime = Date.now() - startTime;

			console.log(`✅ Successfully translated: ${sourceFile} -> ${outputFile}`);
		} catch (error) {
			result.status = "failure";
			result.error = error instanceof Error ? error.message : "Unknown error";
			result.processingTime = Date.now() - startTime;

			console.error(`❌ Failed to translate: ${sourceFile}`, error);
		}

		return result;
	}

	/**
	 * バッチ翻訳を実行
	 */
	public async run(): Promise<BatchTranslationReport> {
		console.log("🚀 Starting batch translation...");

		const startTime = Date.now();
		this.report.startTime = new Date().toISOString();

		// 翻訳対象ファイルを収集
		const sourceFiles = this.collectFiles(this.config.sourceDir);
		this.report.totalFiles = sourceFiles.length;

		console.log(`📁 Found ${sourceFiles.length} files to translate`);

		if (sourceFiles.length === 0) {
			console.log("ℹ️  No files found to translate");
			this.finializeReport(startTime);
			return this.report;
		}

		// 並列処理でファイルを翻訳
		const results: BatchFileResult[] = [];
		const batches = this.chunkArray(sourceFiles, this.config.parallelLimit);

		for (const batch of batches) {
			const batchPromises = batch.map((file) => this.translateSingleFile(file));
			const batchResults = await Promise.all(batchPromises);
			results.push(...batchResults);

			// 進捗表示
			const completed = results.length;
			const progress = Math.round((completed / sourceFiles.length) * 100);
			console.log(
				`📊 Progress: ${completed}/${sourceFiles.length} (${progress}%)`,
			);
		}

		this.report.results = results;

		// 集計
		this.report.successCount = results.filter(
			(r) => r.status === "success",
		).length;
		this.report.failureCount = results.filter(
			(r) => r.status === "failure",
		).length;
		this.report.skippedCount = results.filter(
			(r) => r.status === "skipped",
		).length;

		this.finializeReport(startTime);

		return this.report;
	}

	/**
	 * レポートを確定
	 */
	private finializeReport(startTime: number): void {
		this.report.endTime = new Date().toISOString();
		this.report.duration = Date.now() - startTime;
	}

	/**
	 * 配列をチャンク分割
	 */
	private chunkArray<T>(array: T[], chunkSize: number): T[][] {
		const chunks: T[][] = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			chunks.push(array.slice(i, i + chunkSize));
		}
		return chunks;
	}

	/**
	 * レポートを生成・保存
	 */
	public generateReport(): void {
		console.log("\n📊 Batch Translation Report");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		console.log(`📈 Summary:`);
		console.log(`  Total files: ${this.report.totalFiles}`);
		console.log(`  ✅ Success: ${this.report.successCount}`);
		console.log(`  ❌ Failures: ${this.report.failureCount}`);
		console.log(`  ⏭️  Skipped: ${this.report.skippedCount}`);
		console.log(`  ⏱️  Duration: ${Math.round(this.report.duration / 1000)}s`);

		if (this.report.failureCount > 0) {
			console.log(`\n❌ Failed files:`);
			this.report.results
				.filter((r) => r.status === "failure")
				.forEach((r) => {
					console.log(`  - ${r.sourceFile}: ${r.error}`);
				});
		}

		if (this.report.skippedCount > 0) {
			console.log(`\n⏭️  Skipped files:`);
			this.report.results
				.filter((r) => r.status === "skipped")
				.forEach((r) => {
					console.log(`  - ${r.sourceFile}: ${r.error}`);
				});
		}

		// レポートファイルを保存
		const reportPath = join(this.config.outputDir, "translation-report.json");
		try {
			if (!existsSync(dirname(reportPath))) {
				mkdirSync(dirname(reportPath), { recursive: true });
			}
			writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
			console.log(`\n📄 Full report saved: ${reportPath}`);
		} catch (error) {
			console.error("❌ Failed to save report:", error);
		}

		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
	}

	/**
	 * 設定をJSONファイルから読み込み
	 */
	public static loadConfig(
		configPath: string,
	): Partial<BatchTranslationConfig> {
		if (!existsSync(configPath)) {
			throw new Error(`Config file not found: ${configPath}`);
		}

		try {
			const configContent = readFileSync(configPath, "utf8");
			return JSON.parse(configContent);
		} catch (error) {
			throw new Error(`Failed to load config: ${error}`);
		}
	}

	/**
	 * デフォルト設定ファイルを作成
	 */
	public static createDefaultConfig(outputPath: string): void {
		const defaultConfig: BatchTranslationConfig = {
			sourceDir: "./content",
			outputDir: "./content/ja",
			filePatterns: ["*.md", "*.mdx"],
			excludePatterns: ["node_modules/**", ".git/**", "dist/**", "*.ja.md"],
			options: {
				preserveCodeBlocks: true,
				preserveUrls: true,
				preserveMarkdownStructure: true,
				useGlossary: true,
				targetTone: "technical",
			},
			parallelLimit: 3,
			createBackup: true,
			overwriteExisting: false,
		};

		writeFileSync(outputPath, JSON.stringify(defaultConfig, null, 2));
		console.log(`📄 Default config created: ${outputPath}`);
	}
}

// CLI実行時の処理
async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0 || args[0] === "--help") {
		console.log(`
📦 Batch Translation Script Usage:

  Basic usage:
    ts-node batch_translate.ts --source ./content --output ./content/ja
    
  With config file:
    ts-node batch_translate.ts --config translation.config.json
    
  Create default config:
    ts-node batch_translate.ts --create-config translation.config.json
    
  Options:
    --source <dir>        Source directory (default: ./content)
    --output <dir>        Output directory (default: ./content/ja)
    --patterns <patterns> File patterns (comma-separated)
    --parallel <num>      Parallel limit (default: 3)
    --overwrite          Overwrite existing files
    --no-backup          Skip backup creation
    --tone <tone>        Translation tone (formal|casual|technical)
    
  Examples:
    ts-node batch_translate.ts --source ./docs --output ./docs/ja --patterns "*.md,*.mdx"
    ts-node batch_translate.ts --config batch-config.json --overwrite
		`);
		process.exit(0);
	}

	try {
		let config: Partial<BatchTranslationConfig> = {};

		// コマンドライン引数を解析
		for (let i = 0; i < args.length; i++) {
			const arg = args[i];

			switch (arg) {
				case "--create-config":
					const configPath = args[i + 1];
					if (!configPath) {
						throw new Error("Config file path required");
					}
					BatchTranslator.createDefaultConfig(configPath);
					process.exit(0);
					break;

				case "--config":
					const configFile = args[i + 1];
					if (!configFile) {
						throw new Error("Config file path required");
					}
					config = BatchTranslator.loadConfig(configFile);
					i++; // Skip next argument
					break;

				case "--source":
					config.sourceDir = args[i + 1];
					i++;
					break;

				case "--output":
					config.outputDir = args[i + 1];
					i++;
					break;

				case "--patterns":
					const patterns = args[i + 1];
					if (patterns) {
						config.filePatterns = patterns.split(",");
					}
					i++;
					break;

				case "--parallel":
					const parallel = Number.parseInt(args[i + 1]);
					if (!isNaN(parallel)) {
						config.parallelLimit = parallel;
					}
					i++;
					break;

				case "--overwrite":
					config.overwriteExisting = true;
					break;

				case "--no-backup":
					config.createBackup = false;
					break;

				case "--tone":
					const tone = args[i + 1] as "formal" | "casual" | "technical";
					if (["formal", "casual", "technical"].includes(tone)) {
						config.options = {
							preserveCodeBlocks: true,
							preserveUrls: true,
							preserveMarkdownStructure: true,
							useGlossary: true,
							...(config.options || {}),
							targetTone: tone,
						};
					}
					i++;
					break;
			}
		}

		// バッチ翻訳を実行
		const translator = new BatchTranslator(config);
		const report = await translator.run();
		translator.generateReport();

		// 終了コードを設定
		process.exit(report.failureCount > 0 ? 1 : 0);
	} catch (error) {
		console.error("❌ Batch translation failed:", error);
		process.exit(1);
	}
}

// モジュールエクスポート
export { BatchTranslator };
export type { BatchTranslationConfig, BatchTranslationReport };

// CLI実行
if (require.main === module) {
	main();
}
