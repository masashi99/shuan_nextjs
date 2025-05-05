import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import { MainNav } from "@/components/main-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "授業スケジュール管理",
	description: "授業、課題、学習時間を管理するアプリケーション",
	generator: "v0.dev",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={inter.className}>
				<div className="flex flex-col min-h-screen">
					<header className="border-b">
						<div className="container mx-auto py-4 px-4">
							<div className="flex justify-between items-center">
								<h1 className="text-xl font-bold">授業スケジュール管理</h1>
								<MainNav />
							</div>
						</div>
					</header>
					<main className="flex-1 py-6">
						<div className="container mx-auto px-4">{children}</div>
					</main>
				</div>
			</body>
		</html>
	);
}
