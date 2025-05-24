import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// 获取当前用户ID的辅助函数（后续可对接真实认证）
const getUserId = () => 'mock-user-id' // TODO: 替换为真实用户ID

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const body = await req.json()
  const { data, error } = await supabase
    .from('clothes')
    .insert([{ ...body }])
    .select()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data[0])
}

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(req.url)
  const user_id = searchParams.get('user_id')
  if (!user_id) {
    return NextResponse.json([], { status: 200 })
  }
  const { data, error } = await supabase
    .from('clothes')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
} 