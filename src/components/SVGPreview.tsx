import React from 'react'
import { Button } from "@/components/ui/button"
import { FaTimes, FaDownload } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

interface SVGPreviewProps {
  svgCode: string
  onClose: () => void
}

export function SVGPreview({ svgCode, onClose }: SVGPreviewProps) {
  const handleDownloadSVG = () => {
    try {
      const blob = new Blob([svgCode], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'flexsvg_com_generated_svg.svg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('SVG 已下载')
    } catch (error) {
      console.error('下载 SVG 失败:', error)
      toast.error('下载 SVG 失败')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg flex flex-col w-full h-full sm:w-auto sm:h-auto" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">预览</h3>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleDownloadSVG}>
              <FaDownload className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <FaTimes className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-grow overflow-auto">
          {svgCode ? (
            <div className="flex items-center justify-center h-full">
              <div dangerouslySetInnerHTML={{ __html: svgCode.replace(/<svg/, '<svg style="max-width: 100%; max-height: 100%;" preserveAspectRatio="xMidYMid meet"') }} />
            </div>
          ) : (
            <div className="text-gray-500">等待生成 SVG...</div>
          )}
        </div>
      </div>
    </div>
  )
}