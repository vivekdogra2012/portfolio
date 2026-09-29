import type { Conversation, MessageNode } from "./types";

const STORAGE_KEY = "chatgpt-clone.v1";

type Stored = {
  version: 1;
  conversations: Conversation[];
};

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.conversations)) return [];
    return settleInterrupted(parsed.conversations.filter(isConversation));
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  try {
    const payload: Stored = { version: 1, conversations };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* Ignore quota and privacy-mode failures. The thread still lives in memory. */
  }
}

function settleInterrupted(conversations: Conversation[]): Conversation[] {
  return conversations.map((conversation) => ({
    ...conversation,
    mapping: Object.fromEntries(
      Object.entries(conversation.mapping).map(([id, node]) => [
        id,
        node.status === "in_progress" ? { ...node, status: "stopped" } : node,
      ]),
    ),
  }));
}

function isConversation(value: unknown): value is Conversation {
  if (!value || typeof value !== "object") return false;
  const record = value as Conversation;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    typeof record.currentNodeId === "string" &&
    typeof record.mapping === "object" &&
    record.mapping !== null &&
    Object.values(record.mapping).every(isNode)
  );
}

function isNode(value: unknown): value is MessageNode {
  if (!value || typeof value !== "object") return false;
  const node = value as MessageNode;
  return typeof node.id === "string" && typeof node.role === "string" && typeof node.content === "string";
}
