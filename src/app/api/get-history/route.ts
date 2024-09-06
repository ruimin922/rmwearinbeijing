import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const LOG_FILE = path.join(process.cwd(), 'generation-log.json')
const PAGE_SIZE = 10 // 每页显示的记录数

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  try {
    const fileContent = await fs.readFile(LOG_FILE, 'utf-8')
    const history = JSON.parse(fileContent).reverse() // 倒序排列整个历史记录
    
    const startIndex = (page - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    const paginatedHistory = history.slice(startIndex, endIndex)
    
    return NextResponse.json({
      history: paginatedHistory,
      totalPages: Math.ceil(history.length / PAGE_SIZE),
      currentPage: page
    })
  } catch (error) {
    console.error('Error reading generation history:', error)
    return NextResponse.json({ error: 'Failed to read generation history' }, { status: 500 })
  }
}