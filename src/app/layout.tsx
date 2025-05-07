import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
	title: "授業スケジュール管理",
	description: "授業、課題、学習時間を管理するアプリケーション",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body>
				<Header />
				<div className="flex min-h-screen">
					<AppSidebar />
					<main className="flex-1 pr-8">{children}</main>
				</div>
			</body>
		</html>
	);
}
