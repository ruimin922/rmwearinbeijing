'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaPaperPlane, FaArrowLeft, FaCog, FaExpand, FaTimes } from 'react-icons/fa'
import { Loader2 } from "lucide-react"
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { CodeProps } from 'react-markdown/lib/ast-to-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { PromptList } from '@/components/PromptList'
import { Prompt } from '@/types/prompt'

interface GenerateSVGClientProps {
  userId: string
}

const defaultSysPrompt = ''

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
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activePromptId, setActivePromptId] = useState<string | null>(null)
  const [showSVGPreview, setShowSVGPreview] = useState(false)

  const fetchPrompts = useCallback(async () => {
    try {
      const response = await fetch(`/api/prompts?userId=${parseInt(userId)}`)
      if (response.ok) {
        const data = await response.json()
        setPrompts(data)
        const activePrompt = data.find((prompt: Prompt) => prompt.isActive)
        if (activePrompt) {
          setActivePromptId(activePrompt.id)
          setSysPrompt(activePrompt.content)
        }
      }
    } catch (error) {
      console.error('获取提示词失败:', error)
      toast.error('获取提示词失败')
    }
  }, [userId])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  const handleSavePrompt = async (prompt: Prompt) => {
    try {
      const method = prompt.id ? 'PUT' : 'POST'
      const response = await fetch('/api/prompts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prompt, userId: parseInt(userId) }),
      })
      if (response.ok) {
        fetchPrompts()
        toast.success(prompt.id ? '提示词更新成功' : '提示词创建成功')
      }
    } catch (error) {
      console.error('保存提示词失败:', error)
      toast.error('保存提示词失败')
    }
  }

  const handleDeletePrompt = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompts?id=${promptId}`, { method: 'DELETE' })
      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(`删除提示词失败: ${responseData.error || '未知错误'}`)
      }
      await fetchPrompts()
      setPrompts(prevPrompts => prevPrompts.filter(prompt => prompt.id !== promptId))
      toast.success('提示词删除成功')
    } catch (error) {
      toast.error(`删除提示词失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  const handleActivatePrompt = async (promptId: string) => {
    try {
      const response = await fetch(`/api/prompts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promptId, userId: parseInt(userId) }),
      })
      if (response.ok) {
        await fetchPrompts()
        toast.success('提示词已激活')
      } else {
        throw new Error('激活提示词失败')
      }
    } catch (error) {
      toast.error('激活提示词失败')
    }
  }

  const generateSVG = useCallback(async (prompt: string) => {
    setIsLoading(true)
    setError(null)
    setMarkdownContent('')
    setSvgCode('')
    setShowSVGPreview(false)

    try {
      const response = await fetch('/api/gen-svg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: prompt, userId, sysPrompt })
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
          setSvgCode(svgMatches[svgMatches.length - 1])
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

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  const SVGPreview = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-[90%] h-[90%] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">SVG 预览</h3>
          <Button variant="ghost" size="icon" onClick={() => setShowSVGPreview(false)}>
            <FaTimes className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-grow overflow-auto">
          {svgCode ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-[80%] h-[80%]" dangerouslySetInnerHTML={{ __html: svgCode.replace(/<svg/, '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet"') }} />
            </div>
          ) : (
            <div className="text-gray-500">等待生成 SVG...</div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <main className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-grow overflow-hidden">
        <Card className="w-full h-full overflow-hidden">
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
                      className="rounded-md"
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
            {svgCode && (
              <div 
                className="w-64 h-28 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer"
                onClick={() => setShowSVGPreview(true)}
              >
                <span className="text-gray-600">点击查看 SVG</span>
              </div>
            )}
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
              <Button onClick={() => setIsSheetOpen(true)}>
                <FaCog className="mr-2 h-4 w-4" />
                设置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-1/3">
          <SheetHeader>
            <SheetTitle>提示词管理</SheetTitle>
          </SheetHeader>
          <PromptList
            prompts={prompts}
            activePromptId={activePromptId}
            onSave={handleSavePrompt}
            onDelete={handleDeletePrompt}
            onActivate={handleActivatePrompt}
          />
          <SheetFooter>
            <Button onClick={() => setIsSheetOpen(false)}>关闭</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {showSVGPreview && <SVGPreview />}
    </main>
  )
}