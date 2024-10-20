export interface Attachment {
  contentType?: string;
  url: string;
  name?: string;
}

export interface Message {
  id: string
  role: 'function' | 'system' | 'user' | 'assistant' | 'data' | 'tool'
  content: string
  experimental_attachments?: Attachment[]
}
