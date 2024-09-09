import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { email, password } = await request.json()

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      console.error(`登录失败: 用户不存在 (邮箱: ${email})`)
      return NextResponse.json({ error: '用户不存在' }, { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.error(`登录失败: 密码错误 (邮箱: ${email})`)
      return NextResponse.json({ error: '密码错误' }, { status: 400 })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' })

    const response = NextResponse.json({ message: '登录成功', userId: user.id })
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })

    console.log(`登录成功: 用户 ${user.id} (邮箱: ${email})`)
    return response
  } catch (error) {
    console.error(`登录失败: ${error instanceof Error ? error.message : '未知错误'}`)
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}