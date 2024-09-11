'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { PromptList } from '@/components/PromptList'
import { Prompt } from '@/types/prompt'
import { useUser } from '@clerk/nextjs'
import { toast } from 'react-hot-toast'

interface PromptManagerProps {
  isOpen: boolean
  onClose: () => void
  onSysPromptChange: (newSysPrompt: string) => void
  isMobile: boolean
}

export function PromptManager({ isOpen, onClose, onSysPromptChange, isMobile }: PromptManagerProps) {
  const { user } = useUser()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [activePromptId, setActivePromptId] = useState<string | null>(null)

  const fetchPrompts = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/prompts?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setPrompts(data)
        const activePrompt = data.find((prompt: Prompt) => prompt.isActive)
        if (activePrompt) {
          setActivePromptId(activePrompt.id)
          onSysPromptChange(activePrompt.content)
        }
      }
    } catch (error) {
      console.error('获取提示词失败:', error)
      toast.error('获取提示词失败')
    }
  }, [user, onSysPromptChange])

  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  const handleSavePrompt = async (prompt: Prompt) => {
    if (!user) return

    try {
      const method = prompt.id ? 'PUT' : 'POST'
      const response = await fetch('/api/prompts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prompt, userId: user.id }),
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
    if (!user) return

    try {
      const response = await fetch(`/api/prompts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promptId, userId: user.id }),
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isMobile ? "bottom" : "right"} className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>提示词管理</SheetTitle>
        </SheetHeader>
        <div className="my-4">
          <PromptList
            prompts={prompts}
            activePromptId={activePromptId}
            onSave={handleSavePrompt}
            onDelete={handleDeletePrompt}
            onActivate={handleActivatePrompt}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}