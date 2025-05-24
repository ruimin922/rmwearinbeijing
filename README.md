# WearInBeijing 智能穿搭推荐

> 基于天气和用户衣柜的AI智能穿搭推荐网站

## 项目简介
WearInBeijing 是一个为城市用户打造的智能穿搭推荐平台。用户可以：
- 上传和管理自己的衣柜（衣服图片、分类、季节、标签等）
- 实时获取天气信息
- （未来）根据天气和衣柜信息，AI智能推荐每日穿搭方案
- （未来）支持多用户、数据持久化、智能推荐等高级功能

## 主要功能
- 🧥 我的衣柜：添加、删除、查看衣物，支持图片本地预览
- 🌦️ 天气集成：可切换城市，实时显示天气信息
- 🏠 首页介绍：品牌故事、产品优势、价格计划等
- 💡 未来可扩展：接入数据库、AI大模型、用户系统等

## 技术架构
- **前端框架**：Next.js (React)
- **UI组件**：TailwindCSS, lucide-react, shadcn/ui
- **天气API**：高德地图天气API
- **图片存储**：本地 public 目录
- **（可选）数据库**：Prisma + PostgreSQL/MySQL（未来可接入）
- **部署平台**：Vercel

## 如何本地运行
1. 克隆项目
   ```bash
   git clone https://github.com/你的用户名/wearinbeijing.git
   cd wearinbeijing
   ```
2. 安装依赖
   ```bash
   npm install
   # 或 yarn install
   ```
3. 启动开发环境
   ```bash
   npm run dev
   # 或 yarn dev
   ```
4. 访问 http://localhost:3000

## 如何线上访问/分享
- 项目已部署在 Vercel 平台
- 访问地址通常为：https://wearinbeijing.vercel.app （以实际 Vercel 分配的为准）
- 你可以将该网址分享给任何好友，任何人都能访问

## 未来升级建议
- 接入数据库，实现衣柜信息持久化和多用户支持
- 接入大模型API，实现AI智能穿搭推荐
- 支持用户注册、登录、个性化推荐
- 持续优化UI/UX和移动端体验

## 常见问题
- **图片不显示？** 请将图片放到 public 目录下，路径和代码一致
- **如何恢复数据库？** 见本README"未来升级建议"部分，或联系开发者/AI助手
- **如何联系开发者？** 你可以在GitHub提issue，或在Vercel后台查看部署信息

---

> 本项目由小白用户和AI助手共同打造，持续迭代中。祝你用得开心！
