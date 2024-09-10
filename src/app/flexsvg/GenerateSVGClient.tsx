'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaPaperPlane, FaArrowLeft, FaCog } from 'react-icons/fa'
import { Loader2 } from "lucide-react"
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CodeProps } from 'react-markdown/lib/ast-to-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface GenerateSVGClientProps {
  userId: string
}

const defaultSysPrompt = `;; 作者：李继刚
;; 版本: 0.7
;; 模型: claude sonnet
;; 用途: 多角度深度理解一个概念

// ... 此处省略原有的 sysPrompt 内容
`

export default function GenerateSVGClient({ userId }: GenerateSVGClientProps) {
  const [query, setQuery] = useState('')
  const [markdownContent, setMarkdownContent] = useState('')
  const [svgCode, setSvgCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const markdownRef = useRef<HTMLDivElement>(null)
  const [sysPrompt, setSysPrompt] = useState(defaultSysPrompt)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [tempSysPrompt, setTempSysPrompt] = useState(sysPrompt)

  const generateSVG = useCallback(async (prompt: string) => {
    setIsLoading(true)
    setError(null)
    setMarkdownContent('')
    setSvgCode('')

    try {
      const response = await fetch('/api/gen-svg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          userId,
          sysPrompt
        })
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

        // 尝试提取 SVG 代码
        const svgMatch = accumulatedContent.match(/<svg[\s\S]*?<\/svg>/i)
        if (svgMatch) {
          setSvgCode(svgMatch[0])
        }

        // 自动滚动到底部
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
  }, [userId, sysPrompt])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      generateSVG(query)
      setQuery('')
    }
  }, [query, generateSVG])

  const handleSaveSettings = () => {
    setSysPrompt(tempSysPrompt)
    setIsSettingsOpen(false)
    toast.success('系统提示已更新')
  }

  return (
    <main className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-grow overflow-hidden flex gap-4">
        <Card className="w-1/2 overflow-hidden">
          <CardHeader>
            <CardTitle>生成结果</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] overflow-auto" ref={markdownRef}>
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 text-gray-800" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mb-3 text-gray-700" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-medium mb-2 text-gray-600" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 text-gray-600 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-gray-600" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-gray-600" {...props} />,
                li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600" {...props} />,
                code({ inline, className, children, ...props }: CodeProps) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-200 rounded px-1 py-0.5 text-sm text-gray-800" {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </CardContent>
        </Card>
        <Card className="w-1/2 overflow-hidden">
          <CardHeader>
            <CardTitle>SVG 预览</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] flex items-center justify-center">
            {svgCode && <div dangerouslySetInnerHTML={{ __html: svgCode }} />}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
              <FaArrowLeft className="mr-2" />
              返回主页
            </Link>
            <h2 className="text-2xl font-bold text-gray-800">Flex SVG 生成器</h2>
            <div className="flex-grow flex items-center gap-2">
              <form onSubmit={handleSubmit} className="flex-grow flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="描述你想要的 SVG 图像..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FaPaperPlane className="mr-2 h-4 w-4" />}
                  {isLoading ? '生成中...' : '生成'}
                </Button>
              </form>
              <Button onClick={() => setIsSettingsOpen(true)}>
                <FaCog className="mr-2 h-4 w-4" />
                设置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>系统提示设置</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={tempSysPrompt}
              onChange={(e) => setTempSysPrompt(e.target.value)}
              rows={15}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSaveSettings}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}