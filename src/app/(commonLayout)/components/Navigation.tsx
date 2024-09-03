"use client";

import { usePathname } from "next/navigation";

import { NavButton } from "@/components/features/common";

const ROUTES = [
  {
    href: "/",
    label: "Overview",
  },
  { href: "/subjects", label: "教科" },
  { href: "/timetable", label: "時間割" },
];

export function Navigation() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-x-2">
      {ROUTES.map(({ href, label }) => (
        <NavButton
          key={href}
          href={href}
          label={label}
          isActive={pathname === href}
        />
      ))}
    </div>
  );
}
