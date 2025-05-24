'use client'

import React from 'react'
import { ArrowRight, Check, LayoutDashboard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import Header, { NavItem } from '@/components/Header'

const homeNavItems: NavItem[] = [
  { href: "#features", label: "功能", isActive: false },
  { href: "#pricing", label: "价格", isActive: false },
  { href: "#reviews", label: "评价", isActive: false },
  { href: "#faq", label: "FAQ", isActive: false },
  { href: "#vs", label: "对比", isActive: false },
  { href: "/dashboard", label: "开始搭配", isActive: false },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#222]">
      <Header navItems={homeNavItems} position="relative" bgColor="bg-transparent" textColor="text-[#222]" />

      <main>
        <section className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-16 px-8 py-8 lg:pt-20 lg:pb-0 relative">
          <div className="max-w-4xl flex flex-col gap-10 items-center justify-center text-center z-10">
            <p className="border border-[#a6192e] px-4 py-1 rounded bg-[#a6192e]/10 text-sm text-[#a6192e]">
              专为 <b>天气感知弱且穿搭困难者</b> 打造的智能穿搭助手
            </p>
            <h1 className="font-extrabold text-6xl lg:text-7xl tracking-tight md:-mb-4 text-[#222]">
              <p className="leading-tight">AI驱动的智能穿搭推荐</p>
            </h1>
            <p className="text-lg opacity-80 leading-relaxed text-pretty">
              WearInBeijing 根据实时天气和您的衣柜，为您推荐最适合的穿搭方案。告别穿搭困扰，轻松应对多变天气（特别是在北京）。
            </p>
            <Link href="/dashboard">
              <Button
                className="text-lg px-8 py-6 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors"
                aria-label="开始搭配"
                tabIndex={0}
              >
                开始搭配 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="hidden lg:flex w-full max-h-[600px] overflow-hidden rounded-t-[30px] border-8 border-b-0 border-[#e0e0e0] shadow-2xl">
            <AspectRatio ratio={16/9}>
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/mujistyle.jpg"
                  alt="MUJI风格展示"
                  className="w-full object-cover object-top transition-transform duration-700 ease-in-out hover:translate-y-[-20%]"
                />
              </div>
            </AspectRatio>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
            <h2 className="max-w-3xl mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8 text-pretty text-[#222]">
              穿搭困扰？不再是问题！
            </h2>
            <p className="mx-auto leading-relaxed mb-12 md:mb-20 text-pretty max-w-screen-lg">
              天气多变？不知道穿什么？搭配太费时间？WearInBeijing 为您解决一切！
            </p>
            <div className="lg:gap-[1px] gap-4 grid grid-cols-2 lg:grid-cols-4 lg:rounded-xl overflow-hidden text-xl lg:shadow">
              {[
                { img: "/dog1.jpg", text: "天气多变难适应" },
                { img: "/dog2.jpg", text: "搭配选择困难" },
                { img: "/dog1.jpg", text: "衣柜管理混乱" },
                { img: "/dog2.jpg", text: "穿搭时间过长" },
              ].map((item, index) => (
                <div key={index} className="aspect-auto lg:aspect-square overflow-hidden">
                  <div className="flex flex-col items-center lg:hover:-translate-y-24 transition-all duration-300 lg:rounded-none rounded-xl overflow-hidden shadow lg:shadow-none">
                    <img src={item.img} alt={`problem${index + 1}`} className="aspect-square object-cover shadow-xl opacity-90" />
                    <p className="bg-[#f5f5f5] text-[#222] p-2 w-full h-24 items-center flex justify-center">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
            <h2 className="max-w-screen-lg mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8 text-pretty text-[#222]">
              穿搭效率低？搭配不理想？
            </h2>
            <p className="mx-auto leading-relaxed mb-12 md:mb-20 text-pretty max-w-screen-lg">
              85%的北京市民每天花费超过15分钟在穿搭选择上，却仍然对搭配效果不满意。
            </p>
            <div className="max-w-screen-lg mx-auto">
              <AspectRatio ratio={3} className="rounded-xl overflow-hidden">
                <img
                  src="/solve.jpg"
                  alt="极简风格展示"
                  className="object-cover w-full h-full dark:brightness-75 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-105"
                />
              </AspectRatio>
            </div>
            <p className="text-lg font-semibold mt-24">
              我们有个更智能的解决方案 ↓
            </p>
          </div>
        </section>

        <section className="bg-[#f5f5f5]" id="vs">
          <div className="max-w-6xl mx-auto px-8 py-16 md:py-40 text-[#222]">
            <h2 className="text-center font-black text-3xl md:text-5xl tracking-tight mb-12 md:mb-20">
              WearInBeijing 与其他工具对比
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center md:items-start gap-8 md:gap-0">
              <Card className="h-full bg-white p-8 md:p-10 rounded-xl w-full shadow-xl">
                <CardHeader>
                  <CardTitle className="font-bold text-lg mb-4 text-[#a6192e]">传统方式：</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1.5">
                    {[
                      "手动查看天气预报",
                      "凭感觉选择穿搭",
                      "反复试穿浪费时间",
                      "搭配效果不理想",
                    ].map((item, index) => (
                      <li key={index} className="flex gap-2 items-center text-[#222] font-medium">
                        <ArrowRight className="w-4 h-4 shrink-0 text-[#a6192e]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="h-full bg-white text-[#222] p-8 md:p-10 rounded-xl w-full md:scale-110 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-bold text-lg mb-4 text-[#a6192e]">WearInBeijing：</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1.5">
                    {[
                      "实时天气智能分析",
                      "AI个性化穿搭推荐",
                      "智能衣柜管理",
                      "一键生成穿搭方案",
                      "节省时间提升效率",
                    ].map((item, index) => (
                      <li key={index} className="flex gap-2 items-center">
                        <Check className="w-4 h-4 shrink-0 text-[#a6192e]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-center font-bold text-3xl md:text-5xl mb-12 text-[#222]">
              选择适合您的计划
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "基础版",
                  price: "¥29",
                  features: [
                    "每日穿搭推荐",
                    "基础天气提醒",
                    "标准衣柜管理",
                    "基础搭配建议"
                  ]
                },
                {
                  title: "专业版",
                  price: "¥59",
                  features: [
                    "无限穿搭推荐",
                    "详细天气分析",
                    "智能衣柜管理",
                    "个性化搭配方案"
                  ]
                },
                {
                  title: "家庭版",
                  price: "¥99",
                  features: [
                    "全家穿搭推荐",
                    "多账号管理",
                    "24/7智能助手",
                    "季节穿搭规划"
                  ]
                }
              ].map((plan, index) => (
                <div key={index} className="bg-white rounded-lg shadow-xl p-8">
                  <h3 className="text-xl font-bold mb-4 text-[#a6192e]">{plan.title}</h3>
                  <p className="text-3xl font-bold mb-6 text-[#222]">{plan.price}<span className="text-sm font-normal">/月</span></p>
                  <ul className="mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center mb-2">
                        <Check className="w-5 h-5 text-[#a6192e] mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-[#a6192e] hover:bg-[#8e1626] text-white rounded">选择方案</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#444] text-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
            <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
              <Link href="/" className="flex gap-2 justify-center md:justify-start items-center">
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-7 h-7 text-[#333]" />
                  <strong className="font-extrabold tracking-tight text-base md:text-lg text-white">WearInBeijing</strong>
                </span>
              </Link>
              <p className="mt-1 text-xs font-semibold text-gray-200">智能穿搭推荐</p>
              <p className="mt-3 text-sm text-gray-200">
                WearInBeijing 是由 qianruimin 和 AI 驱动的智能穿搭助手。根据实时天气和您的衣柜，为您推荐最适合的穿搭方案。
              </p>
              <p className="mt-3 text-sm text-gray-400">
                Copyright © 2025 - All rights reserved
              </p>
            </div>
            <div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
              <div className="lg:w-1/3 md:w-1/2 w-full px-4">
                <div className="footer-title font-semibold tracking-widest text-sm md:text-left mb-3 text-white">
                  链接
                </div>
                <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                  <a href="#features" className="link link-hover text-gray-200">功能</a>
                  <a href="mailto:support@wearinbeijing.com" target="_blank" className="link link-hover text-gray-200" aria-label="联系支持">
                    支持
                  </a>
                  <a href="#pricing" className="link link-hover text-gray-200">价格</a>
                  <a href="/blog" className="link link-hover text-gray-200">穿搭指南</a>
                </div>
              </div>
              <div className="lg:w-1/3 md:w-1/2 w-full px-4">
                <div className="footer-title font-semibold tracking-widest text-sm md:text-left mb-3 text-white">
                  法律
                </div>
                <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                  <a href="/tos" className="link link-hover text-gray-200">服务条款</a>
                  <a href="/privacy-policy" className="link link-hover text-gray-200">隐私政策</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
