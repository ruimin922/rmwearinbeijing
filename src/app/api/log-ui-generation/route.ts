import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { userId, query, code } = await request.json()

  try {
    await prisma.code.create({
      data: {
        userId,
        query,
        content: code, // 修改这里：使用 code 而不是 content
      },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging UI generation:', error)
    return NextResponse.json({ error: 'Failed to log UI generation' }, { status: 500 })
  }
}