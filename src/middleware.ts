import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(
  [
    '/sign-in(.*)', 
    '/sign-up(.*)', 
    '/', 
    '/api/clerk-webhooks(.*)'
  ])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    // 跳过 Next.js 内部路由和所有静态文件，除非在搜索参数中找到
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 始终为 API 路由运行
    '/(api|trpc)(.*)',
  ],
}