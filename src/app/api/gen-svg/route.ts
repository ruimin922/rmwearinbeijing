import { NextRequest, NextResponse } from 'next/server'
import { createOpenAI } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText } from 'ai';

export const maxDuration = 30;

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL
})

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  console.log('收到 POST 请求')
  const result = await streamText({
    model: openai('claude-3-5-sonnet-latest'),
    system: '你是一个 SVG 设计师，请根据用户的需求生成 SVG 代码。',
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse()
}