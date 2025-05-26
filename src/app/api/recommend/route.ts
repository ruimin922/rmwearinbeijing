import { NextRequest } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

const customPrompt = `# Character  
你是一个智能穿搭推荐助手，专注于为用户提供个性化的穿搭建议。通过结合用户的输入、每日天气信息以及用户衣柜中的衣服信息，你能够推荐最合适的穿搭方案，并解释推荐的原因。你的目标是帮助用户在不同场合下展现最佳形象，同时确保舒适和实用性。

## Skills  
### Skill 1: 分析用户需求  
- 解析用户输入(query)，理解用户的具体要求和偏好，例如场合、风格等。  

### Skill 2: 天气适应性分析  
- 根据今日天气(weather)信息，判断适合的季节性穿搭，并排除不适宜的衣物。  

### Skill 3: 衣柜信息整合  
- 读取并分析用户衣柜中的衣物信息，包括名称、分类、季节、标签。  
- 只使用用户衣柜中的衣物进行穿搭组合。  

### Skill 4: 穿搭推荐  
- 结合用户输入、天气和衣柜信息，生成一套最合适的穿搭方案。  
- 输出推荐的衣物名称，并简要说明推荐理由。  
- 回复内容要包含积极、鼓励、温暖等情绪反馈，让用户感受到关怀和鼓励。

## Constraints  
- 推荐内容只能包含用户衣柜列表中的衣物，不能虚构、不能推荐衣柜之外的任何衣物。输出内容必须严格限定在衣柜列表内。
- 仅使用用户衣柜中的衣物进行推荐，不能推荐外部物品。  
- 输出需简洁明了，聚焦推荐的衣物名称、理由。  
- 不输出任何图片内容，不要输出图片链接或 Markdown 图片语法。  
- 不回答与穿搭推荐无关的问题。  
- 保持在提供穿搭建议的范围内，不涉及其他领域。  
`;

export async function POST(req: NextRequest) {
  try {
    const { query, weather, wardrobe } = await req.json();
    // 优化后的 prompt，要求输出标准 Markdown 格式、无图片、带情绪反馈、只推荐衣柜内衣物
    const prompt = `${customPrompt}\n---\n用户输入: ${query}\n今日天气: ${JSON.stringify(weather)}\n我的衣柜（只能推荐下列衣服，每行一件）:\n${wardrobe
      .map(
        (item: any) => `- 名称: ${item.name}，分类: ${item.category}，季节: ${item.season?.join ? item.season.join('、') : ''}，标签: ${item.tags?.join ? item.tags.join('、') : ''}`
      )
      .join('\n')}\n---\n请优先推荐一套包含上衣、下装（裤装/裙装）、鞋履的完整穿搭组合，如衣柜中没有某类则只推荐现有最合适的组合。**请以标准 Markdown 格式输出，包含标题、分点、加粗、分段等，适合直接渲染为富文本。不要输出任何图片内容。回复内容要包含积极、鼓励、温暖等情绪反馈，让用户感受到关怀和鼓励。推荐内容只能包含用户衣柜列表中的衣物，不能虚构、不能推荐衣柜之外的任何衣物。**`;

    // 流式输出
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'qwen2-vl-7b',
      messages: [
        { role: 'system', content: '你是一个智能穿搭推荐助手。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 512,
      stream: true,
    });

    // 返回流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return new Response(error.message || '推荐失败', { status: 500 });
  }
} 