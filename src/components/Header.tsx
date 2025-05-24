import React from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  isActive: boolean
}

interface HeaderProps {
  navItems: NavItem[]
  position: string
  bgColor: string
  textColor: string
  logoSrc?: string
  logoAlt?: string
}

function Header({
  navItems,
  position = 'sticky',
  bgColor = 'bg-white',
  textColor = 'text-[#4A90E2]',
  logoSrc = '/logo.svg',
  logoAlt = 'FlexSVG logo'
}: HeaderProps) {
  return (
    <header className={`${position} top-0 z-50 w-full border-b border-flexsvg-blue/10 ${bgColor}/95 backdrop-blur supports-[backdrop-filter]:${bgColor}/60`}>
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-7 h-7 text-[#333]" />
              <span className="font-extrabold text-lg tracking-tight">WearInBeijing</span>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-[#a6192e] ${textColor}/60 ${item.isActive ? 'text-[#a6192e] font-bold' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-gradient-to-r from-flexsvg-blue to-flexsvg-green hover:from-flexsvg-blue/80 hover:to-flexsvg-green/80 text-white">
                Get started
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header