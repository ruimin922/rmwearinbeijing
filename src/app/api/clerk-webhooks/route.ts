import { Webhook } from 'svix'
import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
// 导入 createClient 函数
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  console.log("Webhook received"); // 添加这行来确认请求已到达

  // 从环境变量获取 webhook 密钥
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not set");
    throw new Error('请在 .env.local 文件中设置 WEBHOOK_SECRET')
  }

  // 获取 headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // 如果缺少 headers,返回错误
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('错误 - 缺少 svix headers', {
      status: 400
    })
  }

  // 获取 body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // 创建 svix 实例
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // 验证 webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Error occured', {
      status: 400
    })
  }

  // 处理 user.created 事件
  if (evt.type === 'user.created') {
    const { id, email_addresses, ...attributes } = evt.data;

    // 创建 Supabase 客户端
    const supabase = createClient();

    // 获取主要的电子邮件地址
    const primaryEmail = email_addresses.find(email => email.id === attributes.primary_email_address_id)?.email_address;


    // 准备用户数据
    const userData = {
      user_id: id,
      email: primaryEmail
    };

    // 将用户数据插入到 Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'user_id' });

    if (error) {
      console.error('Error inserting user data to Supabase:', error);
    } else {
      console.log('User data successfully inserted to Supabase:', data);
    }
    console.log(`用户创建: ${id}`);
    // 在这里添加您的逻辑,例如将用户信息保存到数据库
    console.log(attributes)
  }

  console.log("Webhook processed successfully"); // 添加这行来确认处理完成
  return new NextResponse('', { status: 200 })
}