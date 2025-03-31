
import { streamText, tool } from 'ai';
import { createResource } from '@/lib/actions/resources';
import { z } from 'zod';
// API 密钥可从DeepSeek 平台获取:https://platform.deepseek.com/sign_in
import { createDeepSeek } from '@ai-sdk/deepseek';
import { findRelevantContent } from '@/lib/ai/embedding';

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
    tools: {
        addResource: tool({
          description: `add a resource to your knowledge base.
            If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
          parameters: z.object({
            content: z
              .string()
              .describe('the content or resource to add to the knowledge base'),
          }),
          execute: async ({ content }) => {
            const result = await createResource({ content });
            return { success: true, message: result };
          },
        }),
        getInformation: tool({
          description: `get information from your knowledge base to answer questions.`,
          parameters: z.object({
            question: z.string().describe('the users question'),
          }),
          execute: async ({ question }) => {
            try {
              const results = await findRelevantContent(question);
              return { results: results.length > 0 ? results : [{ name: '没有找到相关信息', similarity: 0 }] };
            } catch (error) {
              console.error('Error finding relevant content:', error);
              return { results: [{ name: '查询过程中出错', similarity: 0 }] };
            }
          },
        }),
    },
  });

  return result.toDataStreamResponse();
}