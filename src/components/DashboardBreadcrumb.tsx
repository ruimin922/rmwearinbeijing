'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const DashboardBreadcrumb = () => {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(segment => segment !== '')

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join('/')}`
    const isLast = index === pathSegments.length - 1

    return (
      <React.Fragment key={segment}>
        <BreadcrumbItem>
          {isLast ? (
            <BreadcrumbPage>{segment}</BreadcrumbPage>
          ) : (
            <Link href={href} className="breadcrumb-link" tabIndex={0}>
              {segment}
            </Link>
          )}
        </BreadcrumbItem>
        {!isLast && <BreadcrumbSeparator />}
      </React.Fragment>
    )
  })

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/dashboard" className="breadcrumb-link" tabIndex={0}>
                Dashboard
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {breadcrumbItems}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

export default DashboardBreadcrumb
