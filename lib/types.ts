export interface Message {
  id: string;
  text: string;
  isMatch: boolean;
  isAIGenerated?: boolean;
  isAIEnhanced?: boolean;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  lastMessage: string;
  timestamp: string;
  userId: string;
  order?: number;
  success?: boolean;
}

export interface SavedMessage {
  id: string;
  text: string;
  timestamp: string;
  userId: string;
  success: boolean;
}