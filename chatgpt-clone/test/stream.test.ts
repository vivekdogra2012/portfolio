import assert from "node:assert/strict";
import { test } from "node:test";
import { createConversationStream } from "../lib/conversation-stream";
import { chunkText, composeReply } from "../lib/reply";
import { handleConversationPost } from "../lib/server-handler";
import { parseSseChunk } from "../lib/sse";
import { applyFrame, createStreamSession, readAssistant } from "../lib/stream-session";

const request = {
  conversation_id: "c1",
  parent_message_id: "u1",
  message_id: "a1",
  model: "gpt-prototype",
  messages: [{ role: "user" as const, content: "Explain how this chat streams its answer" }],
};

test("chunks join back into the full reply", () => {
  const text = composeReply(request.messages);
  assert.equal(chunkText(text).join(""), text);
  assert.match(text, /delta_encoding/);
});

test("the conversation response is a v1 SSE stream", async () => {
  const response = createConversationStream(request, new AbortController().signal, { delayMs: 0 });
  assert.match(response.headers.get("content-type") ?? "", /text\/event-stream/);

  const raw = await response.text();
  const { frames } = parseSseChunk(raw.endsWith("\n\n") ? raw : `${raw}\n\n`);
  const encoding = frames.find((frame) => frame.event === "delta_encoding");
  assert.equal(JSON.parse(encoding?.data ?? "null"), "v1");

  const contentDeltas = frames.filter((frame) => {
    if (frame.event !== "delta") return false;
    const json = JSON.parse(frame.data) as { v?: unknown; type?: string; p?: string };
    return typeof json.v === "string" && !json.type;
  });
  assert.ok(contentDeltas.length > 1);
  const first = JSON.parse(contentDeltas[0].data) as { p?: string; o?: string; v: string };
  const second = JSON.parse(contentDeltas[1].data) as { p?: string; o?: string; v: string };
  assert.equal(first.p, "/message/content/parts/0");
  assert.equal(first.o, "append");
  assert.equal(second.p, undefined);
  assert.equal(second.o, undefined);

  const session = createStreamSession();
  for (const frame of frames) applyFrame(session, frame);
  const assistant = readAssistant(session);
  assert.equal(assistant?.content, composeReply(request.messages));
  assert.equal(assistant?.status, "finished_successfully");
  assert.equal(session.resumeToken, "resume_c1_a1");
  assert.match(session.title ?? "", /Explain how this chat/);
  assert.equal(frames.at(-1)?.data, "[DONE]");
});

test("abort keeps the partial reply and marks it stopped", async () => {
  const controller = new AbortController();
  async function* tokens() {
    yield "Hello";
    controller.abort();
    yield " hidden";
  }

  const response = createConversationStream(request, controller.signal, { tokens: tokens() });
  const raw = await response.text();
  const { frames } = parseSseChunk(`${raw}\n\n`);
  const session = createStreamSession();
  for (const frame of frames) applyFrame(session, frame);
  const assistant = readAssistant(session);
  assert.equal(assistant?.content, "Hello");
  assert.equal(assistant?.status, "stopped");
});

test("rejects an empty conversation post", async () => {
  const response = await handleConversationPost(
    new Request("http://localhost/backend-api/f/conversation", {
      method: "POST",
      body: JSON.stringify({
        conversation_id: "c1",
        parent_message_id: "u1",
        message_id: "a1",
        messages: [],
      }),
    }),
  );
  assert.equal(response.status, 400);
  const body = (await response.json()) as { error: string };
  assert.match(body.error, /messages/);
});
