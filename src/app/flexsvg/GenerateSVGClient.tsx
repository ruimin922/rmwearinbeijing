'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaPaperPlane, FaArrowLeft, FaCog, FaImage } from 'react-icons/fa'
import { Loader2 } from "lucide-react"
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { CodeProps } from 'react-markdown/lib/ast-to-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from '@clerk/nextjs'
import { SVGPreview } from '@/components/SVGPreview'
import { PromptManager } from '@/components/PromptManager'

const defaultSysPrompt = ''

export default function GenerateSVGClient() {
  const { user } = useUser()
  const [query, setQuery] = useState('')
  const [markdownContent, setMarkdownContent] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const markdownRef = useRef<HTMLDivElement>(null)
  const [sysPrompt, setSysPrompt] = useState(defaultSysPrompt)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showSVGPreview, setShowSVGPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const generateSVG = useCallback(async (prompt: string) => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    setMarkdownContent('')
    setSvgCode('')
    setShowSVGPreview(false)

    try {
      const response = await fetch('/api/gen-svg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt, userId: user.id, sysPrompt })
      })

      if (!response.ok) throw new Error('请求失败')
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('无法读取响应流')

      const decoder = new TextDecoder()
      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        accumulatedContent += chunk
        setMarkdownContent(accumulatedContent)

        const svgMatches = accumulatedContent.match(/<svg[\s\S]*?<\/svg>/gi)
        if (svgMatches?.length) {
          const latestSVG = svgMatches[svgMatches.length - 1]
          setSvgCode(latestSVG)
          setShowSVGPreview(true)
        }

        if (markdownRef.current) {
          markdownRef.current.scrollTop = markdownRef.current.scrollHeight
        }
      }

      toast.success('SVG 生成成功')
    } catch (error) {
      console.error('生成 SVG 时出错:', error)
      setError(error instanceof Error ? error.message : '生成 SVG 时发生未知错误')
      toast.error('生成 SVG 失败')
    } finally {
      setIsLoading(false)
    }
  }, [user, sysPrompt])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      generateSVG(query)
      setQuery('')
    }
  }, [query, generateSVG])

  return (
    <div className="flex flex-col h-full overflow-hidden p-2 sm:p-4">
      <div className="flex-grow overflow-hidden flex flex-col">
        <Card className="flex-grow flex flex-col overflow-hidden mb-2">
          <CardHeader>
            <CardTitle>生成结果</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto" ref={markdownRef}>
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-blue-300" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-blue-400" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg sm:text-xl font-medium mb-2 text-blue-500" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3 sm:mb-4 text-gray-500 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-4 sm:pl-5 mb-3 sm:mb-4 text-gray-500" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 sm:pl-5 mb-3 sm:mb-4 text-gray-500" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1 sm:mb-2" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-3 sm:pl-4 italic my-3 sm:my-4 text-gray-600" {...props} />,
                code({ inline, className, children, ...props }: CodeProps) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isSVG = String(children).trim().startsWith('<svg')
                  return !inline && (match || isSVG) ? (
                    <SyntaxHighlighter
                      {...props}
                      style={vscDarkPlus}
                      language={isSVG ? 'svg' : match ? match[1] : 'text'}
                      PreTag="div"
                      className="rounded-md bg-gray-900 p-3 sm:p-4 my-3 sm:my-4 text-sm sm:text-base"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-700 rounded px-1 py-0.5 text-xs sm:text-sm text-blue-300" {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {markdownContent}
            </ReactMarkdown>
            {svgCode && (
              <Button 
                className="w-full sm:w-36 h-18 bg-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors duration-200 mb-4"
                onClick={() => setShowSVGPreview(true)}
              >
                <FaImage className="text-blue-400 text-xl mr-2" />
                <span className="text-sm">查看SVG</span>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="flex-shrink-0">
          <CardContent className="p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex w-full items-center gap-2">
                <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
                  <FaArrowLeft className="mr-2" />
                </Link>
                <Input
                  type="text"
                  placeholder="描述你想要的 SVG 图像..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow"
                  disabled={isLoading}
                />
                <div className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0">
                  <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
                    {isLoading ? 
                      <Loader2 className="h-4 w-4 animate-spin" /> : 
                      <FaPaperPlane className="h-4 w-4" />
                    }
                    <span className="hidden sm:inline ml-2">
                      {isLoading ? '生成中...' : '生成'}
                    </span>
                  </Button>
                  <Button onClick={() => setIsSheetOpen(true)} className="flex-1 sm:flex-none">
                    <FaCog className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <PromptManager
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSysPromptChange={setSysPrompt}
        isMobile={isMobile}
      />

      {showSVGPreview && <SVGPreview svgCode={svgCode} onClose={() => setShowSVGPreview(false)} />}
    </div>
  )
}
