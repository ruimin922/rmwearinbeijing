'use client'

import React from 'react'
import { ArrowRight, Check } from 'lucide-react'
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
  { href: "/dashboard", label: "免费海报编辑器", isActive: false },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1D1D35]">
      <Header navItems={homeNavItems} position="relative" bgColor="bg-transparent" textColor="text-[#1D1D35]" />

      <main>
        <section className="max-w-7xl mx-auto flex flex-col lg:flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:pt-20 lg:pb-0 relative">
          <div className="max-w-4xl flex flex-col gap-10 lg:gap-12 items-center justify-center text-center z-10">
            <p className="border border-flexsvg-blue px-4 py-1 rounded-full bg-flexsvg-blue/10 text-sm">
              专为 <b>设计爱好者和普通用户</b> 打造
            </p>
            <h1 className="font-extrabold text-6xl lg:text-7xl tracking-tight md:-mb-4 text-transparent bg-clip-text bg-gradient-to-r from-flexsvg-blue to-flexsvg-green">
              <p className="leading-tight">AI驱动的快速设计助理</p>
            </h1>
            <p className="text-lg opacity-80 leading-relaxed text-pretty">
              FlexSVG 让您轻松创作 logo、动画、SVG 图形，并进行图片处理。比 Canva 更强大，比想象更简单。
            </p>
            <Button className="text-lg px-8 py-6 bg-gradient-to-r from-flexsvg-blue to-flexsvg-green hover:from-flexsvg-blue/80 hover:to-flexsvg-green/80 text-white">
              免费体验 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="hidden lg:flex w-full max-h-[600px] overflow-hidden rounded-t-[30px] border-8 border-b-0 border-flexsvg-blue/80 shadow-2xl">
            <AspectRatio ratio={16/9}>
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="/pTDBHJmcSKW54kw1M8a_ug.png"
                  alt="FlexSVG 演示"
                  className="w-full object-cover object-top transition-transform duration-700 ease-in-out hover:translate-y-[-20%]"
                />
              </div>
            </AspectRatio>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-8 py-16 md:py-32 text-center">
            <h2 className="max-w-3xl mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8 text-pretty text-transparent bg-clip-text bg-gradient-to-r from-flexsvg-blue to-flexsvg-green">
              设计困难？不再是问题！
            </h2>
            <p className="mx-auto leading-relaxed mb-12 md:mb-20 text-pretty max-w-screen-lg">
              没有设计经验？找不到合适的工具？设计软件太复杂？FlexSVG 为您解决一切！
            </p>
            <div className="lg:gap-[1px] gap-4 grid grid-cols-2 lg:grid-cols-4 lg:rounded-xl overflow-hidden text-xl lg:shadow">
              {[
                { img: "/item1.png", text: "logo 设计难度大" },
                { img: "/item2.png", text: "动画制作耗时长" },
                { img: "/item1.png", text: "SVG 图形难以绘制" },
                { img: "/item2.png", text: "图片处理技能不足" },
              ].map((item, index) => (
                <div key={index} className="aspect-auto lg:aspect-square overflow-hidden">
                  <div className="flex flex-col items-center lg:hover:-translate-y-24 transition-all duration-300 lg:rounded-none rounded-xl overflow-hidden shadow lg:shadow-none">
                    <img src={item.img} alt={`problem${index + 1}`} className="aspect-square object-cover shadow-xl opacity-90" />
                    <p className="bg-gradient-to-r from-flexsvg-blue to-flexsvg-green text-white p-2 w-full h-24 items-center flex justify-center">
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
            <h2 className="max-w-screen-lg mx-auto font-extrabold text-4xl md:text-5xl tracking-tight mb-6 md:mb-8 text-pretty text-transparent bg-clip-text bg-gradient-to-r from-flexsvg-blue to-flexsvg-green">
              设计质量不满意？创作效率低下？
            </h2>
            <p className="mx-auto leading-relaxed mb-12 md:mb-20 text-pretty max-w-screen-lg">
              80%的普通用户在进行设计时感到困难，无法快速创作出满意的作品。
            </p>
            <div className="max-w-screen-lg mx-auto">
              <AspectRatio ratio={3} className="rounded-xl overflow-hidden">
                <img src="/jiejue.png" alt="problem5" className="object-cover w-full h-full dark:brightness-75" />
              </AspectRatio>
            </div>
            <p className="text-lg font-semibold mt-24">
              我们有个更简单的解决方案 ↓
            </p>
          </div>
        </section>

        <section className="bg-gradient-to-r from-flexsvg-blue to-flexsvg-green glass" id="vs">
          <div className="max-w-6xl mx-auto px-8 py-16 md:py-40 text-white">
            <h2 className="text-center font-black text-3xl md:text-5xl tracking-tight mb-12 md:mb-20">
              FlexSVG 与其他工具对比
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center md:items-start gap-8 md:gap-0">
              <Card className="h-full bg-white/90 p-8 md:p-10 rounded-xl w-full shadow-xl">
                <CardHeader>
                  <CardTitle className="font-bold text-lg mb-4 text-flexsvg-blue">FlexSVG 不是：</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1.5">
                    {[
                      "复杂的专业设计软件，如 Adobe 系列",
                      "仅限于简单模板的在线设计工具",
                      "需要深厚设计功底的创作平台",
                      "单一功能的图形处理工具",
                    ].map((item, index) => (
                      <li key={index} className="flex gap-2 items-center">
                        <ArrowRight className="w-4 h-4 shrink-0 text-flexsvg-blue" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="h-full bg-white text-[#1D1D35] p-8 md:p-10 rounded-xl w-full md:scale-110 shadow-xl">
                <CardHeader>
                  <CardTitle className="font-bold text-lg mb-4 text-flexsvg-green">FlexSVG 是：</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1.5">
                    {[
                      "AI驱动的快速设计助理",
                      "简单易用的logo、动画、SVG创作工具",
                      "强大的图片处理平台",
                      "适合所有用户的设计解决方案",
                      "比Canva更强大、更简单的设计工具",
                    ].map((item, index) => (
                      <li key={index} className="flex gap-2 items-center">
                        <Check className="w-4 h-4 shrink-0 text-flexsvg-green" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 bg-gradient-to-br from-white to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-center font-bold text-3xl md:text-5xl mb-12 text-transparent bg-clip-text bg-gradient-to-r from-flexsvg-blue to-flexsvg-green">
              选择适合您的计划
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "基础版",
                  price: "¥99",
                  features: [
                    "每月50次AI设计",
                    "基础logo和SVG创作",
                    "标准客户支持",
                    "基础图片处理功能"
                  ]
                },
                {
                  title: "专业版",
                  price: "¥199",
                  features: [
                    "每月200次AI设计",
                    "高级logo、动画和SVG创作",
                    "优先客户支持",
                    "高级图片处理功能"
                  ]
                },
                {
                  title: "企业版",
                  price: "联系我们",
                  features: [
                    "无限AI设计次数",
                    "全功能解锁",
                    "24/7专人支持",
                    "自定义AI模型"
                  ]
                }
              ].map((plan, index) => (
                <div key={index} className="bg-white rounded-lg shadow-xl p-8">
                  <h3 className="text-xl font-bold mb-4 text-flexsvg-blue">{plan.title}</h3>
                  <p className="text-3xl font-bold mb-6 text-[#1D1D35]">{plan.price}<span className="text-sm font-normal">/月</span></p>
                  <ul className="mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center mb-2">
                        <Check className="w-5 h-5 text-flexsvg-green mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-flexsvg-blue to-flexsvg-green hover:from-flexsvg-blue/80 hover:to-flexsvg-green/80 text-white">选择方案</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-flexsvg-blue/10">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
            <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
              <Link href="/" className="flex gap-2 justify-center md:justify-start items-center">
                <Avatar>
                  <AvatarImage src="/logo.svg" alt="FlexSVG logo" />
                  <AvatarFallback>FS</AvatarFallback>
                </Avatar>
                <strong className="font-extrabold tracking-tight text-base md:text-lg">
                  FlexSVG
                </strong>
              </Link>
              <p className="mt-3 text-sm text-base-content/80">
                FlexSVG 是AI驱动的快速设计助理。轻松创作logo、动画、SVG，进行图片处理，比想象更简单。
              </p>
              <p className="mt-3 text-sm text-base-content/60">
                Copyright © 2024 - All rights reserved
              </p>
            </div>
            <div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
              <div className="lg:w-1/3 md:w-1/2 w-full px-4">
                <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
                  链接
                </div>
                <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                  <a href="#features" className="link link-hover">功能</a>
                  <a href="mailto:support@flexsvg.com" target="_blank" className="link link-hover" aria-label="联系支持">
                    支持
                  </a>
                  <a href="#pricing" className="link link-hover">价格</a>
                  <a href="/blog" className="link link-hover">博客</a>
                </div>
              </div>
              <div className="lg:w-1/3 md:w-1/2 w-full px-4">
                <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
                  法律
                </div>
                <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                  <a href="/tos" className="link link-hover">服务条款</a>
                  <a href="/privacy-policy" className="link link-hover">隐私政策</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
