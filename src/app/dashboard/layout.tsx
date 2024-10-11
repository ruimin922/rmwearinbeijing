import React from 'react'
import Header from '@/components/Header'

const dashboardNavItems = [
  { href: "/dashboard", label: "主页" },
  { href: "/dashboard/flexsvg", label: "生成" },
  { href: "/dashboard/templates", label: "创作" },
  { href: "/dashboard/assets", label: "广场" },
  { href: "/dashboard/settings", label: "设置" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1D1D35]">
      <Header 
        navItems={dashboardNavItems}
        position="fixed"
        bgColor="bg-white"
        textColor="text-[#1D1D35]"
      />
      <div className="flex">
        {/* 如果需要侧边栏，可以在这里添加 */}
        <main className="flex-1 p-6 mt-14">
          {children}
        </main>
      </div>
    </div>
  )
}
