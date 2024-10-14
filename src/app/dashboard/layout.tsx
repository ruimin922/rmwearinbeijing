'use client'

import React from 'react'
import Header from '@/components/Header'
import { usePathname } from 'next/navigation'

const dashboardNavItems = [
  { href: "/dashboard", label: "主页" },
  { href: "/dashboard/flexsvg", label: "生成" },
  { href: "/dashboard/create", label: "创作" },
  { href: "/dashboard/square", label: "广场" },
  { href: "/dashboard/settings", label: "设置" },
]

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItemsWithActiveState = dashboardNavItems.map(item => ({
    ...item,
    isActive: pathname === item.href
  }))

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-[#1D1D35]">
      <Header 
        navItems={navItemsWithActiveState}
        position="fixed"
        bgColor="bg-white"
        textColor="text-[#1D1D35]"
      />
      <main className="flex-1 mt-14">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
