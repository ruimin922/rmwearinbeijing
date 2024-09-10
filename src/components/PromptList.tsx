// src/components/PromptList.tsx
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Prompt } from '@/types/prompt'


interface PromptListProps {
  prompts: Prompt[]
  activePromptId: string | null
  onSave: (prompt: Prompt) => void
  onDelete: (promptId: string) => void
  onActivate: (promptId: string) => void
}

export function PromptList({ prompts, activePromptId, onSave, onDelete, onActivate }: PromptListProps) {
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setIsDrawerOpen(true)
  }

  const handleSave = () => {
    if (editingPrompt) {
      onSave(editingPrompt)
      setEditingPrompt(null)
      setIsDrawerOpen(false)
    }
  }

  const handleCancel = () => {
    setEditingPrompt(null)
    setIsDrawerOpen(false)
  }

  return (
    <div className="h-full">
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="space-y-2 p-4">
          {prompts.map((prompt) => (
            <div 
              key={prompt.id} 
              className={`${
                prompt.id === activePromptId ? 'bg-blue-100' : 'bg-white'
              } shadow-sm rounded-lg p-3 hover:shadow-md transition-shadow`}
            >
              <h3 className="font-semibold text-lg">{prompt.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{prompt.content}</p>
              <div className="mt-3 space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(prompt)}>编辑</Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(prompt.id!)}>删除</Button>
                {prompt.id !== activePromptId && (
                  <Button size="sm" variant="outline" onClick={() => onActivate(prompt.id!)}>激活</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4">
        <Button onClick={() => handleEdit({ id: '', name: '', content: '', isActive: false })} className="w-full">
          新建提示词
        </Button>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editingPrompt?.id ? '编辑提示词' : '新建提示词'}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <Input
              value={editingPrompt?.name || ''}
              onChange={(e) => setEditingPrompt({ ...editingPrompt!, name: e.target.value })}
              placeholder="提示词名称"
            />
            <Textarea
              value={editingPrompt?.content || ''}
              onChange={(e) => setEditingPrompt({ ...editingPrompt!, content: e.target.value })}
              placeholder="提示词内容"
              className="min-h-[200px]"
            />
          </div>
          <DrawerFooter>
            <Button onClick={handleSave}>保存</Button>
            <Button variant="outline" onClick={handleCancel}>取消</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}