import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { FaTimes, FaDownload, FaCopy } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useUser } from '@clerk/nextjs'

interface SVGPreviewProps {
  svgCode: string
  onClose: () => void
}

export function SVGPreview({ svgCode, onClose }: SVGPreviewProps) {
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null)
  const { user } = useUser()

  const getUserName = () => {
    return user?.firstName || user?.username || 'GLBai'
  }

  const handleDownloadSVG = () => {
    try {
      // 添加水印
      const watermarkedSVG = svgCode.replace(
        '</svg>',
        `<text x="10" y="95%" font-family="Arial Black, sans-serif" font-size="12" fill="#999">FlexSVG.com@${getUserName()}</text></svg>`
      )
      
      const blob = new Blob([watermarkedSVG], { type: 'image/svg+xml' })
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
      toast.error('下载 SVG 失败')
    }
  }

  const handleGeneratePNG = () => {
    try {
      // 添加水印
      const watermarkedSVG = svgCode.replace(
        '</svg>',
        `<text x="10" y="95%" font-family="Arial Black, sans-serif" font-size="12" fill="#999">FlexSVG.com@${getUserName()}</text></svg>`
      )
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(watermarkedSVG, 'image/svg+xml')
      const svgElement = svgDoc.documentElement

      const svgWidth = svgElement.getAttribute('width')
      const svgHeight = svgElement.getAttribute('height')
      const viewBox = svgElement.getAttribute('viewBox')

      let width = 1000 // 默认宽度
      let height = 1000 // 默认高度

      if (svgWidth && svgHeight) {
        width = parseInt(svgWidth)
        height = parseInt(svgHeight)
      } else if (viewBox) {
        const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)
        width = vbWidth
        height = vbHeight
      }

      const scale = 2 // 缩放因子，增加分辨率
      const canvas = document.createElement('canvas')
      canvas.width = width * scale
      canvas.height = height * scale

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(scale, scale)
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
          const dataUrl = canvas.toDataURL('image/png')
          setPngDataUrl(dataUrl)
          toast.success('PNG 已生成')
        }
        img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(watermarkedSVG)))}`
      }
    } catch (error) {
      toast.error('生成 PNG 失败')
    }
  }

  const handleDownloadPNG = () => {
    if (pngDataUrl) {
      const link = document.createElement('a')
      link.href = pngDataUrl
      link.download = 'flexsvg_com_generated_image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('PNG 已下载')
    } else {
      toast.error('请先生成 PNG')
    }
  }

  const handleCopyPNG = async () => {
    if (pngDataUrl) {
      try {
        const response = await fetch(pngDataUrl)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ])
        toast.success('PNG 已复制到剪贴板')
      } catch (error) {
        toast.error('复制 PNG 失败')
      }
    } else {
      toast.error('请先生成 PNG')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background p-4 rounded-lg flex flex-col w-full h-full sm:w-auto sm:h-auto" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-bold">预览</h4>
          <div className="flex items-center ml-6">
            <Button 
              onClick={handleDownloadSVG} 
              variant="outline"
              size="sm"
              className="mr-2"
            >
              <FaDownload className="h-4 w-4 mr-1" />
              SVG
            </Button>
            {!pngDataUrl && (
              <Button 
                onClick={handleGeneratePNG} 
                variant="outline"
                size="sm"
                className="mr-2"
              >
                <FaDownload className="h-4 w-4 mr-1" />
                PNG
              </Button>
            )}
            {pngDataUrl && (
              <>
                <Button 
                  onClick={handleDownloadPNG} 
                  variant="outline"
                  size="sm"
                  className="mr-2"
                >
                  <FaDownload className="h-4 w-4 mr-1" />
                  PNG
                </Button>
                <Button 
                  onClick={handleCopyPNG} 
                  variant="outline"
                  size="sm"
                  className="mr-2"
                >
                  <FaCopy className="h-4 w-4 mr-1" />
                  PNG
                </Button>
              </>
            )}
            <Button 
              onClick={onClose} 
              variant="outline"
              size="sm"
            >
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
            <div className="text-muted-foreground">等待生成 SVG...</div>
          )}
        </div>
      </div>
    </div>
  )
}