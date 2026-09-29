import type { ChatTurn, Conversation, MessageNode } from "./types";

export function pathTo(conversation: Conversation, leafId: string | null): MessageNode[] {
  if (!leafId) return [];
  const nodes: MessageNode[] = [];
  const seen = new Set<string>();
  let cursor: string | null = leafId;
  while (cursor && !seen.has(cursor)) {
    seen.add(cursor);
    const node: MessageNode | undefined = conversation.mapping[cursor];
    if (!node) break;
    nodes.push(node);
    cursor = node.parentId;
  }
  nodes.reverse();
  return nodes;
}

export function visibleThread(conversation: Conversation, leafId = conversation.currentNodeId): MessageNode[] {
  return pathTo(conversation, leafId).filter((node) => node.role !== "system");
}

export function siblingsOf(conversation: Conversation, nodeId: string): MessageNode[] {
  const node = conversation.mapping[nodeId];
  if (!node) return [];
  return Object.values(conversation.mapping)
    .filter((candidate) => candidate.parentId === node.parentId && candidate.role === node.role)
    .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
}

export function latestLeaf(conversation: Conversation, nodeId: string): string {
  let current = nodeId;
  const seen = new Set<string>();
  while (!seen.has(current)) {
    seen.add(current);
    const children = Object.values(conversation.mapping)
      .filter((node) => node.parentId === current)
      .sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
    if (children.length === 0) return current;
    current = children[children.length - 1].id;
  }
  return current;
}

export function modelMessages(conversation: Conversation, leafId: string): ChatTurn[] {
  return visibleThread(conversation, leafId)
    .filter((node) => (node.role === "user" || node.role === "assistant") && node.content.trim().length > 0)
    .map((node) => ({ role: node.role, content: node.content }));
}

function upsertFront(conversations: Conversation[], next: Conversation): Conversation[] {
  return [next, ...conversations.filter((conversation) => conversation.id !== next.id)];
}

export function appendTurn(
  conversations: Conversation[],
  input: {
    conversationId: string;
    now: number;
    systemId: string;
    user: { id: string; content: string };
    assistant: { id: string };
  },
): Conversation[] {
  const existing = conversations.find((conversation) => conversation.id === input.conversationId);
  const userNode: MessageNode = {
    id: input.user.id,
    parentId: existing ? existing.currentNodeId : input.systemId,
    role: "user",
    content: input.user.content,
    status: "finished_successfully",
    createdAt: input.now,
  };
  const assistantNode: MessageNode = {
    id: input.assistant.id,
    parentId: input.user.id,
    role: "assistant",
    content: "",
    status: "in_progress",
    createdAt: input.now + 1,
  };

  if (!existing) {
    const systemNode: MessageNode = {
      id: input.systemId,
      parentId: null,
      role: "system",
      content: "",
      status: "finished_successfully",
      createdAt: input.now,
    };
    const created: Conversation = {
      id: input.conversationId,
      title: "New chat",
      createdAt: input.now,
      updatedAt: input.now,
      currentNodeId: assistantNode.id,
      mapping: {
        [systemNode.id]: systemNode,
        [userNode.id]: userNode,
        [assistantNode.id]: assistantNode,
      },
    };
    return upsertFront(conversations, created);
  }

  const next: Conversation = {
    ...existing,
    updatedAt: input.now,
    currentNodeId: assistantNode.id,
    mapping: {
      ...existing.mapping,
      [userNode.id]: userNode,
      [assistantNode.id]: assistantNode,
    },
  };
  return upsertFront(conversations, next);
}

export function spawnAssistant(
  conversations: Conversation[],
  input: { conversationId: string; parentId: string; assistantId: string; now: number },
): Conversation[] {
  const existing = conversations.find((conversation) => conversation.id === input.conversationId);
  if (!existing || !existing.mapping[input.parentId]) return conversations;
  const assistantNode: MessageNode = {
    id: input.assistantId,
    parentId: input.parentId,
    role: "assistant",
    content: "",
    status: "in_progress",
    createdAt: input.now,
  };
  const next: Conversation = {
    ...existing,
    updatedAt: input.now,
    currentNodeId: assistantNode.id,
    mapping: {
      ...existing.mapping,
      [assistantNode.id]: assistantNode,
    },
  };
  return upsertFront(conversations, next);
}

export function patchNode(
  conversations: Conversation[],
  conversationId: string,
  nodeId: string,
  patch: Partial<Pick<MessageNode, "content" | "status" | "error">>,
  now: number,
): Conversation[] {
  const existing = conversations.find((conversation) => conversation.id === conversationId);
  const node = existing?.mapping[nodeId];
  if (!existing || !node) return conversations;
  const nextNode: MessageNode = { ...node, ...patch };
  if (patch.error === undefined) delete nextNode.error;
  else if (!patch.error) delete nextNode.error;
  const next: Conversation = {
    ...existing,
    updatedAt: now,
    mapping: { ...existing.mapping, [nodeId]: nextNode },
  };
  return upsertFront(conversations, next);
}

export function setTitle(
  conversations: Conversation[],
  conversationId: string,
  title: string,
  now: number,
): Conversation[] {
  const existing = conversations.find((conversation) => conversation.id === conversationId);
  if (!existing || existing.title !== "New chat") return conversations;
  const trimmed = title.trim();
  if (!trimmed) return conversations;
  return upsertFront(conversations, { ...existing, title: trimmed, updatedAt: now });
}

export function setResumeToken(
  conversations: Conversation[],
  conversationId: string,
  resumeToken: string,
): Conversation[] {
  const existing = conversations.find((conversation) => conversation.id === conversationId);
  if (!existing || existing.resumeToken === resumeToken) return conversations;
  return conversations.map((conversation) =>
    conversation.id === conversationId ? { ...conversation, resumeToken } : conversation,
  );
}

export function activateNode(
  conversations: Conversation[],
  conversationId: string,
  nodeId: string,
  now: number,
): Conversation[] {
  const existing = conversations.find((conversation) => conversation.id === conversationId);
  if (!existing || !existing.mapping[nodeId]) return conversations;
  const leaf = latestLeaf(existing, nodeId);
  if (leaf === existing.currentNodeId) return conversations;
  return upsertFront(conversations, { ...existing, currentNodeId: leaf, updatedAt: now });
}

export function removeConversation(conversations: Conversation[], conversationId: string): Conversation[] {
  return conversations.filter((conversation) => conversation.id !== conversationId);
}
