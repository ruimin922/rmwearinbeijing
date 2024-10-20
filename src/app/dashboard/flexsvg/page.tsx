'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FaPaperPlane, FaRobot, FaPaperclip, FaHistory, FaPlus, FaChevronDown, FaChevronUp, FaUser } from 'react-icons/fa'
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from '@clerk/nextjs'
import { SVGPreview } from '@/components/SVGPreview'
import Image from 'next/image'
import Markdown from '@/components/Markdown'
import { motion, AnimatePresence } from 'framer-motion'
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

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="container mx-auto px-8 py-4 w-full h-full flex flex-col">
          <div className="flex-grow flex flex-col overflow-hidden mb-4">
            <ChatHistory messages={messages} />
          </div>

          <SVGPreviewList svgPreviews={state.svgPreviews} handlePreviewClick={handlePreviewClick} />

          <Card className="mt-auto">
            <CardContent className="p-4">
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
            </CardContent>
          </Card>
        </div>
      </main>

      {state.showSVGPreview && state.selectedSvgIndex !== null && (
        <SVGPreview 
          svgCode={state.svgPreviews[state.selectedSvgIndex]} 
          onClose={() => {
            setState(prev => ({ ...prev, showSVGPreview: false, selectedSvgIndex: null }))
          }} 
        />
      )}
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
