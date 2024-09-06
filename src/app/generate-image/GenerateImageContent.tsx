'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaMagic, FaCog, FaImage, FaSpinner, FaHistory, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type ImageSize = '1440x900' | '1024x1024' | '1024x576' | '1024x768' | '512x1024' | '512x768' | '1280x960' | '960x1280' | '768x1366' | '768x512' | '1366x768' | '1344x576' | 'custom'
type ModelType = 'flux-schnell' | 'flux-pro-max'

interface HistoryItem {
  imageUrl: string
  query: string
  timestamp: string
  prompt: string
}

const defaultSystemPrompt = `你是一位富有艺术感的Flux壁纸PROMPT生成助手。你的任务是根据用户提供的主题构思一幅完整的画面，然后将其化为一个简洁而有效的Flux prompt，以生成高质量的图像。

请遵循以下原则：
1. 提示词主体中不要出现人物为主体，尽量避免人物的出现，可以换成物和景。
2. 不要出现文字的描述。
3. 不要出现不符合常识的描述词。
4. 构思的prompt定要保证是简洁、留白、低饱和度、高质感的。
5. 如果用户query不符合你的原则，你自行改写，直接生成prompt，不需要问用户的其他意见。

输出格式：
1. JSON格式输出prompt，格式为 {"prompt": "your prompt here"}
2. 使用英文半角逗号做分隔符。
3. prompt应简洁明了，通常不超过40个关键词或短语。
4. 按重要性从高到低的顺序排列标签。
5. 必须包含以下修饰词：large area blank, negative space composition, low saturation, simple colors, soft light, minimalist, clear background, clear, simple, less details, blank space, 1280*880, high quality, high definition, HUD`

export default function GenerateImage() {
  const [query, setQuery] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [size, setSize] = useState<ImageSize>('1440x900')
  const [customSize, setCustomSize] = useState('')
  const [model, setModel] = useState<ModelType>('flux-schnell')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt)
  const [imagePrompt, setImagePrompt] = useState('')
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [optimizedPrompt, setOptimizedPrompt] = useState('')
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [config, setConfig] = useState({
    model: 'flux',
    size: '1440x900',
    customSize: '',
    systemPrompt: ''
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/get-config')
      if (!response.ok) {
        throw new Error('获取配置失败')
      }
      const data = await response.json()
      setConfig(data)
      setModel(data.model)
      setSize(data.size)
      setCustomSize(data.customSize)
      setSystemPrompt(data.systemPrompt)
    } catch (error) {
      console.error('获取配置错误:', error)
      toast.error('加载配置失败')
    }
  }

  const updateConfig = async () => {
    try {
      const response = await fetch('/api/get-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, size, customSize, systemPrompt }),
      })
      if (!response.ok) {
        throw new Error('更新配置失败')
      }
      toast.success('设置保存成功')
    } catch (error) {
      console.error('更新配置错误:', error)
      toast.error('保存设置失败')
    }
  }

  const generateImage = async () => {
    if (!query && !imagePrompt) {
      toast.error('请输入图片描述或提示词')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: imagePrompt || query, 
          size: size === 'custom' ? customSize : size, 
          model 
        }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setImageUrl(data.imageUrl)

      await fetch('/api/log-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          prompt: imagePrompt || query,
          imageUrl: data.imageUrl
        }),
      })
      toast.success('图片生成成功')
    } catch (error) {
      console.error('Error generating image:', error)
      setError('图片生成失败，请重试')
      toast.error('图片生成失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const rewritePrompt = async () => {
    if (!query) {
      toast.error('请先输入图片描述')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/rewrite-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, systemPrompt }),
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setOptimizedPrompt(data.rewrittenPrompt)
      setImagePrompt(data.rewrittenPrompt)
      toast.success('提示词优化成功，正在生成图片...')
      await generateImage()
    } catch (error) {
      console.error('Error rewriting prompt:', error)
      toast.error('优化提示词失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchHistory = async (page = 1) => {
    try {
      const response = await fetch(`/api/get-history?page=${page}`)
      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }
      const data: { history: HistoryItem[], totalPages: number, currentPage: number } = await response.json()
      setHistory(data.history)
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)
      setShowHistoryModal(true)
    } catch (error) {
      console.error('Error fetching history:', error)
      toast.error('Failed to load history')
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-start p-8 w-full bg-gray-50"
    >
      <Toaster position="top-center" />
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
          <FaArrowLeft className="mr-2" />
          返回主页
        </Link>
        <h2 className="text-4xl font-bold text-gray-800">Flux 图像生成器</h2>
      </div>
      <div className="mb-6 flex flex-col w-full max-w-4xl space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-grow flex items-center rounded-lg border border-gray-300 bg-white shadow-sm">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入图片描述..."
              className="flex-grow p-2 text-black border-none focus:ring-0"
            />
            <Button
              onClick={rewritePrompt}
              className="p-2 text-gray-500 hover:text-blue-500"
              variant="ghost"
              title="优化提示词"
            >
              <FaMagic />
            </Button>
          </div>
          <Button
            onClick={generateImage}
            disabled={isLoading}
            className="px-4 py-2"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : '生成'}
          </Button>
          <Button
            onClick={() => setShowSettingsModal(true)}
            variant="outline"
            className="p-2"
            title="设置"
          >
            <FaCog />
          </Button>
          <Button
            onClick={() => fetchHistory()}
            variant="outline"
            className="p-2"
            title="查看历史"
          >
            <FaHistory />
          </Button>
        </div>
        <Textarea
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          placeholder="优化后的提示词将显示在这里..."
          className="w-full p-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm"
          rows={3}
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <AnimatePresence>
        {imageUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-8 w-full max-w-4xl"
          >
            <Image src={imageUrl} alt="Generated" width={1280} height={960} className="rounded-lg shadow-lg w-full h-auto" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 h-[600px] w-full max-w-4xl rounded-lg bg-white shadow-md flex items-center justify-center text-gray-400"
          >
            <FaImage className="text-6xl" />
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>设置</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="model" className="text-right col-span-1">
                模型
              </Label>
              <Select value={model} onValueChange={(value: ModelType) => setModel(value)}>
                <SelectTrigger className="w-full col-span-5">
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flux-schnell">flux</SelectItem>
                  <SelectItem value="flux-pro-max">flux-pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="size" className="text-right col-span-1">
                尺寸
              </Label>
              <div className="col-span-5 flex items-center gap-4">
                <Select value={size} onValueChange={(value: ImageSize) => setSize(value)}>
                  <SelectTrigger className="w-full flex-grow">
                    <SelectValue placeholder="选择尺寸" />
                  </SelectTrigger>
                  <SelectContent>
                    {['1440x900', '1024x1024', '1024x576', '1024x768', '512x1024', '512x768', '1280x960', '960x1280', '768x1366', '768x512', '1366x768', '1344x576', 'custom'].map((option) => (
                      <SelectItem key={option} value={option as ImageSize}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {size === 'custom' && (
                  <Input
                    id="customSize"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder="宽x高"
                    className="flex-grow"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-6 items-start gap-4">
              <Label htmlFor="systemPrompt" className="text-right col-span-1 mt-2">
                系统提示词
              </Label>
              <Textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="col-span-5"
                rows={20}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              updateConfig()
              setShowSettingsModal(false)
            }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPromptModal} onOpenChange={setShowPromptModal}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>优化后的提示词</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Textarea
              value={optimizedPrompt}
              onChange={(e) => setOptimizedPrompt(e.target.value)}
              className="w-full p-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPromptModal(false)}>取消</Button>
            <Button onClick={() => {
              setImagePrompt(optimizedPrompt)
              setShowPromptModal(false)
            }}>使用优化后的提示词</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle>生成历史</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2 max-h-[60vh] overflow-y-auto">
            {history.map((item, index) => (
              <div key={index} className="flex flex-col items-center border p-4 rounded">
                <div className="relative w-[200px] h-[200px]">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.query} 
                    layout="fill"
                    objectFit="cover"
                    className="rounded mb-2 cursor-pointer" 
                    onClick={() => setSelectedImage(item)}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png"
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 truncate w-full">查询: {item.query}</p>
                <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => fetchHistory(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </Button>
            <span>{currentPage} / {totalPages}</span>
            <Button
              onClick={() => fetchHistory(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHistoryModal(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>图片详情</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[60vh]">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FaSpinner className="animate-spin text-4xl text-gray-500" />
                  </div>
                )}
                <Image 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.query} 
                  layout="fill"
                  objectFit="contain"
                  className="rounded mb-4" 
                  onLoadingComplete={() => setImageLoading(false)}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png" // 替换为您的占位图URL
                    setImageLoading(false)
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">查询: {selectedImage.query}</p>
              <p className="text-sm text-gray-600">提示词: {selectedImage.prompt}</p>
              <p className="text-xs text-gray-400">{new Date(selectedImage.timestamp).toLocaleString()}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedImage(null)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.main>
  );
}
