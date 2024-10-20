import React, { useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FaPaperPlane } from 'react-icons/fa'
import { 
  Loader2, 
  Maximize2, 
  Minimize2,
  Paperclip,
  History,
  MessageCirclePlus,
  Send
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
  useEffect(() => {
    if (!selectedBot) {
      handleBotSelection(BOTS[0])
    }
  }, [selectedBot, handleBotSelection])

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col">
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
            onClick={handleFileUpload} 
            variant="ghost"
            size="icon"
            className="h-6 w-6"
          >
            <Paperclip className="text-xl" />
          </Button>
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
          placeholder="描述你想要的 SVG 图像..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`flex-grow mb-2 transition-all duration-300 ${isExpanded ? 'h-[500px]' : 'h-[150px]'} resize-none`}
          disabled={isLoading}
        />
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
        <Button 
          onClick={toggleExpand}
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-12 mb-1"
        >
          {isExpanded ? <Maximize2  className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || isAIResponding}
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 mb-1"
        >
          {isLoading || isAIResponding ? 
            <Loader2 className="h-4 w-4 animate-spin" /> :
            <FaPaperPlane className="h-4 w-4" />
          }
        </Button>
      </div>
    </form>
  )
}

export default BotInput
