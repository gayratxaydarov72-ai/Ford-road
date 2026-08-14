export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string;
  timestamp: number;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  model: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export interface AIModel {
  id: string;
  displayName: string;
  description: string;
  supportsVision: boolean;
  tag: string;
}

export interface TTSModel {
  id: string;
  displayName: string;
  provider: string;
  sampleRate: string;
}

export interface AudioRecord {
  id: string;
  prompt: string;
  model: string;
  format: string;
  duration: number;
  audioUrl: string;
  createdAt: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  tags: string[];
}
