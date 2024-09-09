import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { query, prompt, imageUrl } = await request.json()

  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = parseInt(decoded.userId, 10)

    await prisma.image.create({
      data: {
        query,
        prompt,
        url: imageUrl,
        userId: userId
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('记录生成错误:', error)
    return NextResponse.json({ error: '记录生成失败' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}