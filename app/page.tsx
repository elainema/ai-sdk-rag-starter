'use client';
import { useChat } from '@ai-sdk/react';
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 3,
  });
  return (
    <div className="flex flex-col w-full max-w-7xl py-24 mx-auto stretch">


    <h4>一个简单的AI 聊天机器人，该机器人可以动态地向知识库添加和检索信息。创建和存储嵌入、设置服务器作以管理资源以及使用工具扩展聊天机器人的功能。</h4>
      

      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              <p>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">
                    {'calling tool: ' + m?.toolInvocations?.[0].toolName}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}