import React from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';
import Markdown from '@/components/Markdown';
import Image from 'next/image';

interface Attachment {
  contentType?: string;
  url: string;
  name?: string;
}

interface MessageItemProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    experimental_attachments?: Attachment[];
  };
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[80%]`}>
        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isUser ? 'bg-primary ml-2' : 'bg-secondary mr-2'}`}>
          {isUser ? <FaUser className="text-primary-foreground" /> : <FaRobot className="text-secondary-foreground" />}
        </div>
        <div className="rounded-lg p-3 bg-muted overflow-hidden">
          <div className="max-w-full overflow-hidden">
            <Markdown className="prose dark:prose-invert max-w-none">{message.content}</Markdown>
          </div>
          {message.experimental_attachments && (
            <div>
              {message.experimental_attachments
                .filter((attachment: Attachment) => attachment?.contentType?.startsWith('image/'))
                .map((attachment: Attachment, index: number) => (
                  <Image
                    key={`${message.id}-${index}`}
                    src={attachment.url}
                    width={500}
                    height={500}
                    alt={attachment.name ?? `attachment-${index}`}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
