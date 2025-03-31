import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// API 密钥可从DeepSeek 平台获取:https://platform.deepseek.com/sign_in
import { createDeepSeek } from '@ai-sdk/deepseek';

const deepseek = createDeepSeek({
    apiKey: process.env.OPENAI_API_KEY ?? '',
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // model: openai('gpt-4o'),
    model: deepseek('deepseek-chat'),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
  });

  return result.toDataStreamResponse();
}