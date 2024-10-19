'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/DashboardSidebar"
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb"



function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#1D1D35] w-full">
        <AppSidebar />
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
