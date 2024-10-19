'use client';

import { useChat } from 'ai/react';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      keepLastMessageOnError: true,
    });

  return (
    <div className="container mx-auto p-4">
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}

      {isLoading && (
        <div>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <button type="button" onClick={() => stop()}>
            停止
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit">Submit</button>
      </form>
    </>
    </div>
  );
}