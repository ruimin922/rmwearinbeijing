# WearInBeijing 智能穿搭推荐应用

## 项目简介

WearInBeijing 是一款基于 Next.js、TailwindCSS、Supabase、Clerk、Qwen/OpenAI 的智能穿搭推荐应用，整体风格极简（MUJI 风），支持天气展示、衣柜管理、AI 智能推荐等功能，适合追求高效、极简生活方式的用户。

---

## 技术栈
- **前端**：Next.js 14 + React 18 + TypeScript + TailwindCSS
- **UI/UX**：极简低饱和度配色，无蓝色、无渐变，全部使用 TailwindCSS
- **后端/数据库**：Supabase（Postgres）
- **用户认证**：Clerk（支持邮箱、Google、GitHub等第三方登录）
- **AI 推荐**：Qwen/OpenAI API
- **图片存储**：Supabase Storage
- **云部署**：Vercel

---

## 主要功能
- 实时天气展示
- 衣柜管理（增/查/删/改，图片上传，标签、季节、分类管理）
- 智能穿搭推荐（结合天气、衣柜、AI 大模型，输出祝福语+搭配建议+衣柜图片）
- Markdown 渲染推荐内容，图片可直接展示
- 用户数据隔离（Clerk 账号绑定 Supabase 数据，支持 GitHub 登录）
- 极简风格 UI，所有按钮、图片 hover 动效统一
- 智能穿搭推荐已支持 Qwen 大模型流式输出，推荐内容边生成边展示，体验更丝滑

---

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/ruimin922/rmwearinbeijing.git
cd rmwearinbeijing
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
在根目录新建 `.env.local`，参考：
```env
OPENAI_API_KEY=你的OpenAI密钥
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名Key
CLERK_SECRET_KEY=你的Clerk后端Key（必须与自己Clerk项目一致）
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=你的Clerk前端Key（必须与自己Clerk项目一致）
DATABASE_URL=你的数据库连接串（如用到Prisma）
# 其他如 OPENAI_BASE_URL、OPENAI_MODEL、CLERK_WEBHOOK_SECRET 等
```

### 4. 本地开发
```bash
npm run dev
```
访问 [http://localhost:3000](http://localhost:3000)

### 5. 构建与部署
```bash
npm run build
npm start
```

---

## 云端部署（Vercel）
1. 绑定 GitHub 仓库，自动化部署
2. 在 Vercel 项目 Settings → Environment Variables 补全所有环境变量
3. 推送代码到 main 分支，Vercel 自动构建上线
4. 每次 push 自动触发部署

---

## 设计与交互说明
- 所有按钮、图片 hover 动效统一为极简风格（深灰色按钮、图片轻微放大+阴影+变亮）
- 禁用蓝色、渐变色，主色为 neutral/stone/zinc 系列
- 响应式布局，适配移动端和桌面端
- 重点交互区（如"开始搭配"按钮、Header 登录按钮）均已优化为极简风

---

## 常见问题排查
- **图片无法显示**：检查 Supabase Storage 权限、image_url 字段是否为可访问链接
- **AI 推荐报错**：确认 OPENAI_API_KEY、OPENAI_BASE_URL、OPENAI_MODEL 等环境变量已配置
- **Prisma 报错**：确保 `prisma` 已安装为 devDependency，`postinstall` 脚本有 `prisma generate`，`DATABASE_URL` 正确
- **Vercel 环境变量丢失**：每个项目、每个 Team 独立配置，需在 Settings → Environment Variables 补全
- **推送不触发部署**：确认 push 到 Vercel 绑定的仓库和分支（通常是 main）

---

## 贡献与反馈
如有建议、Bug 或需求，欢迎提 Issue 或 PR。

---

## License
MIT

## 第三方登录说明
- 登录/注册支持邮箱、Google、GitHub 等多种方式。
- 如需开启 GitHub 登录：请在 Clerk 控制台 > SSO connections > Add connection 选择 GitHub 并按提示配置。

## 智能推荐流式体验
- 智能穿搭推荐基于 Qwen 大模型，已实现流式输出，推荐内容会逐字/逐句实时显示，提升交互体验。
