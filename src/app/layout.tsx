import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { zhCN } from '@clerk/localizations'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlexSVG - AI驱动的快速设计助理",
  description: "FlexSVG 是AI驱动的快速设计助理。轻松创作logo、动画、SVG，进行图片处理，比想象更简单。",
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