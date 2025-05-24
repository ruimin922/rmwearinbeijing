import { NextRequest, NextResponse } from 'next/server';
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
- 读取并分析用户衣柜中的衣物信息，包括名称、分类、季节、标签和图片链接。  
- 只使用用户衣柜中的衣物进行穿搭组合。  

### Skill 4: 穿搭推荐  
- 结合用户输入、天气和衣柜信息，生成一套最合适的穿搭方案。  
- 输出推荐的衣物名称，并简要说明推荐理由。  
- 提供推荐衣物的图片链接。  

## Constraints  
- 仅使用用户衣柜中的衣物进行推荐，不能推荐外部物品。  
- 输出需简洁明了，聚焦推荐的衣物名称、理由和图片链接。  
- 不回答与穿搭推荐无关的问题。  
- 保持在提供穿搭建议的范围内，不涉及其他领域。  
`;

export async function POST(req: NextRequest) {
  try {
    const { query, weather, wardrobe } = await req.json();
    // 优化后的 prompt，要求输出结构和图片格式
    const prompt = `${customPrompt}\n---\n用户输入: ${query}\n今日天气: ${JSON.stringify(weather)}\n我的衣柜（只能推荐下列衣服，每行一件）:\n${wardrobe
      .map(
        (item: any) => `- 名称: ${item.name}，分类: ${item.category}，季节: ${item.season?.join ? item.season.join('、') : ''}，标签: ${item.tags?.join ? item.tags.join('、') : ''}，图片: ${item.imageUrl}`
      )
      .join('\n')}\n---\n请优先推荐一套包含上衣、下装（裤装/裙装）、鞋履的完整穿搭组合，如衣柜中没有某类则只推荐现有最合适的组合。输出格式同上。`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'qwen2-vl-7b',
      messages: [
        { role: 'system', content: '你是一个智能穿搭推荐助手。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    const result = completion.choices?.[0]?.message?.content || '未能生成推荐结果';
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || '推荐失败' }, { status: 500 });
  }
} 