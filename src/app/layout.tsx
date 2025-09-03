import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AI Code Ecosystem Japan",
	description: "AIコーディングツールとエコシステムの日本語総合情報サイト",
	keywords:
		"AI, コーディング, Claude Code, GitHub Copilot, Cursor, MCP, 日本語",
	authors: [{ name: "AI Code Ecosystem Japan Team" }],
	openGraph: {
		title: "AI Code Ecosystem Japan",
		description: "AIコーディングツールとエコシステムの日本語総合情報サイト",
		url: "https://ai-code-ecosystem.jp",
		siteName: "AI Code Ecosystem Japan",
		locale: "ja_JP",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Code Ecosystem Japan",
		description: "AIコーディングツールとエコシステムの日本語総合情報サイト",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body className={`${inter.className} min-h-screen bg-gray-50`}>
				<Header />
				<main className="container mx-auto px-4 py-8 max-w-7xl">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
