'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// 定义DashboardBreadcrumb组件
const DashboardBreadcrumb = () => {
  // 获取当前路径
  const pathname = usePathname()
  // 将路径分割成段，并过滤掉空段
  const pathSegments = pathname.split('/').filter(segment => segment !== '')

  // 只获取最后一个路径段
  const currentPage = pathSegments[pathSegments.length - 1]
  
  // 首字母大写
  const CurrentPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1)

  // 渲染面包屑导航
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        {/* 侧边栏触发器 */}
        <SidebarTrigger className="-ml-1" />
        {/* 垂直分隔线 */}
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* 面包屑导航 */}
        <Breadcrumb>
          <BreadcrumbList>
            {/* Dashboard链接 */}
            <BreadcrumbItem>
              <Link href="/dashboard" className="breadcrumb-link" tabIndex={0}>
                Dashboard
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* 动态生成的面包屑项 */}
            <BreadcrumbItem>
              <BreadcrumbPage>{CurrentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

export default DashboardBreadcrumb
