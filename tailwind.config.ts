import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					50: "#f0f9ff",
					100: "#e0f2fe",
					200: "#bae6fd",
					300: "#7dd3fc",
					400: "#38bdf8",
					500: "#0ea5e9",
					600: "#0284c7",
					700: "#0369a1",
					800: "#075985",
					900: "#0c4a6e",
					950: "#082f49",
				},
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: "none",
						color: "#334155",
						a: {
							color: "#0ea5e9",
							"&:hover": {
								color: "#0284c7",
							},
						},
						pre: {
							backgroundColor: "#111827",
							color: "#f3f4f6",
						},
						"pre code": {
							backgroundColor: "transparent",
							color: "#f3f4f6",
						},
						code: {
							backgroundColor: "#f3f4f6",
							color: "#111827",
							padding: "0.125rem 0.25rem",
							borderRadius: "0.25rem",
							fontWeight: "400",
						},
						"code::before": {
							content: '""',
						},
						"code::after": {
							content: '""',
						},
					},
				},
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};

export default config;
