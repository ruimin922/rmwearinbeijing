import { NextResponse } from 'next/server'

const API_KEY = 'sk-Lrb3z4qG52yAxBzUD5E7A256480e43B09e39F37d38EbEeB3'
const API_URL = 'https://api.bltcy.ai/v1/images/generations'

export async function POST(request: Request) {
  console.log('开始处理图像生成请求')
  
  const { query, size, model } = await request.json()
  console.log(`请求参数: query=${query}, size=${size}, model=${model}`)

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model, // 使用从前端传来的 model 参数
        prompt: query,
        n: 1,
        size: size,
      }),
    })

    if (!response.ok) {
      console.error(`API 请求失败: ${response.status} ${response.statusText}`)
      throw new Error('API request failed')
    }

    const data = await response.json()
    console.log('图像生成成功')
    return NextResponse.json({ imageUrl: data.data[0].url })
  } catch (error) {
    console.error('图像生成错误:', error)
    return NextResponse.json({ error: '生成图像失败' }, { status: 500 })
  } finally {
    console.log('图像生成请求处理完成')
  }
}