import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'config.json')

export async function GET() {
  try {
    const fileContent = await fs.readFile(CONFIG_FILE, 'utf-8')
    const config = JSON.parse(fileContent)
    return NextResponse.json(config)
  } catch (error) {
    console.error('读取配置错误:', error)
    return NextResponse.json({ error: '读取配置失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json()
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新配置错误:', error)
    return NextResponse.json({ error: '更新配置失败' }, { status: 500 })
  }
}