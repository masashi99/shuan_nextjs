"use client";

import { BookOpen, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
	const pathname = usePathname();

	const navItems = [
		{
			name: "スケジュール",
			href: "/",
			icon: Calendar,
		},
		{
			name: "授業設定",
			href: "/class-settings",
			icon: Settings,
		},
		{
			name: "単元設定",
			href: "/unit-settings",
			icon: BookOpen,
		},
	];

	return (
		<div className="w-64 border-r bg-white">
			<nav className="flex flex-col p-4 space-y-4">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname === item.href;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center p-2 rounded-md ${
								isActive
									? "bg-primary text-primary-foreground"
									: "hover:bg-gray-100"
							}`}
						>
							<Icon className="h-5 w-5 mr-3" />
							<span>{item.name}</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
