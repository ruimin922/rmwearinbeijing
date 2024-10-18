'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FaPaperPlane, FaRobot, FaPaperclip, FaHistory, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from '@clerk/nextjs'
import { SVGPreview } from '@/components/SVGPreview'
import Image from 'next/image'
import Markdown from '@/components/Markdown'
import { motion, AnimatePresence } from 'framer-motion'

// 1. 提取常量和配置
const MOBILE_BREAKPOINT = 640
const DEFAULT_PNG_SIZE = 1000
const BOTS = ['默认SVG', '思考者', 'LOGO设计', '卡通形象']

// 2. 提取工具函数
function extractSvgFromMessage(content: string) {
  return content.match(/<svg[\s\S]*?<\/svg>/gi) || []
}

function GenerateSVGClient() {
  const { user } = useUser()
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/gen-svg',
  })

  // 3. 状态管理优化
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

  // 4. 使用 useRef 优化
  const refs = {
    markdown: useRef<HTMLDivElement>(null),
    fileInput: useRef<HTMLInputElement>(null),
    messagesEnd: useRef<HTMLDivElement>(null),
  }

  // 5. 移动设备检测优化
  useEffect(() => {
    const checkMobile = () => {
      setState(prev => ({ ...prev, isMobile: window.innerWidth < MOBILE_BREAKPOINT }))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 6. 表单提交处理优化
  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    handleSubmit(event, { experimental_attachments: state.files })
    setState(prev => ({ ...prev, files: undefined }))
    if (refs.fileInput.current) {
      refs.fileInput.current.value = ''
    }
  }, [handleSubmit, state.files])

  // 7. 消息处理优化
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
  }, [messages, state.processedSvgs])

  // 8. 事件处理函数优化
  const handlePreviewClick = useCallback((index: number) => {
    setState(prev => ({ ...prev, selectedSvgIndex: index, showSVGPreview: true }))
  }, [])

  const handleBotSelection = useCallback((bot: string) => {
    setState(prev => ({ ...prev, selectedBot: bot }))
  }, [])

  const handleFileUpload = useCallback(() => {
    refs.fileInput.current?.click()
  }, [])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, files: event.target.files || undefined }))
  }, [])

  const toggleExpand = useCallback(() => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }))
  }, [])

  // 9. 渲染优化
  const renderMessages = useCallback(() => (
    messages.map(m => (
      <div key={m.id} className="whitespace-pre-wrap mb-4">
        <strong>{m.role === 'user' ? '用户: ' : 'AI: '}</strong>
        <Markdown>{m.content}</Markdown>
        <div>
          {m?.experimental_attachments
            ?.filter(attachment => attachment?.contentType?.startsWith('image/'))
            .map((attachment, index) => (
              <Image
                key={`${m.id}-${index}`}
                src={attachment.url}
                width={500}
                height={500}
                alt={attachment.name ?? `attachment-${index}`}
              />
            ))}
        </div>
      </div>
    ))
  ), [messages])

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
    <div className="flex flex-col h-[calc(100vh-3.5rem-1.5rem)] bg-[#EEFDF4]">
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="container mx-auto p-4 max-w-7xl h-full flex flex-col">
          <div className="bg-[#EEFDF4] text-[#1D1D35] flex-grow flex flex-col overflow-hidden mb-4">
            <div className="flex-grow overflow-hidden p-4">
              <div className="h-full overflow-y-auto scrollbar-hide" ref={refs.markdown}>
                {renderMessages()}
                <div ref={refs.messagesEnd} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap">
            {renderSvgPreviews()}
          </div>

          <Card className="rounded-lg border bg-white text-[#1D1D35] shadow-sm">
            <CardContent className="p-4">
              <form onSubmit={handleFormSubmit} className="flex flex-col">
                <div className="flex justify-between mb-2 items-center">
                  <div className="flex space-x-2">
                    {BOTS.map((bot) => (
                      <Button
                        key={bot}
                        onClick={() => handleBotSelection(bot)}
                        className={`
                          ${state.selectedBot === bot 
                            ? 'bg-[#E8F5E9] text-[#39855E]' 
                            : 'bg-transparent text-[#39855E] border border-[#E8F5E9]'
                          } 
                          px-3 py-0.5 rounded-2xl text-sm
                          hover:bg-[#C8E6C9] hover:text-[#2E7D32] 
                          hover:scale-95 transition-transform
                        `}
                      >
                        <FaRobot className="mr-1 text-xs" />
                        {bot}
                      </Button>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleFileUpload} className="bg-white text-gray-700 hover:bg-green-100 hover:scale-95 transition-transform">
                      <FaPaperclip />
                    </Button>
                    <Button className="bg-white text-gray-700 hover:bg-green-100 hover:scale-95 transition-transform">
                      <FaHistory />
                    </Button>
                    <Button className="bg-white text-gray-700 hover:bg-green-100 hover:scale-95 transition-transform">
                      <FaPlus />
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Textarea
                    placeholder="描述你想要的 SVG 图像..."
                    value={input}
                    onChange={handleInputChange}
                    className={`flex-grow mb-2 border border-[#E8F5E9] rounded-lg transition-all duration-300 ${state.isExpanded ? 'h-[500px]' : 'h-[100px]'} resize-none`}
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
                    className="absolute bottom-2 right-12 p-2 rounded-md bg-white hover:bg-[#E8F5E9] text-[#39855E] transition-colors"
                  >
                    {state.isExpanded ? <FaChevronUp className="h-4 w-4" /> : <FaChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={state.isLoading} 
                    className="absolute bottom-2 right-2 p-2 rounded-md bg-white hover:bg-[#E8F5E9] text-[#39855E] transition-colors"
                  >
                    {state.isLoading ? 
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

export default GenerateSVGClient
