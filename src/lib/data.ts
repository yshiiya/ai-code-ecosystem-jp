// AIコーディングツールのデータ
export const tools = [
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
		description: "世界で最も広く採用されているAI開発者ツール。マルチモデル対応",
		pricing: "$10/月〜",
		tags: ["IDE統合", "マルチモデル", "無料プランあり"],
	},
	{
		id: "cursor",
		name: "Cursor",
		category: "独立IDE",
		description: "VS Codeをフォークして作られたAIファーストのコードエディタ",
		pricing: "$20/月",
		tags: ["独立IDE", "Tab補完", "Composer"],
	},
	{
		id: "windsurf",
		name: "Windsurf",
		category: "独立IDE",
		description: "OpenAIが買収したAIネイティブエディタ。Cascade機能が特徴",
		pricing: "$10/月",
		tags: ["独立IDE", "Flows", "OpenAI"],
	},
	{
		id: "cline",
		name: "Cline",
		category: "VS Code拡張",
		description: "オープンソースの自律型AIコーディングエージェント",
		pricing: "無料",
		tags: ["オープンソース", "透明性", "マルチモデル"],
	},
	{
		id: "aider",
		name: "Aider",
		category: "CLI",
		description:
			"ターミナルで動作するAIペアプログラミングツール。Git統合が優秀",
		pricing: "無料",
		tags: ["CLI", "Git統合", "オープンソース"],
	},
	{
		id: "continue-dev",
		name: "Continue.dev",
		category: "IDE拡張",
		description: "オープンソースのAI開発アシスタント。ローカルLLM対応",
		pricing: "無料",
		tags: ["オープンソース", "ローカルLLM", "プライバシー"],
	},
	{
		id: "codeium",
		name: "Codeium",
		category: "IDE拡張",
		description: "無料で使える高速AI補完ツール。70以上の言語に対応",
		pricing: "無料〜",
		tags: ["高速補完", "無料", "多言語対応"],
	},
	{
		id: "amazon-q",
		name: "Amazon Q Developer",
		category: "IDE拡張",
		description: "AWSが提供するエンタープライズ向けAI開発アシスタント",
		pricing: "$19/月",
		tags: ["AWS統合", "セキュリティ", "エンタープライズ"],
	},
	{
		id: "openai-codex",
		name: "OpenAI Codex",
		category: "API/Web",
		description:
			"OpenAIの高性能コード生成AI。ChatGPT内のCode Interpreterとして利用可能",
		pricing: "ChatGPT料金",
		tags: ["コード生成", "実行環境", "API"],
	},
	{
		id: "gemini-cli",
		name: "Gemini CLI",
		category: "CLI",
		description:
			"GoogleのGemini AIをコマンドラインから利用。マルチモーダル対応で画像解析も可能",
		pricing: "無料〜",
		tags: ["CLI", "画像処理", "マルチモーダル"],
	},
	{
		id: "tabnine",
		name: "Tabnine",
		category: "IDE拡張",
		description:
			"プライベートAI学習対応のコード補完ツール。エンタープライズ向け機能充実",
		pricing: "$12/月〜",
		tags: ["プライベートAI", "エンタープライズ", "補完特化"],
	},
];

// MCPサーバーのデータ
export const mcpServers = [
	{
		id: "github-mcp",
		name: "GitHub MCP",
		category: "開発ツール",
		description: "GitHub API統合でリポジトリ、Issue、PR操作",
		status: "stable",
	},
	{
		id: "filesystem-mcp",
		name: "Filesystem MCP",
		category: "ファイル操作",
		description: "ローカルファイルシステムの安全な操作",
		status: "stable",
	},
	{
		id: "memory-mcp",
		name: "Memory MCP",
		category: "データ管理",
		description: "知識とコンテキストの永続化",
		status: "stable",
	},
	{
		id: "slack-mcp",
		name: "Slack MCP",
		category: "コミュニケーション",
		description: "Slackワークスペースとの連携",
		status: "stable",
	},
	{
		id: "postgresql-mcp",
		name: "PostgreSQL MCP",
		category: "データベース",
		description: "PostgreSQLデータベース操作",
		status: "community",
	},
];

// CLIツールのデータ
export const cliTools = [
	{
		id: "iterm2",
		name: "iTerm2",
		category: "ターミナル",
		description: "Mac最強のターミナルエミュレータ",
		os: ["mac"],
	},
	{
		id: "warp",
		name: "Warp",
		category: "ターミナル",
		description: "AI搭載の次世代ターミナル",
		os: ["mac"],
	},
	{
		id: "gh-cli",
		name: "GitHub CLI",
		category: "Git",
		description: "GitHub操作をCLIで完結",
		os: ["mac", "windows", "linux"],
	},
	{
		id: "lazygit",
		name: "lazygit",
		category: "Git",
		description: "TUIでGit操作を効率化",
		os: ["mac", "windows", "linux"],
	},
	{
		id: "fzf",
		name: "fzf",
		category: "検索",
		description: "ファジー検索ツール",
		os: ["mac", "windows", "linux"],
	},
	{
		id: "ripgrep",
		name: "ripgrep",
		category: "検索",
		description: "超高速grep代替",
		os: ["mac", "windows", "linux"],
	},
];
