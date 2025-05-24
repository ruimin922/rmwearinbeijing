import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { zhCN } from '@clerk/localizations'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WearInBeijing - AI驱动的智能穿搭助手",
  description: "WearInBeijing 是AI驱动的智能穿搭助手。根据实时天气和您的衣柜，为您推荐最适合的穿搭方案。",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={zhCN}
    >
      <html lang="zh-CN" className="h-full" suppressHydrationWarning>
        <body className={`${inter.className} h-full`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}