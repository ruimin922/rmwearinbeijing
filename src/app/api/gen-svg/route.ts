import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { config } from '@/lib/config'
import { PrismaClient } from '@prisma/client'

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
  baseURL: config.openaiBaseUrl
})

const prisma = new PrismaClient()


export async function POST(req: NextRequest) {
  const { query, userId, sysPrompt } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 })
  }

  const messages = [
    { role: 'system' as const, content: sysPrompt || defaultSysPrompt },
    { role: 'user' as const, content: '请根据以下描述生成 SVG 代码：' + query }
  ]

  try {
    const stream = await openai.chat.completions.create({
      model: config.openaiModel,
      messages,
      temperature: 0.7,
      stream: true,
    })

    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          controller.enqueue(encoder.encode(content))
        }
        controller.close()
      },
    })

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