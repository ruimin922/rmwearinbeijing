import { NextResponse } from 'next/server'

const API_KEY = 'sk-Lrb3z4qG52yAxBzUD5E7A256480e43B09e39F37d38EbEeB3'
const API_URL = 'https://api.bltcy.ai/v1/chat/completions'

export async function POST(request: Request) {
  const { query, systemPrompt } = await request.json()

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `请为以下主题生成Flux壁纸prompt：<${query}>,生成的prompt 放在代码块 text 中`
          }
        ],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    const content = data.choices[0].message.content.trim()
    const match = content.match(/```(?:text\s*)?([\s\S]*?)```/)
    const rewrittenPrompt = match ? match[1].trim() : content

    return NextResponse.json({ rewrittenPrompt })
  } catch (error) {
    console.error('Error rewriting prompt:', error)
    return NextResponse.json({ error: 'Failed to rewrite prompt' }, { status: 500 })
  }
}