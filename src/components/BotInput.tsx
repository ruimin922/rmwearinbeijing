import React, { useCallback, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Loader2, 
  Maximize2, 
  Minimize2,
  Paperclip,
  History,
  MessageCirclePlus,
  ArrowUp
} from "lucide-react"

interface BotInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleFormSubmit: (e: React.FormEvent) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
  isAIResponding: boolean
  isExpanded: boolean
  toggleExpand: (e: React.MouseEvent) => void
  handleFileUpload: (e: React.MouseEvent) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBotSelection: (bot: string) => void
  selectedBot: string
}

const BOTS = ['🎨 默认SVG', '🤔 思考者', '🏷️ LOGO设计', '😊 卡通形象']

const BotInput: React.FC<BotInputProps> = ({
  input,
  handleInputChange,
  handleFormSubmit,
  handleKeyDown,
  isLoading,
  isAIResponding,
  isExpanded,
  toggleExpand,
  handleFileUpload,
  handleFileChange,
  handleBotSelection,
  selectedBot
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedBot) {
      handleBotSelection(BOTS[0])
    }
    inputRef.current?.focus();
  }, [selectedBot, handleBotSelection])

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="sticky bottom-0 mx-auto w-full pt-6 flex flex-col gap-4 items-center">
      <div className="w-full flex flex-col gap-1 bg-[#F4F4F4] p-2.5 pl-4 rounded-md border border-b-0 rounded-b-none shadow-md">
        <div className="flex justify-between mb-4 items-center">
          <div className="flex space-x-2 items-center">
            {BOTS.map((bot) => (
              <Button
                key={bot} 
                onClick={(e) => {
                  e.preventDefault()
                  handleBotSelection(bot)
                }}
                variant={selectedBot === bot ? "default" : "outline"}
                size="sm"
                className={`rounded-full text-xs flex items-center h-8 ${selectedBot === bot ? 'bg-opacity-50' : ''}`}
              >
                {bot}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => e.preventDefault()}
            >
              <History className="text-xl" />
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => e.preventDefault()}
            >
              <MessageCirclePlus className="text-xl" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Textarea
            ref={inputRef}
            placeholder="描述你想要的 SVG 图像..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`flex-grow mb-2 transition-all duration-300 ${isExpanded ? 'h-[500px]' : 'h-[120px]'} resize-none bg-transparent border-none focus-within:outline-none`}
            disabled={isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <Button 
            onClick={toggleExpand}
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-20 mb-1"
          >
            {isExpanded ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button 
            onClick={handleFileButtonClick}
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-12 mb-1"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button 
            type="submit" 
            onClick={handleFormSubmit}
            disabled={isLoading || isAIResponding}
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 mb-1"
          >
            {isLoading || isAIResponding ? 
              <Loader2 className="h-4 w-4 animate-spin" /> :
              <ArrowUp className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BotInput
