import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { email, password, name } = await request.json()

  // 验证邮箱是否以 senseauto.com 结尾
  if (!email.endsWith('@senseauto.com')) {
    return NextResponse.json({ error: '邮箱必须以 senseauto.com 结尾' }, { status: 400 })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    // 创建初始组件文件
    const initialComponent = `
export default function UserComponent() {
  return (
    <div>
      <h1>Welcome, ${name}!</h1>
      <p>This is your initial component.</p>
    </div>
  )
}
`
    const componentPath = path.join(process.cwd(), 'src', 'components', 'generated', `${user.id}.tsx`)
    await fs.writeFile(componentPath, initialComponent)

    // 创建用户配置
    await prisma.userConfig.create({
      data: {
        userId: user.id,
        model: 'default_model',
        size: 'default_size',
        customSize: null,
      },
    })

    return NextResponse.json({ message: '用户注册成功', userId: user.id })
  } catch (error) {
    console.error('注册失败:', error)
    return NextResponse.json({ error: '注册失败' }, { status: 500 })
  }
}