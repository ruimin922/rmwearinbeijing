'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaPaperPlane, FaArrowLeft, FaImage } from 'react-icons/fa'
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from '@clerk/nextjs'
import { SVGPreview } from '@/components/SVGPreview'
import Image from 'next/image'
import Markdown from '@/components/Markdown'

export default function GenerateSVGClient() {
  const { user } = useUser()
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/gen-svg',
  })
  const [svgCode, setSvgCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const markdownRef = useRef<HTMLDivElement>(null)
  const [showSVGPreview, setShowSVGPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [files, setFiles] = useState<FileList | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault()
    handleSubmit(event, {
      experimental_attachments: files,
    })
    setFiles(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleSubmit, files])

  useEffect(() => {
    const latestMessage = messages[messages.length - 1]
    if (latestMessage?.role === 'assistant') {
      const svgMatches = latestMessage.content.match(/<svg[\s\S]*?<\/svg>/gi)
      if (svgMatches?.length) {
        const latestSVG = svgMatches[svgMatches.length - 1]
        setSvgCode(latestSVG)
        setShowSVGPreview(true)
      }
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-1.5rem)] bg-[#EEFDF4]">
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="container mx-auto p-4 max-w-7xl h-full flex flex-col">
          <Card className="rounded-lg border bg-white text-[#1D1D35] shadow-sm flex-grow flex flex-col overflow-hidden mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#39855E]">生成结果</CardTitle>
              {svgCode && (
                <Button 
                  className="w-28 h-10 bg-[#39855E] rounded-md flex items-center justify-center cursor-pointer hover:bg-[#39855E]/80 transition-colors duration-200 text-white"
                  onClick={() => setShowSVGPreview(true)}
                >
                  <FaImage className="text-white text-xl mr-2" />
                  <span className="text-sm">查看SVG</span>
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              <div className="h-full" ref={markdownRef}>
                {messages.map(m => (
                  <div key={m.id} className="whitespace-pre-wrap mb-4">
                    <strong>{m.role === 'user' ? '用户: ' : 'AI: '}</strong>
                    <Markdown>
                      {m.content}
                    </Markdown>
                    <div>
                      {m?.experimental_attachments
                        ?.filter(attachment =>
                          attachment?.contentType?.startsWith('image/'),
                        )
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
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border bg-white text-[#1D1D35] shadow-sm">
            <CardContent className="p-2 sm:p-4">
              <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex w-full items-center gap-2">
                  <Link href="/" className="flex items-center text-[#39855E] hover:text-[#39855E]/80">
                    <FaArrowLeft className="mr-2" />
                  </Link>
                  <Input
                    type="text"
                    placeholder="描述你想要的 SVG 图像..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-grow"
                    disabled={isLoading}
                  />
                  <input
                    type="file"
                    className="hidden"
                    onChange={event => {
                      if (event.target.files) {
                        setFiles(event.target.files)
                      }
                    }}
                    multiple
                    ref={fileInputRef}
                  />
                  <div className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0">
                    <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none bg-[#39855E] hover:bg-[#39855E]/80 text-white">
                      {isLoading ? 
                        <Loader2 className="h-4 w-4 animate-spin" /> : 
                        <FaPaperPlane className="h-4 w-4" />
                      }
                      <span className="hidden sm:inline ml-2">
                        {isLoading ? '生成中...' : '生成'}
                      </span>
                    </Button>
                    <Button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none bg-[#39855E] hover:bg-[#39855E]/80 text-white">
                      <FaImage className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {showSVGPreview && <SVGPreview svgCode={svgCode} onClose={() => setShowSVGPreview(false)} />}
    </div>
  )
}
