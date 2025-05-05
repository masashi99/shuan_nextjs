import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";

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
				<div className="flex min-h-screen">
					<AppSidebar />
					<main className="flex-1 p-6">{children}</main>
				</div>
			</body>
		</html>
	);
}
