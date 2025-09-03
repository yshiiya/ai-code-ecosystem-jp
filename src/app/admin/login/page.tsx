"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { InputValidator } from "@/lib";

interface LoginState {
	password: string;
	error: string;
	isLoading: boolean;
	attempts: number;
	lockoutUntil?: number;
}

export default function AdminLogin() {
	const [state, setState] = useState<LoginState>({
		password: "",
		error: "",
		isLoading: false,
		attempts: 0
	});
	
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);

	// レート制限チェック（3回失敗で30秒ロックアウト）
	const checkLockout = (): boolean => {
		if (state.lockoutUntil && Date.now() < state.lockoutUntil) {
			const remainingSeconds = Math.ceil((state.lockoutUntil - Date.now()) / 1000);
			setState(prev => ({
				...prev,
				error: `ログインが一時的に制限されています。${remainingSeconds}秒後に再試行してください。`
			}));
			return false;
		}
		return true;
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!checkLockout()) return;

		// 入力値の基本検証
		if (!state.password.trim()) {
			setState(prev => ({ ...prev, error: "パスワードを入力してください" }));
			return;
		}

		if (!InputValidator.validateLength(state.password, 1, 256)) {
			setState(prev => ({ ...prev, error: "パスワードの長さが無効です" }));
			return;
		}

		setState(prev => ({ ...prev, isLoading: true, error: "" }));

		try {
			const response = await fetch("/api/auth/admin", {
				method: "POST",
				headers: { 
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest" // CSRF対策の一環
				},
				body: JSON.stringify({ 
					password: state.password.trim(),
					timestamp: Date.now() // リプレイ攻撃対策
				}),
			});

			const result = await response.json();

			if (response.ok && result.success) {
				// ログイン成功時は状態をクリア
				setState({
					password: "",
					error: "",
					isLoading: false,
					attempts: 0
				});
				router.push("/admin/agents");
			} else {
				// ログイン失敗時の処理
				const newAttempts = state.attempts + 1;
				const shouldLockout = newAttempts >= 3;
				
				setState(prev => ({
					...prev,
					password: "", // セキュリティのためパスワードをクリア
					error: result.message || "認証に失敗しました",
					isLoading: false,
					attempts: newAttempts,
					lockoutUntil: shouldLockout ? Date.now() + 30000 : undefined // 30秒ロックアウト
				}));

				// フォームをリセット
				if (formRef.current) {
					formRef.current.reset();
				}
			}
		} catch (err) {
			setState(prev => ({
				...prev,
				password: "",
				error: "ネットワークエラーが発生しました。しばらく時間をおいて再試行してください。",
				isLoading: false
			}));
			
			if (formRef.current) {
				formRef.current.reset();
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						🔒 管理者ログイン
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						エージェント監視ダッシュボードにアクセス
					</p>
				</div>
				<form ref={formRef} className="mt-8 space-y-6" onSubmit={handleLogin}>
					<div>
						<label htmlFor="password" className="sr-only">
							パスワード
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
							placeholder="管理者パスワード"
							value={state.password}
							onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
							disabled={state.isLoading}
						/>
					</div>

					{state.error && (
						<div className="text-red-600 text-sm text-center" role="alert">
							{state.error}
						</div>
					)}

					{state.attempts > 0 && state.attempts < 3 && (
						<div className="text-yellow-600 text-sm text-center">
							残り試行回数: {3 - state.attempts}回
						</div>
					)}

					<div>
						<button
							type="submit"
							disabled={state.isLoading || Boolean(state.lockoutUntil && Date.now() < state.lockoutUntil)}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{state.isLoading ? "認証中..." : "ログイン"}
						</button>
					</div>
				</form>

				<div className="text-center">
					<Link href="/" className="text-primary-600 hover:underline text-sm">
						← サイトに戻る
					</Link>
				</div>
			</div>
		</div>
	);
}
