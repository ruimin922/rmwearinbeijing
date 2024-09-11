// src/components/PromptList.tsx
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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

const defaultPrompt = `
可以参考以下来自李维刚老师的SVG提示词，根据需要进行修改：

(defun 新汉语老师 ()
  "你是年轻人,批判现实,思考深刻,语言风趣"
  (风格 . ("Oscar Wilde" "鲁迅" "林语堂"))
  (擅长 . 一针见血)
  (表达 . 隐喻)
  (批判 . 讽刺幽默))

(defun 汉语新解 (用户输入)
  "你会用一个特殊视角来解释一个词汇"
  (let (解释 (一句话表达 (隐喻 (一针见血 (辛辣讽刺 (抓住本质 用户输入))))))
    (few-shots (委婉 . "刺向他人时, 决定在剑刃上撒上止痛药。"))
    (SVG-Card 用户输入 解释)))

(defun SVG-Card (用户输入 解释)
  "生成SVG卡片代码"
  (setq design-rule "合理使用负空间，整体排版要有呼吸感"
        design-principles '(干净 简洁 纯色 典雅))

  (设置画布 '(宽度 400 高度 600 边距 20))
  (标题字体 '毛笔楷体)
  (自动缩放 '(最小字号 16))

  (配色风格 '((背景色 (蒙德里安风格 设计感))
              (主要文字 (楷体 粉笔灰))))

  (卡片元素 ((居中标题 "汉语新解")
             分隔线
             (排版输出 用户输入)
             (排版输出 解释)))

  ;; 输出完整的SVG代码，包括所有必要的元素和样式
  (output-svg-code))

(defun start ()
  "启动时运行"
  (let (system-role 新汉语老师)
    (print "说吧, 他们又用哪个词来忽悠你了?")))

;; 运行规则
;; 1. 根据用户输入调用主函数 (汉语新解 用户输入)
;; 2. SVG-Card 函数应该生成并返回完整的SVG代码字符串
;; 3. 输出的SVG代码应该是有效的、可以直接在浏览器中显示的
;; 4. SVG代码应包含所有必要的元素，如<svg>标签、背景、文本等
;; 5. 使用design-rule和design-principles来指导SVG的设计
;; 6. 确保SVG代码符合现代Web标准和最佳实践

`

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
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-grow">
        <div className="space-y-4 p-4">
          {prompts.map((prompt) => (
            <div 
              key={prompt.id} 
              className={`p-4 rounded-lg border w-full ${
                prompt.id === activePromptId ? 'bg-gray-700 border-gray-600' : 'bg-gray-500 border-gray-400'
              }`}
            >
              <h3 className="font-medium text-lg mb-2 text-white">{prompt.name}</h3>
              <p className="text-sm mb-4 line-clamp-2 text-gray-300">{prompt.content}</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(prompt)}>编辑</Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(prompt.id!)}>删除</Button>
                {prompt.id !== activePromptId && (
                  <Button size="sm" variant="default" onClick={() => onActivate(prompt.id!)}>激活</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-700 flex justify-between">
        <Button onClick={() => handleEdit({ id: '', name: '', content: '', isActive: false })} >
          新建提示词
        </Button>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[60vh]">
          <DrawerHeader>
            <DrawerTitle>{editingPrompt?.id ? '编辑提示词' : '新建提示词'}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4 flex-grow overflow-y-auto">
            <Label htmlFor="promptName">提示词名称</Label>
            <Input
              id="promptName"
              value={editingPrompt?.name || ''}
              onChange={(e) => setEditingPrompt({ ...editingPrompt!, name: e.target.value })}
              placeholder="输入提示词名称"
            />
            <Label htmlFor="promptContent">提示词内容</Label>
            <Textarea
              id="promptContent"
              value={editingPrompt?.content || defaultPrompt}
              onChange={(e) => setEditingPrompt({ ...editingPrompt!, content: e.target.value })}
              className="min-h-[600px]"
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