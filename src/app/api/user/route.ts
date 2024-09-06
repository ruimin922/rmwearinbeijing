import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return NextResponse.json(null)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await prisma.user.findUnique({ where: { id: parseInt(decoded.userId) } })

    if (!user) {
      return NextResponse.json(null)
    }

    return NextResponse.json({ id: user.id, email: user.email })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json(null)
  }
}