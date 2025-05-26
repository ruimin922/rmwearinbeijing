# WearInBeijing 智能穿搭推荐应用

## 项目简介

WearInBeijing 是一款基于 Next.js、TailwindCSS、Supabase、Clerk、Qwen/OpenAI 的智能穿搭推荐应用，整体风格极简（MUJI 风），支持天气展示、衣柜管理、AI 智能推荐等功能，适合追求高效、极简生活方式的用户。

---

## 技术栈
- **前端**：Next.js 14 + React 18 + TypeScript + TailwindCSS
- **UI/UX**：极简低饱和度配色，无蓝色、无渐变，全部使用 TailwindCSS
- **后端/数据库**：Supabase（Postgres）
- **用户认证**：Clerk（支持邮箱、Google、GitHub 登录）
- **AI 推荐**：Qwen（通义千问）/OpenAI API，支持流式输出
- **图片存储**：Supabase Storage
- **云部署**：Vercel

---

## 主要功能
- 实时天气展示
- 衣柜管理（增/查/删/改，图片上传，标签、季节、分类管理）
- 智能穿搭推荐（结合天气、衣柜、AI 大模型，流式输出祝福语+搭配建议+衣柜图片）
- Markdown 渲染推荐内容，图片可直接展示
- 用户数据隔离（Clerk 账号绑定 Supabase 数据）
- 极简风格 UI，所有按钮、图片 hover 动效统一

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
# Clerk 配置
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=你的Clerk前端Key（pk_开头，来自你自己的Clerk项目）
CLERK_SECRET_KEY=你的Clerk后端Key（sk_开头，来自你自己的Clerk项目）
CLERK_WEBHOOK_SECRET=你的Clerk Webhook Secret（如有）

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名Key

# Qwen/OpenAI 配置
QWEN_API_KEY=你的Qwen API Key
OPENAI_API_KEY=你的OpenAI密钥（如用OpenAI）

# 其他
OPENAI_BASE_URL=你的大模型API地址（如用OpenAI代理）
OPENAI_MODEL=你的大模型名称
```

> **注意：**  
> - 环境变量必须和你自己的 Clerk 项目一致，不能用别人的 key！
> - 线上部署（如 Vercel）也要在环境变量中配置自己的 Clerk key。

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

1. 在 Vercel 项目设置中，添加所有环境变量（见上文）。
2. 确保 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 和 `CLERK_SECRET_KEY` 都是你自己的 Clerk 项目 key。
3. 保存后 Redeploy 项目。

---

## 社交登录（GitHub/Google）

- 在 Clerk 控制台的 SSO connections 中启用 GitHub、Google 登录。
- 启用后，登录界面会自动显示 GitHub/Google 登录按钮。

---

## Qwen 流式推荐

- 推荐接口 `/api/recommend` 支持流式输出，前端边生成边渲染，体验丝滑。
- 你可以在 dashboard 页面输入"今天穿什么"等 query，体验 AI 智能推荐。

---

## 贡献与反馈

欢迎 issue、PR 或邮件联系作者！

---

## License

MIT
