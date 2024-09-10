'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const { data: session, status } = useSession()
  const text = "FlexSVG 设计不同的 SVG"

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  const svgExamples = [
    { title: "简单图形", svg: '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>' },
    { title: "图标", svg: '<svg width="100" height="100"><path d="M10 10 H 90 V 90 H 10 L 10 10" fill="transparent" stroke="black"/></svg>' },
    { title: "插图", svg: '<svg width="100" height="100"><rect width="100" height="100" fill="skyblue"/><circle cx="50" cy="50" r="30" fill="yellow"/></svg>' },
    { title: "Logo", svg: '<svg width="100" height="100"><text x="10" y="50" font-family="Arial" font-size="20" fill="blue">Logo</text></svg>' },
    { title: "动画", svg: '<svg width="100" height="100"><rect width="20" height="20" fill="purple"><animate attributeName="x" from="0" to="80" dur="2s" repeatCount="indefinite" /></rect></svg>' },
    { title: "图表", svg: '<svg width="100" height="100"><line x1="0" y1="80" x2="100" y2="80" stroke="black"/><rect x="10" y="30" width="20" height="50" fill="green"/><rect x="40" y="20" width="20" height="60" fill="blue"/><rect x="70" y="40" width="20" height="40" fill="red"/></svg>' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="py-4 px-8 flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold text-gray-800">FlexSVG</span>
        </Link>
        <div className="space-x-4">
          {status === 'loading' ? (
            <span>加载中...</span>
          ) : session ? (
            <>
              <span className="text-gray-600">欢迎，{session.user?.email}</span>
              <Button onClick={() => signOut()} variant="outline" className="text-sm">登出</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="text-sm">登录</Button>
              </Link>
              <Link href="/register">
                <Button className="text-sm">注册</Button>
              </Link>
            </>
          )}
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center p-8">
        <motion.h1 
          className="text-5xl font-bold text-gray-800 mb-8 text-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {text.split("").map((char, index) => (
            <motion.span key={char + "-" + index} variants={child}>
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
          使用我们的先进AI技术，轻松生成令人惊叹的SVG图像。从简单的图形到复杂的插图，释放您的创造力，让SVG设计变得简单而有趣。
        </p>
        <Link href="/flexsvg">
          <Button className="text-lg px-8 py-4 mb-16">开始创作</Button>
        </Link>

        <div className="w-full max-w-6xl grid grid-cols-3 gap-8">
          {svgExamples.map((example, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">{example.title}</h3>
                <div className="flex justify-center items-center h-32 bg-white rounded-lg" dangerouslySetInnerHTML={{ __html: example.svg }} />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500">
        © 2023 FlexSVG. 保留所有权利。
      </footer>
    </div>
  )
}