'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

// 这是示例数据
const mockData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "首页",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "生成",
      url: "/dashboard/flexsvg",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "创作",
      url: "/dashboard/create",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "设置",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "首页",
      url: "/",
      icon: Home,
    },
    {
      name: "工作台",
      url: "/dashboard",
      icon: Frame,
    },
    {
      name: "生成",
      url: "/dashboard/flexsvg",
      icon: PieChart,
    },
    {
      name: "创作",
      url: "/dashboard/create",
      icon: Map,
    },
    {
      name: "广场",
      url: "/dashboard/square",
      icon: Map,
    },
    {
      name: "设置",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
}

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItemsWithActiveState = mockData.navMain.map(item => ({
    ...item,
    isActive: pathname === item.url
  }))

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#1D1D35] w-full">
        <DashboardSidebar data={mockData} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardBreadcrumb />
          <main className="flex-1 overflow-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
