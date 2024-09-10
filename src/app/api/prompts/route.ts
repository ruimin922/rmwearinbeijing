import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
  }

  const prompts = await prisma.prompt.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(prompts)
}

export async function POST(request: NextRequest) {
  const { userId, name, content } = await request.json()

  const prompt = await prisma.prompt.create({
    data: { userId, name, content },
  })

  return NextResponse.json(prompt)
}

export async function PUT(request: NextRequest) {
  const { id, name, content } = await request.json()

  const prompt = await prisma.prompt.update({
    where: { id },
    data: { name, content },
  })

  return NextResponse.json(prompt)
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: '缺少提示词ID' }, { status: 400 })
  }

  try {
    await prisma.prompt.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: '删除提示词失败' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const { id, userId } = await request.json()

  try {
    await prisma.prompt.updateMany({
      where: { userId: parseInt(userId) },
      data: { isActive: false },
    })

    const prompt = await prisma.prompt.update({
      where: { id },
      data: { isActive: true },
    })

    return NextResponse.json(prompt)
  } catch (error) {
    return NextResponse.json({ error: '激活提示词失败' }, { status: 500 })
  }
}