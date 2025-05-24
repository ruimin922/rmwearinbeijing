'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SEASONS = ['春', '夏', '秋', '冬']
const STYLES = ['休闲', '运动']

const ClothesUpload = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])

  const handleSeasonChange = (season: string) => {
    setSelectedSeasons(prev =>
      prev.includes(season) ? prev.filter(s => s !== season) : [...prev, season]
    )
  }

  const handleStyleChange = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name'),
      category: formData.get('category'),
      season: selectedSeasons,
      tags: [
        ...(formData.get('tags') as string).split(/[\s,，]+/).filter(Boolean),
        ...selectedStyles,
      ],
      image_url: '', // 你可以在这里处理图片上传
      description: formData.get('description'),
    }

    const res = await fetch('/api/clothes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)
    if (res.ok) {
      router.refresh()
      alert('添加成功')
      e.currentTarget.reset()
      setSelectedSeasons([])
      setSelectedStyles([])
    } else {
      alert('添加失败')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-white rounded shadow">
      <label className="block text-black font-bold mb-1">衣物名称</label>
      <input
        name="name"
        placeholder="衣物名称"
        required
        className="block w-full border rounded p-2 text-black bg-white"
      />

      <label className="block text-black font-bold mb-1">类别</label>
      <select
        name="category"
        required
        className="block w-full border rounded p-2 text-black bg-white"
      >
        <option value="">请选择类别</option>
        <option value="上衣">上衣</option>
        <option value="裤子">裤子</option>
        <option value="裙子">裙子</option>
        <option value="外套">外套</option>
        <option value="鞋子">鞋子</option>
      </select>

      <label className="block text-black font-bold mb-1">季节</label>
      <div className="flex gap-4 mb-2">
        {SEASONS.map(season => (
          <label key={season} className="flex items-center text-black font-bold">
            <input
              type="checkbox"
              checked={selectedSeasons.includes(season)}
              onChange={() => handleSeasonChange(season)}
              className="mr-1"
            />
            {season}
          </label>
        ))}
      </div>

      <label className="block text-black font-bold mb-1">风格</label>
      <div className="flex gap-4 mb-2">
        {STYLES.map(style => (
          <label key={style} className="flex items-center text-black font-bold">
            <input
              type="checkbox"
              checked={selectedStyles.includes(style)}
              onChange={() => handleStyleChange(style)}
              className="mr-1"
            />
            {style}
          </label>
        ))}
      </div>

      <label className="block text-black font-bold mb-1">标签（用逗号或空格分隔）</label>
      <input
        name="tags"
        placeholder="标签（用逗号或空格分隔）"
        className="block w-full border rounded p-2 text-black bg-white"
      />

      {/* 这里可以加图片上传功能 */}
      {/* <input type="file" name="image" className="block w-full" /> */}

      <label className="block text-black font-bold mb-1">描述</label>
      <textarea
        name="description"
        placeholder="描述"
        className="block w-full border rounded p-2 text-black bg-white"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            (document.activeElement as HTMLButtonElement).form?.reset()
            setSelectedSeasons([])
            setSelectedStyles([])
          }}
          className="px-4 py-2 rounded bg-black text-white"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          {loading ? '上传中...' : '添加'}
        </button>
      </div>
    </form>
  )
}

export default ClothesUpload 