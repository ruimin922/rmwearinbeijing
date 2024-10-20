import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { FaDownload, FaCopy } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useUser } from '@clerk/nextjs'

interface SVGPreviewProps {
  svgCode: string
  onClose: () => void
}

export function SVGPreview({ svgCode, onClose }: SVGPreviewProps) {
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null)
  const { user } = useUser()
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (svgCode && svgContainerRef.current) {
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml')
      const svgElement = svgDoc.documentElement

      const viewBox = svgElement.getAttribute('viewBox')
      const width = svgElement.getAttribute('width')
      const height = svgElement.getAttribute('height')

      let dimensions = { width: 0, height: 0 }

      if (viewBox) {
        const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)
        dimensions = { width: vbWidth, height: vbHeight }
      } else if (width && height) {
        dimensions = { width: parseFloat(width), height: parseFloat(height) }
      }

      setSvgDimensions(dimensions)
    }
  }, [svgCode])

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
      toast.error('下载 SVG 失败')
    }
  }

  const handleGeneratePNG = () => {
    try {
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgCode, 'image/svg+xml')
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
        img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgCode)))}`
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
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold">详细预览</h4>
        <div className="flex items-center">
          <Button 
            onClick={handleDownloadSVG} 
            variant="outline"
            size="sm"
            className="mr-2"
          >
            <FaDownload className="h-4 w-4 mr-1" />
            SVG
          </Button>
          {!pngDataUrl ? (
            <Button 
              onClick={handleGeneratePNG} 
              variant="outline"
              size="sm"
              className="mr-2"
            >
              <FaDownload className="h-4 w-4 mr-1" />
              PNG
            </Button>
          ) : (
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
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-inner flex justify-center items-center">
        {svgCode ? (
          <div 
            ref={svgContainerRef}
            className="w-full flex justify-center"
            style={{ 
              height: svgDimensions ? `${svgDimensions.height}px` : 'auto',
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div 
              dangerouslySetInnerHTML={{ 
                __html: svgCode.replace(
                  /<svg/, 
                  '<svg style="width: auto; height: 100%;" preserveAspectRatio="xMidYMid meet"'
                ) 
              }} 
              className="h-full"
            />
          </div>
        ) : (
          <div className="text-muted-foreground">等待生成 SVG...</div>
        )}
      </div>
    </div>
  )
}
