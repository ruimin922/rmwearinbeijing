'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent } from "@/components/ui/card"
import { SignInButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [isMobile, setIsMobile] = useState(false)
  const text = "FlexSVG 设计不同的 SVG"

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    <div className="min-h-screen overflow-auto">
      <div className="flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="text-center mb-8 sm:mb-12">
          <motion.h1 
            className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4 sm:mb-6"
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
          
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-10 max-w-xl sm:max-w-2xl mx-auto">
            使用我们的先进AI技术，轻松生成令人惊叹的SVG图像。从简单的图形到复杂的插图，释放您的创造力，让SVG设计变得简单而有趣。
          </p>
          
          {isSignedIn ? (
            <Link href="/flexsvg">
              <Button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 mb-8 sm:mb-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg transform transition hover:scale-105">
                开始创作
              </Button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <Button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 mb-8 sm:mb-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full shadow-lg transform transition hover:scale-105">
                登录以开始创作
              </Button>
            </SignInButton>
          )}
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {svgExamples.map((example, index) => (
            <Card key={index} className="overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">{example.title}</h3>
                <div className="flex justify-center items-center h-24 sm:h-32 bg-gray-100 rounded-lg" dangerouslySetInnerHTML={{ __html: example.svg }} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}