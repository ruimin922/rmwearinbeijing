// 导入必要的依赖
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 创建Supabase客户端的函数
export function createClient() {
  // 获取cookie存储
  const cookieStore = cookies()

  // 创建并返回Supabase服务器客户端
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 获取所有cookie
        getAll() {
          return cookieStore.getAll()
        },
        // 设置多个cookie
        setAll(cookiesToSet) {
          try {
            // 遍历并设置每个cookie
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 如果在服务器组件中调用setAll方法，会捕获到错误
            // 如果有中间件刷新用户会话，可以忽略此错误
          }
        },
      },
    }
  )
}