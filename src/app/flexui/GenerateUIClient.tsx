'use client'

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaPaperPlane, FaCog, FaArrowLeft, FaCode, FaEye, FaHistory } from 'react-icons/fa'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import dynamic from 'next/dynamic'
import Link from 'next/link'
import ErrorBoundary from '@/components/ErrorBoundary'
import Cookies from 'js-cookie'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from 'react-hot-toast'

const ErrorComponent = ({ error }: { error: Error }) => (
  <Alert variant="destructive">
    <AlertTitle>组件加载错误</AlertTitle>
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)

const ErrorFallback = ({ error }: { error: Error }) => (
  <Alert variant="destructive">
    <AlertTitle>组件渲染错误</AlertTitle>
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)

interface ContainerSize {
  width: number
  height: number
}

interface GenerateUIClientProps {
  userId: string
  isNewUser: boolean
}

const SkeletonLoader = ({ progress }: { progress: number }) => (
  <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded-full w-3/4 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
      <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="flex space-x-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
        </div>
      </div>
    </div>
    <div className="mt-10">
      <Progress value={progress} className="w-full h-2" />
      <p className="text-center text-lg text-gray-600 mt-4 font-semibold">
        生成进度：{progress}%
      </p>
    </div>
  </div>
)

export default function GenerateUIClient({ userId, isNewUser }: GenerateUIClientProps) {
  const [component, setComponent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [containerSize, setContainerSize] = useState<ContainerSize>({
    width: 0,
    height: 0
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState(0)
  const [componentKey, setComponentKey] = useState(0)
  const [generatedCode, setGeneratedCode] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedCode, setEditedCode] = useState('')
  const [isTuning, setIsTuning] = useState(true)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<Array<{ query: string, code: string, timestamp: string }>>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current && inputRef.current) {
        const inputHeight = inputRef.current.offsetHeight
        setContainerSize({
          width: window.innerWidth,
          height: window.innerHeight - inputHeight
        })
      }
    }

    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)

    return () => window.removeEventListener('resize', updateContainerSize)
  }, [])


  const generateComponent = useCallback(async (prompt: string) => {
    setIsLoading(true)
    setError(null)
    setProgress(0)

    const sizeInfo = `预览区域尺寸：宽度 ${containerSize.width}px，度 ${containerSize.height}px。\n请确保生成的组件适应这个尺寸，不要超出或产生滚动条。\n现在的时间是：${new Date().toLocaleString()}`
    let fullPrompt = `${sizeInfo} ${prompt}`

    if (isTuning && generatedCode) {
      fullPrompt = `${sizeInfo}\n现有组件代码：\`\`\`\n${generatedCode}\`\`\`\n用户新需求：${prompt}\n请基于现有代码进行修改以满足新需求。`
    }

    console.log('fullPrompt:', fullPrompt)

    const startTime = Date.now()
    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime
      const newProgress = Math.min(Math.floor((elapsedTime / 20000) * 100), 99)
      setProgress(newProgress)
    }, 200)

    try {
      const res = await fetch('/api/gen-ui', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: fullPrompt,
          userId
        })
      })
      if (!res.ok) throw new Error('请求失败')
      const data = await res.json()
      setComponent(data.componentPath)
      setComponentKey(prevKey => prevKey + 1)
      setGeneratedCode(data.code)
      setEditedCode(data.code)

      await fetch('/api/log-ui-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          query,
          code: data.code,
        }),
      })
      fetchHistory()
    } catch (error) {
      console.error('生成 UI 时出错:', error)
      setError(error instanceof Error ? error.message : '生成 UI 时发生未知错误')
    } finally {
      clearInterval(progressInterval)
      setProgress(100)
      setIsLoading(false)
    }
  }, [containerSize, userId, isTuning, generatedCode])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      generateComponent(query)
      setQuery('')
    }
  }, [query, generateComponent])

  const DynamicComponent = useMemo(() => {
    if (!userId) return null
    return dynamic(
      () => import(`@/components/generated/${userId}.tsx`)
        .then((mod) => mod.default)
        .catch((error) => {
          console.error('加载组件时出错:', error)
          return () => <ErrorComponent error={error} />
        }),
      {
        loading: () => <SkeletonLoader progress={progress} />,
        ssr: false,
      }
    )
  }, [userId, progress])

  useEffect(() => {
    const initializeComponent = async () => {
      setIsLoading(true)
      setError(null)
      setProgress(0)
      const startTime = Date.now()
      const progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime
        const newProgress = Math.min(Math.floor((elapsedTime / 15000) * 100), 88)
        setProgress(newProgress)
      }, 200)
      try {
        const res = await fetch('/api/gen-ui', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '', userId }),
        })
        if (!res.ok) throw new Error('初始化组件失败')
        const data = await res.json()
        setComponent(data.componentPath)
        setComponentKey(prevKey => prevKey + 1)
        setGeneratedCode(data.code)
        setEditedCode(data.code)
      } catch (error) {
        console.error('初始化组件时出错:', error)
        setError(error instanceof Error ? error.message : '初始化组件时发生未知错误')
      } finally {
        clearInterval(progressInterval)
        setProgress(100)
        setIsLoading(false)
      }
    }

    initializeComponent()
  }, [userId])

  useEffect(() => {
    if (isNewUser) {
      Cookies.set('userId', userId, { expires: 365 })
    }
  }, [userId, isNewUser])

  const handleCodeChange = async (code: string) => {
    if (!code) {
      toast.error('代码不能为空');
      return;
    }
    console.log('Applying code:', code.substring(0, 100) + '...'); // 只打印前100个字符
    setEditedCode(code);
    setGeneratedCode(code);
    setComponentKey(prevKey => prevKey + 1);
    setIsHistoryOpen(false);

    try {
      console.log('Sending request to save component...');
      const response = await fetch('/api/save-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, userId }),
      });
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);
      if (!response.ok) {
        throw new Error(responseData.error || '保存代码失败');
      }
      toast.success('代码已应用并保存');
    } catch (error) {
      console.error('保存代码时出错:', error);
      toast.error(error instanceof Error ? error.message : '保存代码失败');
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/get-ui-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '获取历史记录失败')
      }
      const data = await response.json()
      setHistory(data.history)
    } catch (error) {
      console.error('获取历史记录时出错:', error)
      toast.error(error instanceof Error ? error.message : '获取历史记录失败')
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [userId])

  return (
    <main className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto" ref={containerRef} style={{ height: containerSize.height }}>
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className={`w-full h-full ${isEditing ? 'flex' : ''}`}>
          {isLoading ? (
            <SkeletonLoader progress={progress} />
          ) : isEditing ? (
            <>
              <div className="w-1/2 p-4 overflow-auto">
                <SyntaxHighlighter
                  language="tsx"
                  style={vscDarkPlus}
                  customStyle={{
                    height: '100%',
                    margin: 0,
                    borderRadius: '4px',
                  }}
                >
                  {editedCode}
                </SyntaxHighlighter>
              </div>
              <div className="w-1/2 p-4 overflow-auto">
                <ErrorBoundary key={componentKey} fallback={<ErrorFallback error={new Error("组件渲染失败")} />}>
                  {DynamicComponent && <DynamicComponent />}
                </ErrorBoundary>
              </div>
            </>
          ) : DynamicComponent ? (
            <ErrorBoundary key={componentKey} fallback={<ErrorFallback error={new Error("组件渲染失败")} />}>
              <DynamicComponent />
            </ErrorBoundary>
          ) : null}
        </div>
      </div>
      <div className="p-4 bg-white border-t" ref={inputRef}>
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
            <FaArrowLeft className="mr-2" />
            返回主页
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Flex UI 生成器</h2>
          <form onSubmit={handleSubmit} className="flex-grow flex items-center gap-2">
            <Input
              type="text"
              placeholder="描述你想要的 UI 组件..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FaPaperPlane className="mr-2 h-4 w-4" />}
              {isLoading ? '生成中...' : '生成'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(!isEditing)} disabled={isLoading}>
              {isEditing ? <FaEye className="mr-2 h-4 w-4" /> : <FaCode className="mr-2 h-4 w-4" />}
              {isEditing ? '预览' : '代码'}
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="tuning-mode"
                checked={isTuning}
                onCheckedChange={setIsTuning}
              />
              <label htmlFor="tuning-mode">改</label>
            </div>
            <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="p-2" title="查看历史">
                  <FaHistory />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>生成历史</SheetTitle>
                  <SheetDescription>
                    点击"应用"以使用历史记录中的代码
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {history.map((item, index) => (
                    <div key={index} className="border p-4 rounded">
                      <p className="text-sm text-gray-600">查询: {item.query}</p>
                      <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                      <Button 
                        onClick={() => handleCodeChange(item.code)} 
                        className="mt-2"
                      >
                        应用
                      </Button>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </form>
        </div>
      </div>
    </main>
  )
}