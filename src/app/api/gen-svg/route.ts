import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { config } from '@/lib/config'
import { PrismaClient } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
})

const prisma = new PrismaClient()
const defaultSysPrompt = '你是一个 SVG 设计师，请根据用户的需求生成 SVG 代码。'

export async function POST(req: NextRequest) {
  console.log('收到 POST 请求')
  const { query, userId } = await req.json()
  console.log(`请求参数: query=${query}, userId=${userId}`)

  if (!userId) {
    console.error('用户ID为空')
    return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 })
  }

  // 获取用户当前激活的 prompt
  const activePrompt = await prisma.prompt.findFirst({
    where: { userId: userId, isActive: true }
  })

  const sysPrompt = activePrompt?.content || defaultSysPrompt

  const messages = [
    { role: 'system' as const, content: sysPrompt },
    { role: 'user' as const, content: query }
  ]
  console.log('构建的消息:', messages)

  try {
    console.log('开始调用 OpenAI API')
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'claude-3-5-sonnet-20240620',
      messages,
      temperature: 0.5,
      stream: true,
    })
    console.log('成功获取 OpenAI 流')

    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        console.log('开始处理流')
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          controller.enqueue(encoder.encode(content))
        }
        console.log('流处理完成')
        controller.close()
      },
    })

    console.log('返回自定义流响应')
    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('生成 SVG 时发生错误:', error)
    return NextResponse.json({ error: '生成 SVG 时发生错误' }, { status: 500 })
  }
}