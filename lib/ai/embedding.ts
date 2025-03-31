
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';

// 由于地区限制，使用本地模拟嵌入
// 这是一个简单的哈希函数，将文本转换为伪嵌入向量
function simpleHash(text: string, dimensions = 128): number[] {
  // 创建一个固定维度的数组
  const result = new Array(dimensions).fill(0);
  
  // 对文本中的每个字符进行处理
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    // 使用字符码更新向量中的值
    const position = i % dimensions;
    result[position] = (result[position] + charCode / 255) % 1; // 归一化到 0-1 之间
  }
  
  return result;
}
const generateChunks = (input: string): string[] => {
    return input
      .trim()
      .split('.')
      .filter(i => i !== '');
  };

  export const generateEmbeddings = async (
    value: string,
  ): Promise<Array<{ embedding: number[]; content: string }>> => {
    const chunks = generateChunks(value);
    // 使用本地哈希函数生成嵌入
    const embeddingsArray = chunks.map(chunk => simpleHash(chunk));
    
    return chunks.map((chunk, i) => ({
      content: chunk,
      embedding: embeddingsArray[i]
    }));
  };
  export const generateEmbedding = async (value: string): Promise<number[]> => {
    const input = value.replaceAll('\\n', ' ');
    // 使用本地哈希函数生成嵌入
    return simpleHash(input);
  };
  
  export const findRelevantContent = async (userQuery: string) => {
    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
      embeddings.embedding,
      userQueryEmbedded,
    )})`;
    const similarGuides = await db
      .select({ name: embeddings.content, similarity })
      .from(embeddings)
      .where(gt(similarity, 0.5))
      .orderBy(t => desc(t.similarity))
      .limit(4);
    return similarGuides;
  };