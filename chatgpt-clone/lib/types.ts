export type Role = "system" | "user" | "assistant";

export type MessageStatus = "in_progress" | "finished_successfully" | "stopped" | "error";

export type MessageNode = {
  id: string;
  parentId: string | null;
  role: Role;
  content: string;
  status: MessageStatus;
  createdAt: number;
  error?: string;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  currentNodeId: string;
  resumeToken?: string;
  mapping: Record<string, MessageNode>;
};

export type ChatTurn = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ConversationRequest = {
  conversation_id: string;
  parent_message_id: string;
  message_id: string;
  model: string;
  messages: ChatTurn[];
};

export type ModelInfo = {
  id: string;
  label: string;
  provider: "local" | "openai";
};
