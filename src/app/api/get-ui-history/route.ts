import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { userId } = await request.json()

  try {
    const history = await prisma.code.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error fetching UI generation history:', error)
    return NextResponse.json({ error: 'Failed to fetch UI generation history' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}