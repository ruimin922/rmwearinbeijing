import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const LOG_FILE = path.join(process.cwd(), 'generation-log.json')

export async function POST(request: Request) {
  const { query, prompt, imageUrl } = await request.json()

  const logEntry = {
    timestamp: new Date().toISOString(),
    query,
    prompt,
    imageUrl
  }

  try {
    let existingLog = []
    try {
      const fileContent = await fs.readFile(LOG_FILE, 'utf-8')
      existingLog = JSON.parse(fileContent)
    } catch (error) {
      // 如果文件不存在或为空，我们将使用空数组
    }

    existingLog.push(logEntry)

    await fs.writeFile(LOG_FILE, JSON.stringify(existingLog, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging generation:', error)
    return NextResponse.json({ error: 'Failed to log generation' }, { status: 500 })
  }
}