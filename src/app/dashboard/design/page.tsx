'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useUser } from '@clerk/nextjs'
import { SVGPreview } from '@/components/SVGPreview'
import ProtectedRoute from '@/components/ProtectedRoute'
import BotInput from '@/components/BotInput'
import ChatHistory from '@/components/ChatHistory'
import SVGPreviewList from '@/components/SVGPreviewList'

// 常量和配置
const MOBILE_BREAKPOINT = 640

const BOTS = ['默认SVG', '思考者', 'LOGO设计', '卡通形象']

interface Attachment {
  contentType?: string;
  url: string;
  name?: string;
}

// 工具函数
function extractSvgFromMessage(content: string) {
  return content.match(/<svg[\s\S]*?<\/svg>/gi) || []
}

const GenerateSVGClient = () => {
  const { user } = useUser()
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/gen-svg',
    onResponse: () => {
      setIsAIResponding(true);
    },
    onFinish: () => {
      setIsAIResponding(false);
    },
  });

  const [isAIResponding, setIsAIResponding] = useState(false);

  // 状态管理
  const [state, setState] = useState({
    svgPreviews: [] as string[],
    selectedSvgIndex: null as number | null,
    isLoading: false,
    error: null as string | null,
    showSVGPreview: false,
    isMobile: false,
    files: undefined as FileList | undefined,
    selectedBot: BOTS[0], // 初始化为第一个机器人
    isExpanded: false,
    processedSvgs: new Set<string>(),
  })

  // 使用 useRef
  const refs = {
    markdown: useRef<HTMLDivElement>(null),
    fileInput: useRef<HTMLInputElement>(null),
    messagesEnd: useRef<HTMLDivElement>(null),
  }

  // 移动设备检测
  useEffect(() => {
    const checkMobile = () => {
      setState(prev => ({ ...prev, isMobile: window.innerWidth < MOBILE_BREAKPOINT }))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 表单提交处理
  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    handleSubmit(event, { experimental_attachments: state.files })
    setState(prev => ({ ...prev, files: undefined }))
    if (refs.fileInput.current) {
      refs.fileInput.current.value = ''
    }
  }, [handleSubmit, state.files, refs.fileInput])

  // 消息处理
  useEffect(() => {
    const latestMessage = messages[messages.length - 1]
    if (latestMessage?.role === 'assistant') {
      const svgMatches = extractSvgFromMessage(latestMessage.content)
      const newSvgs = svgMatches.filter(svg => !state.processedSvgs.has(svg))
      if (newSvgs.length > 0) {
        setState(prev => ({
          ...prev,
          svgPreviews: [...prev.svgPreviews, ...newSvgs],
          processedSvgs: new Set([...Array.from(prev.processedSvgs), ...newSvgs]),
        }))
        setIsPreviewOpen(true); // 当有新的SVG时，自动显示预览面板
      }
    }
    refs.messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, state.processedSvgs, refs.messagesEnd])

  // 事件处理函数
  const handlePreviewClick = useCallback((index: number) => {
    setState(prev => ({ ...prev, selectedSvgIndex: index, showSVGPreview: true }))
  }, [])

  const handleBotSelection = useCallback((bot: string) => {
    setState(prev => ({ ...prev, selectedBot: bot }))
  }, [])

  const handleFileUpload = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    if (refs.fileInput.current) {
      refs.fileInput.current.click()
    }
  }, [refs.fileInput])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, files: event.target.files || undefined }))
  }, [])

  const toggleExpand = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }))
  }, [])

  // 处理回车键按下事件
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleFormSubmit(event as unknown as React.FormEvent)
    }
  }, [handleFormSubmit])

  // 切换预览面板的显示状态
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  const togglePreviewPanel = useCallback(() => {
    setIsPreviewOpen(prev => !prev);
  }, []);

  return (
    <div className="flex h-full bg-gray-100">
      <main className="flex-1 flex overflow-hidden bg-white">
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isPreviewOpen ? 'w-2/3' : 'w-full'}`}>
          <div className="container mx-auto px-4 py-6 w-full h-full flex flex-col">
            <div className="flex-grow flex flex-col overflow-hidden mb-4">
              <ChatHistory messages={messages} />
            </div>

            <BotInput
              input={input}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
              handleKeyDown={handleKeyDown}
              isLoading={state.isLoading}
              isAIResponding={isAIResponding}
              isExpanded={state.isExpanded}
              toggleExpand={toggleExpand}
              handleFileUpload={handleFileUpload}
              handleFileChange={handleFileChange}
              handleBotSelection={handleBotSelection}
              selectedBot={state.selectedBot}
            />
          </div>
          <Button 
            onClick={togglePreviewPanel} 
            variant="ghost" 
            size="sm"
            className="absolute top-1/2 right-0 transform -translate-y-1/2"
          >
            {isPreviewOpen ? <FaChevronRight /> : <FaChevronLeft />}
          </Button>
        </div>

        {state.svgPreviews.length > 0 && (
          <div className={`bg-white p-4 overflow-y-auto border-l border-gray-200 flex flex-col transition-all duration-300 ${isPreviewOpen ? 'w-1/3' : 'w-0'}`}>
            {state.selectedSvgIndex !== null && (
              <SVGPreview 
                svgCode={state.svgPreviews[state.selectedSvgIndex]} 
                onClose={() => {
                  setState(prev => ({ ...prev, selectedSvgIndex: null }))
                }} 
              />
            )}
            <SVGPreviewList 
              svgPreviews={state.svgPreviews} 
              handlePreviewClick={handlePreviewClick} 
              selectedSvgIndex={state.selectedSvgIndex}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default function GenerateUI() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <ProtectedRoute>
      <GenerateSVGClient />
    </ProtectedRoute>
  )
}
