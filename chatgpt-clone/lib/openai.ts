import type { ChatTurn } from "./types";
import { parseSseChunk } from "./sse";

type OpenAiChunk = {
  choices?: { delta?: { content?: string } }[];
  error?: { message?: string };
};

export async function* openAiTokens(messages: ChatTurn[], model: string, signal: AbortSignal): AsyncGenerator<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || model,
      stream: true,
      messages: messages.map((message) => ({ role: message.role, content: message.content })),
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    const detail = await response.text();
    throw new Error(detail.slice(0, 400) || `OpenAI request failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseChunk(buffer);
      buffer = parsed.rest;
      for (const frame of parsed.frames) {
        if (frame.data === "[DONE]") return;
        const json = JSON.parse(frame.data) as OpenAiChunk;
        if (json.error?.message) throw new Error(json.error.message);
        const content = json.choices?.[0]?.delta?.content;
        if (content) yield content;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
