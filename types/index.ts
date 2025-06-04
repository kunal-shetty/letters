// types/index.ts
export interface Message {
  id: number;
  name: string;
  message: string;
  timestamp: string;
}

export interface ApiResponse {
  messages?: Message[];
  message?: string;
  data?: Message;
  error?: string;
}