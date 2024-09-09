'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user, logout, isLoading } = useAuth()
  const text = "FlexInterface Generate Everything"

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="py-4 px-8 flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold text-gray-800">FlexInterface</span>
        </Link>
        <div className="space-x-4">
          {isLoading ? (
            <span>加载中...</span>
          ) : user ? (
            <>
              <span className="text-gray-600">欢迎，{user.email}</span>
              <Button onClick={logout} variant="outline" className="text-sm">登出</Button>
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
      
      <main className="flex-grow flex flex-col items-center justify-center p-24">
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
          使用我们的先进AI技术，轻松生成令人惊叹的图片和UI界面。释放您的创造力，让设计变得简单而有趣。
        </p>
        <div className="flex space-x-8">
          <Link href="/fleximage">
            <Button className="text-lg px-8 py-4">生成图片</Button>
          </Link>
          <Link href="/flexui">
            <Button className="text-lg px-8 py-4">生成 UI</Button>
          </Link>
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500">
        © 2023 FlexInterface. 保留所有权利。
      </footer>
    </div>
  )
}