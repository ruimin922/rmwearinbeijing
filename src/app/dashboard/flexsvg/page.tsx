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

// 常量和配置
const MOBILE_BREAKPOINT = 640
const DEFAULT_PNG_SIZE = 1000
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

function GenerateSVGClient() {
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
    selectedBot: 'default',
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

  const handleFileUpload = useCallback(() => {
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

  // 渲染函数
  const renderUserMessage = useCallback((message: any) => (
    <div key={message.id} className="flex justify-end mb-4">
      <div className="flex flex-row-reverse items-start max-w-[80%]">
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-blue-500 ml-2">
          <FaUser className="text-white" />
        </div>
        <div className="rounded-lg p-3 bg-blue-100">
          <div className="max-w-full overflow-hidden">
            <Markdown className="prose max-w-none text-left">{message.content}</Markdown>
          </div>
        </div>
      </div>
    </div>
  ), [])

  const renderBotMessage = useCallback((message: any) => (
    <div key={message.id} className="flex justify-start mb-4">
      <div className="flex flex-row items-start max-w-[80%]">
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-green-500 mr-2">
          <FaRobot className="text-white" />
        </div>
        <div className="rounded-lg p-3 bg-green-100 overflow-hidden">
          <div className="max-w-full overflow-hidden">
            <Markdown className="prose max-w-none">{message.content}</Markdown>
          </div>
          <div>
          {message?.experimental_attachments
              ?.filter((attachment: Attachment) => attachment?.contentType?.startsWith('image/'))
              .map((attachment: Attachment, index: number) => (
                <Image
                  key={`${message.id}-${index}`}
                  src={attachment.url}
                  width={500}
                  height={500}
                  alt={attachment.name ?? `attachment-${index}`}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  ), [])

  const renderMessages = useCallback(() => (
    messages.map(m => m.role === 'user' ? renderUserMessage(m) : renderBotMessage(m))
  ), [messages, renderUserMessage, renderBotMessage])

  const renderSvgPreviews = useCallback(() => (
    <AnimatePresence>
      {state.svgPreviews.map((svg, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="mb-2 mr-2 cursor-pointer"
          onClick={() => handlePreviewClick(index)}
        >
          <div className="w-24 h-36 bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center">
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  ), [state.svgPreviews, handlePreviewClick])

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="container mx-auto px-8 py-4 w-full h-full flex flex-col">
          <div className="text-primary-text flex-grow flex flex-col overflow-hidden mb-4">
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto scrollbar-hide" ref={refs.markdown}>
                {renderMessages()}
                <div ref={refs.messagesEnd} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap">
            {renderSvgPreviews()}
          </div>

          <Card className="rounded-lg border bg-secondary-bg text-primary-text shadow-sm mt-auto">
            <CardContent className="p-4">
              <form onSubmit={handleFormSubmit} className="flex flex-col">
                <div className="flex justify-between mb-2 items-center">
                  <div className="flex space-x-1">
                    {BOTS.map((bot) => (
                      <Button
                        key={bot}
                        onClick={() => handleBotSelection(bot)}
                        className={`
                          ${state.selectedBot === bot 
                            ? 'bg-primary-button-bg text-primary-button-text' 
                            : 'bg-transparent text-primary-button-text border border-primary-button-bg'
                          } 
                          px-2 py-0.5 rounded-full text-xs
                          hover:bg-primary-button-hover-bg hover:text-primary-button-hover-text 
                          hover:scale-95 transition-transform
                          flex items-center h-6
                        `}
                      >
                        <FaRobot className="mr-0.5 text-[10px]" />
                        {bot}
                      </Button>
                    ))}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      onClick={handleFileUpload} 
                      className="bg-white text-gray-700 hover:bg-green-100 hover:scale-95 transition-transform p-1 rounded-full h-6 w-6 flex items-center justify-center"
                    >
                      <FaPaperclip className="text-xs" />
                    </Button>
                    <Button 
                      className="bg-white text-gray-700 hover:bg-green-100 hover:scale-95 transition-transform p-1 rounded-full h-6 w-6 flex items-center justify-center"
                    >
                      <FaHistory className="text-xs" />
                    </Button>
                    <Button 
                      className="bg-white text-gray-700 hover:bg-green-100 hover:scale-95 transition-transform p-1 rounded-full h-6 w-6 flex items-center justify-center"
                    >
                      <FaPlus className="text-xs" />
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Textarea
                    placeholder="描述你想要的 SVG 图像..."
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={`flex-grow mb-2 border border-secondary-border rounded-lg transition-all duration-300 ${state.isExpanded ? 'h-[500px]' : 'h-[100px]'} resize-none`}
                    disabled={state.isLoading}
                  />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                    ref={refs.fileInput}
                  />
                  <Button 
                    onClick={toggleExpand}
                    className="absolute bottom-2 right-12 p-2 rounded-md bg-white hover:bg-[#E8F5E9] text-[#39855E] transition-colors w-8 h-8 flex items-center justify-center mb-1"
                  >
                    {state.isExpanded ? <FaChevronDown className="h-4 w-4" /> : <FaChevronUp className="h-4 w-4" />}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || isAIResponding}
                    className={`
                      absolute bottom-2 right-2 p-2 rounded-md
                      transition-colors w-8 h-8 flex items-center justify-center mb-1
                      ${isLoading || isAIResponding
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-[#E8F5E9] text-[#39855E]'
                      }
                    `}
                  >
                    {isLoading || isAIResponding ? 
                      <Loader2 className="h-4 w-4 animate-spin" /> :
                      <FaPaperPlane className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </form>
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
