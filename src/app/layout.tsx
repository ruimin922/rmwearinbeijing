import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { zhCN } from '@clerk/localizations'
import Link from 'next/link'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flux Wallpaper Generator",
  description: "Generate Flux Wallpaper with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={zhCN}>
      <html lang="zh-CN" className="h-full">
        <body className={`${inter.className} h-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200`}>
          <div className="h-full flex">
            <SignedIn>
              <aside className="w-16 bg-white shadow-md flex flex-col items-center justify-between py-4">
                <div className="flex flex-col items-center space-y-4">
                  <Link href="/">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="40" rx="8" fill="#4A90E2"/>
                      <path d="M20 8L28 16L20 24L12 16L20 8Z" fill="white"/>
                      <path d="M20 16L28 24L20 32L12 24L20 16Z" fill="#E0E0E0"/>
                    </svg>
                  </Link>
                </div>
                <UserButton afterSignOutUrl="/" />
              </aside>
            </SignedIn>
            <div className="flex-1 overflow-auto">
              <main className="container mx-auto p-4 max-w-7xl">
                <SignedIn>
                  {children}
                </SignedIn>
                <SignedOut>
                  {children}
                </SignedOut>
              </main>
            </div>
          </div>
          {/* <footer className="p-4 text-center text-gray-600 bg-white border-t">
            <div className="container mx-auto">
              © 2024 Flux Wallpaper Generator. 保留所有权利。
            </div>
          </footer> */}
        </body>
      </html>
    </ClerkProvider>
  )
}