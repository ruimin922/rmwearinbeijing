// src/app/api/save-component/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  const { code, userId } = await request.json()

  if (!code || !userId) {
    return NextResponse.json({ error: '代码或用户ID不能为空' }, { status: 400 })
  }

  try {
    const componentPath = path.join(process.cwd(), 'src', 'components', 'generated', `${userId}.tsx`)
    await fs.writeFile(componentPath, code)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('保存组件错误:', error)
    return NextResponse.json({ error: '保存组件失败' }, { status: 500 })
  }
}