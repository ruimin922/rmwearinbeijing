import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = 10

  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const userId = parseInt(decoded.userId, 10)

    const totalItems = await prisma.image.count({ where: { userId } })
    const totalPages = Math.ceil(totalItems / pageSize)

    const images = await prisma.image.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        url: true,
        query: true,
        prompt: true,
        createdAt: true
      }
    })

    const history = images.map(img => ({
      imageUrl: img.url,
      query: img.query,
      prompt: img.prompt,
      timestamp: img.createdAt.toISOString()
    }))

    return NextResponse.json({ history, totalPages, currentPage: page })
  } catch (error) {
    console.error('获取历史记录错误:', error)
    return NextResponse.json({ error: '获取历史记录失败' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}