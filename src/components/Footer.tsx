import Link from "next/link";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-gray-300 mt-20">
			<div className="container mx-auto px-4 max-w-7xl py-12">
				<div className="grid md:grid-cols-4 gap-8">
					{/* About */}
					<div>
						<h3 className="text-white font-semibold mb-4">About</h3>
						<p className="text-sm">
							AI Code Ecosystem
							Japanは、AIコーディングツールの情報を日本語で提供する総合情報サイトです。
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/tools" className="hover:text-white transition">
									AIツール一覧
								</Link>
							</li>
							<li>
								<Link href="/mcp" className="hover:text-white transition">
									MCP情報
								</Link>
							</li>
							<li>
								<Link href="/cli" className="hover:text-white transition">
									CLIツール
								</Link>
							</li>
							<li>
								<Link href="/guides" className="hover:text-white transition">
									ガイド
								</Link>
							</li>
						</ul>
					</div>

					{/* Resources */}
					<div>
						<h3 className="text-white font-semibold mb-4">Resources</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link
									href="/guides/getting-started"
									className="hover:text-white transition"
								>
									はじめ方ガイド
								</Link>
							</li>
							<li>
								<Link href="/faq" className="hover:text-white transition">
									よくある質問
								</Link>
							</li>
							<li>
								<Link href="/roadmap" className="hover:text-white transition">
									ロードマップ
								</Link>
							</li>
							<li>
								<Link
									href="/contribute"
									className="hover:text-white transition"
								>
									貢献する
								</Link>
							</li>
						</ul>
					</div>

					{/* Connect */}
					<div>
						<h3 className="text-white font-semibold mb-4">Connect</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="https://github.com/yourusername/ai-code-ecosystem-jp"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-white transition"
								>
									GitHub
								</a>
							</li>
							<li>
								<a
									href="https://twitter.com/aicode_jp"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-white transition"
								>
									Twitter
								</a>
							</li>
							<li>
								<a
									href="https://discord.gg/aicode-jp"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-white transition"
								>
									Discord
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
					<p>© {currentYear} AI Code Ecosystem Japan. All rights reserved.</p>
					<p className="mt-2">
						Made with ❤️ for the Japanese developer community
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
