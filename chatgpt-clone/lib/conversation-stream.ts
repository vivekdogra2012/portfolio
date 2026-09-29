import { composeReply, chunkText, titleFrom } from "./reply";
import { openAiTokens } from "./openai";
import { encodeSse, encodeSseComment } from "./sse";
import type { ConversationRequest } from "./types";

const encoder = new TextEncoder();

export const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
};

export type StreamOptions = {
  delayMs?: number;
  tokens?: AsyncIterable<string>;
};

export function createConversationStream(
  input: ConversationRequest,
  signal: AbortSignal,
  options: StreamOptions = {},
): Response {
  const delayMs = options.delayMs ?? 24;
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (event: string | null, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(encodeSse(event, data)));
        } catch {
          closed = true;
        }
      };

      try {
        controller.enqueue(encoder.encode(encodeSseComment(` ${" ".repeat(2048)}`)));
        write("delta_encoding", JSON.stringify("v1"));
        write("delta", {
          type: "resume_conversation_token",
          token: `resume_${input.conversation_id}_${input.message_id}`,
        });
        write("delta", {
          p: "",
          o: "add",
          v: {
            message: {
              id: input.message_id,
              author: { role: "assistant" },
              content: { content_type: "text", parts: [""] },
              status: "in_progress",
              recipient: "all",
              metadata: { model_slug: input.model },
            },
            conversation_id: input.conversation_id,
            error: null,
          },
        });

        const userPrompt = [...input.messages].reverse().find((message) => message.role === "user")?.content ?? "";
        let titled = false;
        let started = false;
        const tokens = options.tokens ?? iterateTokens(input, signal, delayMs);

        for await (const token of tokens) {
          if (closed || signal.aborted) break;
          if (!token) continue;
          if (!started) {
            write("delta", { p: "/message/content/parts/0", o: "append", v: token });
            started = true;
          } else {
            write("delta", { v: token });
          }
          if (!titled) {
            write("title_generation", {
              title: titleFrom(userPrompt),
              conversation_id: input.conversation_id,
            });
            titled = true;
          }
        }

        const status = signal.aborted ? "stopped" : "finished_successfully";
        write("delta", { p: "/message/status", o: "replace", v: status });
        write(null, "[DONE]");
      } catch (error) {
        if (signal.aborted || isAbortError(error)) {
          write("delta", { p: "/message/status", o: "replace", v: "stopped" });
          write(null, "[DONE]");
        } else {
          const message = error instanceof Error ? error.message : "Stream failed";
          write("delta", { p: "/message/status", o: "replace", v: "error" });
          write("delta", { p: "", o: "patch", v: { error: message } });
          write(null, "[DONE]");
        }
      } finally {
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}

async function* iterateTokens(
  input: ConversationRequest,
  signal: AbortSignal,
  delayMs: number,
): AsyncGenerator<string> {
  if (input.model !== "gpt-prototype") {
    yield* openAiTokens(input.messages, input.model, signal);
    return;
  }

  const full = composeReply(input.messages);
  for (const chunk of chunkText(full)) {
    if (signal.aborted) return;
    yield chunk;
    await sleep(delayMs, signal);
  }
}

export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return Promise.reject(abortError());
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function abortError(): Error {
  const error = new Error("Aborted");
  error.name = "AbortError";
  return error;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export function hostedModelAvailable(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}
