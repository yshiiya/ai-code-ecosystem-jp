#!/usr/bin/env ts-node

/**
 * Content Creator Agent - 非エンジニア向けコンテンツ生成
 * Claude Code内で対話的に実行される想定
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import * as yaml from "js-yaml";

interface ContentRequest {
	type: "beginner_guide" | "comparison" | "use_case" | "tutorial";
	tool: string;
	title: string;
	audience: "non_engineer" | "beginner" | "intermediate";
	language: "ja" | "en";
}

interface ContentTemplate {
	structure: string[];
	tone: string;
	examples: boolean;
	visuals: boolean;
}

class ContentCreator {
	private templatesPath = join(__dirname, "../templates");
	private outputPath = join(__dirname, "../../../docs/content");
	private dataPath = join(__dirname, "../../../src/lib/data.ts");
	private templates: Record<string, ContentTemplate> = {};

	constructor() {
		this.loadTemplates();
		this.ensureOutputDirectory();
	}

	/**
	 * テンプレート読み込み
	 */
	private loadTemplates() {
		this.templates = {
			beginner_guide: {
				structure: [
					"## はじめに",
					"## このツールでできること",
					"## 使い始める前に必要なもの",
					"## ステップバイステップガイド",
					"## よくある質問",
					"## 次のステップ",
				],
				tone: "friendly",
				examples: true,
				visuals: true,
			},
			comparison: {
				structure: [
					"## 概要",
					"## 比較表",
					"## それぞれの強み",
					"## 使い分けのポイント",
					"## おすすめシナリオ",
					"## まとめ",
				],
				tone: "neutral",
				examples: true,
				visuals: true,
			},
			use_case: {
				structure: [
					"## シナリオ",
					"## 課題",
					"## 解決方法",
					"## 実装手順",
					"## 結果",
					"## ポイント",
				],
				tone: "practical",
				examples: true,
				visuals: false,
			},
			tutorial: {
				structure: [
					"## 目標",
					"## 前提条件",
					"## 手順",
					"## トラブルシューティング",
					"## 完成例",
					"## 応用",
				],
				tone: "instructional",
				examples: true,
				visuals: true,
			},
		};
	}

	/**
	 * 出力ディレクトリ確認
	 */
	private ensureOutputDirectory() {
		if (!existsSync(this.outputPath)) {
			mkdirSync(this.outputPath, { recursive: true });
			console.log("📁 出力ディレクトリを作成しました");
		}
	}

	/**
	 * ツール情報を取得
	 */
	private getToolInfo(toolId: string): any {
		// ハードコードされたデータ（テスト用）
		const tools = [
			{
				id: "claude-code",
				name: "Claude Code",
				category: "CLI/エージェント",
				description:
					"Anthropicが開発したターミナル内で動作するエージェンティックAIコーディングツール",
				pricing: "$20/月",
				tags: ["CLI", "エージェント", "MCP対応"],
			},
			{
				id: "github-copilot",
				name: "GitHub Copilot",
				category: "IDE拡張",
				description:
					"世界で最も広く採用されているAI開発者ツール。マルチモデル対応",
				pricing: "$10/月〜",
				tags: ["IDE統合", "マルチモデル", "無料プランあり"],
			},
		];
		return tools.find((t) => t.id === toolId);
	}

	/**
	 * 初心者向けガイド生成
	 */
	private generateBeginnerGuide(tool: any, title: string): string {
		const template = this.templates.beginner_guide;

		let content = `# ${title}\n\n`;
		content += `*最終更新: ${new Date().toLocaleDateString("ja-JP")}*\n\n`;

		// はじめに
		content += `## はじめに\n\n`;
		content += `${tool.name}は、プログラミングの知識がなくても使える画期的なAIツールです。\n`;
		content += `このガイドでは、初めての方でも安心して始められるよう、丁寧に解説していきます。\n\n`;

		// できること
		content += `## このツールでできること\n\n`;
		content += `### 主な機能\n`;
		content += `- 🤖 **自動コード生成**: 日本語で指示するだけでコードを作成\n`;
		content += `- 🔧 **エラー修正**: プログラムの問題を自動で発見・修正\n`;
		content += `- 📚 **学習サポート**: コードの意味を分かりやすく説明\n\n`;

		// 必要なもの
		content += `## 使い始める前に必要なもの\n\n`;
		content += `1. **パソコン**: Windows、Mac、どちらでもOK\n`;
		content += `2. **インターネット接続**: 安定した接続環境\n`;
		content += `3. **アカウント**: ${tool.name}の無料アカウント（作成方法は次章で）\n\n`;

		// ステップバイステップ
		content += `## ステップバイステップガイド\n\n`;
		content += `### Step 1: アカウント作成\n`;
		content += `1. [公式サイト]にアクセス\n`;
		content += `2. 「Sign Up」または「始める」ボタンをクリック\n`;
		content += `3. メールアドレスを入力\n`;
		content += `4. 確認メールから本登録を完了\n\n`;

		content += `### Step 2: 初期設定\n`;
		content += `1. 言語設定を「日本語」に変更\n`;
		content += `2. 使用目的を選択（個人利用でOK）\n`;
		content += `3. チュートリアルを実行（推奨）\n\n`;

		content += `### Step 3: 最初のコード生成\n`;
		content += `\`\`\`\n`;
		content += `例: 「ToDoリストのWebアプリを作って」と入力\n`;
		content += `\`\`\`\n\n`;

		// FAQ
		content += `## よくある質問\n\n`;
		content += `**Q: プログラミングの経験がなくても使えますか？**\n`;
		content += `A: はい！${tool.name}は初心者向けに設計されています。\n\n`;

		content += `**Q: 料金はかかりますか？**\n`;
		content += `A: ${tool.pricing || "基本機能は無料で利用できます。"}\n\n`;

		content += `**Q: どんなものが作れますか？**\n`;
		content += `A: Webサイト、スマホアプリ、データ分析ツールなど、幅広く作成可能です。\n\n`;

		// 次のステップ
		content += `## 次のステップ\n\n`;
		content += `- 📖 [応用ガイド]を読む\n`;
		content += `- 🎯 [実践例]を試す\n`;
		content += `- 💬 [コミュニティ]に参加する\n\n`;

		content += `---\n`;
		content += `*このガイドは非エンジニアの方向けに作成されています。*\n`;

		return content;
	}

	/**
	 * 比較コンテンツ生成
	 */
	private generateComparison(tools: any[], title: string): string {
		let content = `# ${title}\n\n`;
		content += `*最終更新: ${new Date().toLocaleDateString("ja-JP")}*\n\n`;

		content += `## 概要\n\n`;
		content += `AIコーディングツールの選択で迷っていませんか？\n`;
		content += `ここでは主要なツールを分かりやすく比較します。\n\n`;

		content += `## 比較表\n\n`;
		content += `| 項目 | ${tools.map((t) => t.name).join(" | ")} |\n`;
		content += `|------|${tools.map(() => "------").join("|")}|\n`;
		content += `| 料金 | ${tools.map((t) => t.pricing).join(" | ")} |\n`;
		content += `| 日本語対応 | ${tools.map(() => "○").join(" | ")} |\n`;
		content += `| 初心者向け | ${tools.map(() => "★★★").join(" | ")} |\n`;
		content += `| 対応言語数 | ${tools.map(() => "50+").join(" | ")} |\n\n`;

		content += `## それぞれの強み\n\n`;
		tools.forEach((tool) => {
			content += `### ${tool.name}\n`;
			content += `- ✨ ${tool.description}\n`;
			content += `- 💰 ${tool.pricing}\n`;
			content += `- 🏷️ ${tool.tags?.join(", ") || "タグなし"}\n\n`;
		});

		return content;
	}

	/**
	 * ユースケース生成
	 */
	private generateUseCase(tool: any, scenario: string): string {
		let content = `# ${tool.name}活用事例: ${scenario}\n\n`;

		content += `## シナリオ\n\n`;
		content += `小規模な飲食店を経営する田中さん（45歳）は、\n`;
		content += `予約管理をExcelで行っていましたが、管理が大変になってきました。\n\n`;

		content += `## 課題\n\n`;
		content += `- 📊 Excel管理の限界\n`;
		content += `- ⏰ 手作業による時間のロス\n`;
		content += `- 🔄 ダブルブッキングのリスク\n\n`;

		content += `## 解決方法\n\n`;
		content += `${tool.name}を使って、簡単な予約管理システムを作成しました。\n\n`;

		content += `## 実装手順\n\n`;
		content += `1. ${tool.name}にログイン\n`;
		content += `2. 「予約管理システムを作りたい」と入力\n`;
		content += `3. 生成されたコードを確認\n`;
		content += `4. カスタマイズ（店名、営業時間など）\n`;
		content += `5. テスト運用開始\n\n`;

		content += `## 結果\n\n`;
		content += `- ✅ 予約管理が自動化\n`;
		content += `- ✅ 月20時間の時間削減\n`;
		content += `- ✅ 顧客満足度の向上\n\n`;

		return content;
	}

	/**
	 * コンテンツ生成メイン
	 */
	public async createContent(request: ContentRequest): Promise<string> {
		console.log(`\n📝 コンテンツ生成開始: ${request.title}\n`);

		let content = "";
		const timestamp = new Date().toISOString().split("T")[0];
		let filename = "";

		switch (request.type) {
			case "beginner_guide":
				const tool = this.getToolInfo(request.tool);
				if (!tool) {
					throw new Error(`ツール ${request.tool} が見つかりません`);
				}
				content = this.generateBeginnerGuide(tool, request.title);
				filename = `${request.tool}-beginner-guide-${timestamp}.md`;
				break;

			case "comparison":
				// 複数ツールの比較（サンプル）
				const tools = ["claude-code", "github-copilot"]
					.map((id) => this.getToolInfo(id))
					.filter(Boolean);
				content = this.generateComparison(tools, request.title);
				filename = `comparison-${timestamp}.md`;
				break;

			case "use_case":
				const targetTool = this.getToolInfo(request.tool);
				if (!targetTool) {
					throw new Error(`ツール ${request.tool} が見つかりません`);
				}
				content = this.generateUseCase(targetTool, "飲食店の予約管理");
				filename = `${request.tool}-usecase-${timestamp}.md`;
				break;

			default:
				throw new Error(`未対応のコンテンツタイプ: ${request.type}`);
		}

		// ファイル保存
		const outputFile = join(this.outputPath, filename);
		writeFileSync(outputFile, content);

		console.log(`✅ コンテンツを生成しました: ${outputFile}`);
		console.log(`📄 文字数: ${content.length}文字`);

		return outputFile;
	}

	/**
	 * 対話的コンテンツ作成（Claude Code用）
	 */
	public async interactiveCreate() {
		console.log("\n🎨 Content Creator Agent - 対話モード\n");
		console.log("非エンジニア向けのコンテンツを作成します。");
		console.log("どのようなコンテンツを作成しますか？\n");

		console.log("利用可能なテンプレート:");
		console.log("1. beginner_guide - 初心者向けガイド");
		console.log("2. comparison - ツール比較");
		console.log("3. use_case - 活用事例");
		console.log("4. tutorial - チュートリアル\n");

		// Claude Codeセッション内での対話を想定
		// 実際の実装では、ユーザー入力を待機

		return "対話モードで実行してください";
	}
}

// メイン実行
async function main() {
	const creator = new ContentCreator();

	// コマンドライン引数チェック
	const args = process.argv.slice(2);

	if (args.length === 0) {
		// 対話モード
		await creator.interactiveCreate();
	} else {
		// 引数指定モード（テスト用）
		const request: ContentRequest = {
			type: "beginner_guide",
			tool: "claude-code",
			title: "Claude Code 完全初心者ガイド",
			audience: "non_engineer",
			language: "ja",
		};

		await creator.createContent(request);
	}
}

// スクリプト実行
if (require.main === module) {
	main().catch(console.error);
}

module.exports = { ContentCreator };
