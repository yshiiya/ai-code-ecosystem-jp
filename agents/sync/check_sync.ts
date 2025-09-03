#!/usr/bin/env ts-node

/**
 * Sync Check Script - GitHub ActionsとClaude Code間の同期確認
 * Claude Code内で実行して、データの整合性をチェック
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import * as yaml from "js-yaml";

interface SyncStatus {
	component: string;
	local: string;
	remote: string;
	status: "synced" | "out_of_sync" | "local_only" | "remote_only";
	message?: string;
}

class SyncChecker {
	private projectRoot = join(__dirname, "../..");
	private syncResults: SyncStatus[] = [];

	constructor() {
		console.log("🔄 同期チェック開始\n");
	}

	/**
	 * Gitステータスをチェック
	 */
	private checkGitStatus(): void {
		try {
			const status = execSync("git status --porcelain", {
				cwd: this.projectRoot,
			}).toString();

			if (status.trim()) {
				this.syncResults.push({
					component: "Git Repository",
					local: "Modified",
					remote: "Clean",
					status: "out_of_sync",
					message: "ローカルに未コミットの変更があります",
				});
			} else {
				// リモートとの差分チェック
				execSync("git fetch", { cwd: this.projectRoot });
				const behind = execSync("git rev-list HEAD..origin/main --count", {
					cwd: this.projectRoot,
				})
					.toString()
					.trim();
				const ahead = execSync("git rev-list origin/main..HEAD --count", {
					cwd: this.projectRoot,
				})
					.toString()
					.trim();

				if (behind !== "0") {
					this.syncResults.push({
						component: "Git Repository",
						local: `${ahead} commits ahead`,
						remote: `${behind} commits behind`,
						status: "out_of_sync",
						message: `リモートに${behind}個の新しいコミットがあります`,
					});
				} else if (ahead !== "0") {
					this.syncResults.push({
						component: "Git Repository",
						local: `${ahead} commits ahead`,
						remote: "Up to date",
						status: "out_of_sync",
						message: `ローカルに${ahead}個の未プッシュコミットがあります`,
					});
				} else {
					this.syncResults.push({
						component: "Git Repository",
						local: "Up to date",
						remote: "Up to date",
						status: "synced",
					});
				}
			}
		} catch (error) {
			this.syncResults.push({
				component: "Git Repository",
				local: "Error",
				remote: "Unknown",
				status: "out_of_sync",
				message: "Gitステータスを確認できませんでした",
			});
		}
	}

	/**
	 * エージェント設定の同期チェック
	 */
	private checkAgentConfig(): void {
		const configPath = join(this.projectRoot, "agents/config/agents.yaml");

		if (!existsSync(configPath)) {
			this.syncResults.push({
				component: "Agent Config",
				local: "Not found",
				remote: "Unknown",
				status: "out_of_sync",
				message: "agents.yamlが見つかりません",
			});
			return;
		}

		try {
			const config = yaml.load(readFileSync(configPath, "utf8")) as any;
			const agents = config.agents;

			// execution_modeフィールドのチェック
			let hasExecutionMode = true;
			for (const [name, agent] of Object.entries(agents)) {
				if (!(agent as any).execution_mode) {
					hasExecutionMode = false;
					break;
				}
			}

			if (hasExecutionMode) {
				this.syncResults.push({
					component: "Agent Config",
					local: "Updated",
					remote: "Will sync on push",
					status: "synced",
					message: "すべてのエージェントにexecution_modeが設定されています",
				});
			} else {
				this.syncResults.push({
					component: "Agent Config",
					local: "Outdated",
					remote: "Outdated",
					status: "out_of_sync",
					message: "execution_modeが未設定のエージェントがあります",
				});
			}
		} catch (error) {
			this.syncResults.push({
				component: "Agent Config",
				local: "Error",
				remote: "Unknown",
				status: "out_of_sync",
				message: "エージェント設定の読み込みエラー",
			});
		}
	}

	/**
	 * データファイルの同期チェック
	 */
	private checkDataFiles(): void {
		const dataPath = join(this.projectRoot, "src/lib/data.ts");

		if (!existsSync(dataPath)) {
			this.syncResults.push({
				component: "Data File",
				local: "Not found",
				remote: "Unknown",
				status: "out_of_sync",
				message: "data.tsが見つかりません",
			});
			return;
		}

		try {
			const content = readFileSync(dataPath, "utf8");
			const lastModified = execSync(
				`git log -1 --format=%cd --date=relative ${dataPath}`,
				{ cwd: this.projectRoot },
			)
				.toString()
				.trim();

			// ツール数をカウント
			const toolsMatch = content.match(/export const tools = \[([\s\S]*?)\]/);
			const toolCount = toolsMatch
				? (toolsMatch[1].match(/id:/g) || []).length
				: 0;

			this.syncResults.push({
				component: "Data File",
				local: `${toolCount} tools`,
				remote: `Last updated: ${lastModified}`,
				status: "synced",
				message: `${toolCount}個のツールが登録されています`,
			});
		} catch (error) {
			this.syncResults.push({
				component: "Data File",
				local: "Error",
				remote: "Unknown",
				status: "out_of_sync",
				message: "データファイルの読み込みエラー",
			});
		}
	}

	/**
	 * GitHub Actionsワークフローのチェック
	 */
	private checkWorkflows(): void {
		const workflowsPath = join(this.projectRoot, ".github/workflows");

		if (!existsSync(workflowsPath)) {
			this.syncResults.push({
				component: "GitHub Actions",
				local: "Not found",
				remote: "Unknown",
				status: "out_of_sync",
				message: "ワークフローディレクトリが見つかりません",
			});
			return;
		}

		const workflows = [
			"agent-daily-update.yml",
			"agent-weekly-report.yml",
			"agent-health-check.yml",
		];

		let allFound = true;
		const missing: string[] = [];

		workflows.forEach((workflow) => {
			const path = join(workflowsPath, workflow);
			if (!existsSync(path)) {
				allFound = false;
				missing.push(workflow);
			}
		});

		if (allFound) {
			this.syncResults.push({
				component: "GitHub Actions",
				local: `${workflows.length} workflows`,
				remote: "Configured",
				status: "synced",
				message: "すべてのワークフローが設定されています",
			});
		} else {
			this.syncResults.push({
				component: "GitHub Actions",
				local: `${workflows.length - missing.length}/${workflows.length} workflows`,
				remote: "Incomplete",
				status: "out_of_sync",
				message: `不足: ${missing.join(", ")}`,
			});
		}
	}

	/**
	 * レポート生成
	 */
	private generateReport(): void {
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("                    同期ステータスレポート");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

		// ステータスごとにグループ化
		const synced = this.syncResults.filter((r) => r.status === "synced");
		const outOfSync = this.syncResults.filter(
			(r) => r.status === "out_of_sync",
		);

		// サマリー
		console.log("📊 サマリー");
		console.log(`  ✅ 同期済み: ${synced.length}`);
		console.log(`  ⚠️  要同期: ${outOfSync.length}`);
		console.log("");

		// 詳細
		console.log("📋 詳細");
		console.log(
			"─────────────────────────────────────────────────────────────",
		);

		this.syncResults.forEach((result) => {
			const icon = result.status === "synced" ? "✅" : "⚠️";
			console.log(`\n${icon} ${result.component}`);
			console.log(`  ローカル: ${result.local}`);
			console.log(`  リモート: ${result.remote}`);
			if (result.message) {
				console.log(`  📝 ${result.message}`);
			}
		});

		console.log(
			"\n─────────────────────────────────────────────────────────────",
		);

		// 推奨アクション
		if (outOfSync.length > 0) {
			console.log("\n🔧 推奨アクション:");

			if (
				this.syncResults.find(
					(r) => r.component === "Git Repository" && r.status === "out_of_sync",
				)
			) {
				console.log('  1. git add . && git commit -m "同期用コミット"');
				console.log("  2. git pull origin main");
				console.log("  3. git push origin main");
			}

			if (
				this.syncResults.find(
					(r) => r.component === "Agent Config" && r.status === "out_of_sync",
				)
			) {
				console.log("  - agents.yamlの更新が必要です");
			}
		} else {
			console.log("\n✨ すべて同期されています！");
		}

		console.log(
			"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n",
		);
	}

	/**
	 * 同期チェック実行
	 */
	public async run(): Promise<void> {
		try {
			// 各チェックを実行
			this.checkGitStatus();
			this.checkAgentConfig();
			this.checkDataFiles();
			this.checkWorkflows();

			// レポート生成
			this.generateReport();

			// 終了コード
			const hasOutOfSync = this.syncResults.some(
				(r) => r.status === "out_of_sync",
			);
			process.exit(hasOutOfSync ? 1 : 0);
		} catch (error) {
			console.error("❌ 同期チェック中にエラーが発生しました:", error);
			process.exit(1);
		}
	}
}

// メイン実行
async function main() {
	const checker = new SyncChecker();
	await checker.run();
}

// ESモジュール形式のスクリプト実行チェック
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

export { SyncChecker };
