import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { config } from '@/lib/config'
import fs from 'fs/promises'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
  baseURL: config.openaiBaseUrl
})

const sysPrompt = config.uiGeneratorSystemPrompt

const defaultComponent = `
export default function WelcomeComponent() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">欢迎使用 Flex UI 生成器</h1>
      <p className="text-lg text-gray-600">开始输入您的需求，生成自定义 UI 组件！</p>
    </div>
  )
}
`

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { query, userId, code, action } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 })
    }

    const fileName = `${userId}.tsx`
    const filePath = path.join(process.cwd(), 'src', 'components', 'generated', fileName)

    if (action === 'save') {
      if (!code) {
        return NextResponse.json({ error: '代码不能为空' }, { status: 400 })
      }
      await fs.writeFile(filePath, code)
      return NextResponse.json({ success: true, message: '代码已保存' })
    }

    if (action === 'get' || !query) {
      try {
        const existingCode = await fs.readFile(filePath, 'utf-8')
        return NextResponse.json({ success: true, componentPath: fileName, code: existingCode })
      } catch {
        // 如果文件不存在，返回默认组件
        return NextResponse.json({ success: true, componentPath: fileName, code: defaultComponent })
      }
    }

    const messages = [
      { role: 'system' as const, content: sysPrompt },
      { role: 'user' as const, content: '请根据用户的 query 直接设计一个 TSX的代码进行回复，直接返回代码（放在 ```tsx 和 ``` 之间），不要有任何的解释，下面是用户的需求：' + query }
    ]

    const response = await openai.chat.completions.create({
      model: config.openaiModel,
      messages,
      temperature: 0.7,
    })

    const content = response.choices[0].message.content
    console.log('content:', content)
    if (!content) {
      throw new Error('OpenAI 返回了空响应')
    }

    const codeBlock = extractCodeBlock(content)
    if (!codeBlock) {
      throw new Error('响应中未找到TSX代码块')
    }

    const fullComponentCode = codeBlock
      .replace(/import\s+React\s+from\s+['"]react['"];?\n?/g, '')
      .trim()

    await fs.writeFile(filePath, fullComponentCode)

    // 在成功生成代码后
    await prisma.code.create({
      data: {
        userId,
        query,
        content: fullComponentCode,
      },
    })

    return NextResponse.json({ success: true, componentPath: fileName, code: fullComponentCode })
  } catch (error) {
    console.error('生成或保存UI时发生错误:', error)
    return NextResponse.json({ error: '生成或保存UI时发生错误' }, { status: 500 })
  }
}
function extractCodeBlock(content: string): string | null {
  const codeBlockRegex = /```(?:jsx?|tsx?)\n([\s\S]*?)```/
  const match = content.match(codeBlockRegex)
  return match ? match[1].trim() : null
}
