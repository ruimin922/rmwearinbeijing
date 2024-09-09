import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getUserId(): Promise<number | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return parseInt(decoded.userId)
  } catch (error) {
    console.error('验证 token 错误:', error)
    return null
  }
}

export async function GET() {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const userConfig = await prisma.userConfig.findUnique({
      where: { userId }
    })

    if (!userConfig) {
      return NextResponse.json({ error: '未找到用户配置' }, { status: 404 })
    }

    const activeSystemPrompt = await prisma.systemPrompt.findFirst({
      where: { userId, isActive: true }
    })

    return NextResponse.json({
      model: userConfig.model,
      size: userConfig.size,
      customSize: userConfig.customSize,
      systemPrompt: activeSystemPrompt?.content || ''
    })
  } catch (error) {
    console.error('读取配置错误:', error)
    return NextResponse.json({ error: '读取配置失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const config = await request.json()
    await prisma.userConfig.upsert({
      where: { userId },
      update: {
        model: config.model,
        size: config.size,
        customSize: config.customSize
      },
      create: {
        userId,
        model: config.model,
        size: config.size,
        customSize: config.customSize
      }
    })

    if (config.systemPrompt) {
      await prisma.systemPrompt.updateMany({
        where: { userId },
        data: { isActive: false }
      })

      await prisma.systemPrompt.create({
        data: {
          userId,
          type: 'image',
          content: config.systemPrompt,
          isActive: true
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新配置错误:', error)
    return NextResponse.json({ error: '更新配置失败' }, { status: 500 })
  }
}