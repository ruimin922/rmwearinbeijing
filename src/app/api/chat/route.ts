import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('claude-3-5-sonnet-20240620'),
    system: '你是一个 SVG 设计师，请根据用户的需求生成 SVG 代码。',
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}