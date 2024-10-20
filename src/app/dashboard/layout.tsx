'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/DashboardSidebar"
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb"
import { ThemeProvider } from "@/components/ThemeProvider"

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background font-sans text-foreground w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardBreadcrumb />
            <main className="flex-1 overflow-auto w-full">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default DashboardLayout
