import { applyDelta, type DeltaCursor, type DeltaEvent } from "./delta";
import type { SseFrame } from "./sse";
import type { MessageStatus } from "./types";

export type StreamSession = {
  root: Record<string, unknown>;
  cursor: DeltaCursor | null;
  resumeToken: string | null;
  title: string | null;
};

export type AssistantSnapshot = {
  content: string;
  status: MessageStatus;
  error?: string;
};

export function createStreamSession(): StreamSession {
  return {
    root: {},
    cursor: null,
    resumeToken: null,
    title: null,
  };
}

export function applyFrame(session: StreamSession, frame: SseFrame): void {
  if (frame.data === "[DONE]") return;

  if (frame.event === "delta_encoding") return;

  if (frame.event === "title_generation") {
    const payload = parseJson(frame.data) as { title?: unknown } | undefined;
    if (payload && typeof payload.title === "string" && payload.title.trim()) {
      session.title = payload.title.trim();
    }
    return;
  }

  if (frame.event !== "delta" && frame.event !== "message") return;

  const json = parseJson(frame.data) as (DeltaEvent & { type?: string; token?: unknown }) | undefined;
  if (!json) return;

  if (json.type === "resume_conversation_token" && typeof json.token === "string") {
    session.resumeToken = json.token;
    return;
  }

  session.cursor = applyDelta(session.root, json, session.cursor);
}

export function readAssistant(session: StreamSession): AssistantSnapshot | null {
  const message = session.root.message;
  if (!message || typeof message !== "object") return null;
  const record = message as {
    content?: { parts?: unknown[] };
    status?: MessageStatus;
  };
  const parts = Array.isArray(record.content?.parts) ? record.content.parts : [];
  const content = parts.map((part) => (typeof part === "string" ? part : "")).join("");
  const error = typeof session.root.error === "string" ? session.root.error : undefined;
  return {
    content,
    status: record.status ?? "in_progress",
    error,
  };
}

function parseJson(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
}
