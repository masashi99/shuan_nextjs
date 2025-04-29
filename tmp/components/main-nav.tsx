"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Settings, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()

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
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 overflow-x-auto pb-2">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            asChild
            className="justify-start whitespace-nowrap"
          >
            <Link href={item.href} className="flex items-center">
              <Icon className="h-4 w-4 mr-2" />
              {item.name}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
