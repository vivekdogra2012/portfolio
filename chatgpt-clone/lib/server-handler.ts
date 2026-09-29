import { createConversationStream, hostedModelAvailable } from "./conversation-stream";
import type { ChatTurn, ConversationRequest } from "./types";

const MAX_MESSAGES = 40;
const MAX_CONTENT = 8_000;
const MAX_TOTAL = 32_000;

type ParseResult = { ok: true; value: ConversationRequest } | { ok: false; error: string };

export function parseConversationRequest(body: unknown): ParseResult {
  if (!body || typeof body !== "object") return { ok: false, error: "Expected a JSON object" };
  const record = body as Record<string, unknown>;

  if (record.action !== undefined && record.action !== "next") {
    return { ok: false, error: "Unsupported action" };
  }

  const conversationId = readId(record.conversation_id, "conversation_id");
  if (!conversationId.ok) return conversationId;

  const parentId = readId(record.parent_message_id, "parent_message_id");
  if (!parentId.ok) return parentId;

  const messageId = readId(record.message_id, "message_id");
  if (!messageId.ok) return messageId;

  const model = typeof record.model === "string" && record.model.trim() ? record.model.trim() : "gpt-prototype";
  if (model.length > 64) return { ok: false, error: "Model name is too long" };
  if (model !== "gpt-prototype" && !hostedModelAvailable()) {
    return { ok: false, error: "That model is not configured. Set OPENAI_API_KEY or use gpt-prototype." };
  }

  if (!Array.isArray(record.messages) || record.messages.length === 0) {
    return { ok: false, error: "messages must be a non-empty array" };
  }
  if (record.messages.length > MAX_MESSAGES) return { ok: false, error: "Too many messages" };

  const messages: ChatTurn[] = [];
  let total = 0;
  for (const entry of record.messages) {
    if (!entry || typeof entry !== "object") return { ok: false, error: "Invalid message" };
    const message = entry as Record<string, unknown>;
    if (message.role !== "system" && message.role !== "user" && message.role !== "assistant") {
      return { ok: false, error: "Invalid message role" };
    }
    if (typeof message.content !== "string") return { ok: false, error: "Message content must be a string" };
    if (message.content.length > MAX_CONTENT) return { ok: false, error: "Message is too long" };
    total += message.content.length;
    if (total > MAX_TOTAL) return { ok: false, error: "Conversation is too long" };
    messages.push({ role: message.role, content: message.content });
  }

  return {
    ok: true,
    value: {
      conversation_id: conversationId.value,
      parent_message_id: parentId.value,
      message_id: messageId.value,
      model,
      messages,
    },
  };
}

function readId(value: unknown, field: string): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof value !== "string" || !value.trim() || value.length > 80) {
    return { ok: false, error: `Invalid ${field}` };
  }
  return { ok: true, value: value.trim() };
}

export async function handleConversationPost(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseConversationRequest(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  return createConversationStream(parsed.value, request.signal);
}

export async function handlePreparePost(request: Request): Promise<Response> {
  let draft = "";
  let model = "gpt-prototype";
  try {
    const body = (await request.json()) as { draft?: unknown; model?: unknown };
    if (typeof body.draft === "string") draft = body.draft.slice(0, 8_000);
    if (typeof body.model === "string" && body.model.trim()) model = body.model.trim().slice(0, 64);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  return Response.json({
    status: "ok",
    warmup_state: draft.trim() ? "warm" : "cold",
    conduit_prewarmed: Boolean(draft.trim()),
    model,
  });
}
