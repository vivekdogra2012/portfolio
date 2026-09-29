export type SseFrame = {
  event: string;
  data: string;
};

export function encodeSse(event: string | null, data: unknown): string {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  const dataField = payload
    .split("\n")
    .map((line) => `data: ${line}`)
    .join("\n");
  return event ? `event: ${event}\n${dataField}\n\n` : `${dataField}\n\n`;
}

export function encodeSseComment(text: string): string {
  return `:${text}\n\n`;
}

/**
 * Split a text/event-stream buffer into complete frames.
 * The remainder is an incomplete frame and must be kept for the next chunk.
 */
export function parseSseChunk(buffer: string): { frames: SseFrame[]; rest: string } {
  const normalized = buffer.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const parts = normalized.split("\n\n");
  const rest = parts.pop() ?? "";
  const frames: SseFrame[] = [];

  for (const raw of parts) {
    const block = raw.replace(/^\n+/, "");
    if (!block.trim()) continue;

    let event = "message";
    const data: string[] = [];
    for (const line of block.split("\n")) {
      if (!line || line.startsWith(":")) continue;
      const colon = line.indexOf(":");
      const field = colon === -1 ? line : line.slice(0, colon);
      let value = colon === -1 ? "" : line.slice(colon + 1);
      if (value.startsWith(" ")) value = value.slice(1);
      if (field === "event") event = value;
      else if (field === "data") data.push(value);
    }

    if (data.length > 0) frames.push({ event, data: data.join("\n") });
  }

  return { frames, rest };
}

export async function readSse(response: Response, onFrame: (frame: SseFrame) => void): Promise<void> {
  const body = response.body;
  if (!body) throw new Error("Empty stream");

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseChunk(buffer);
      buffer = parsed.rest;
      for (const frame of parsed.frames) onFrame(frame);
    }
  } finally {
    reader.releaseLock();
  }

  buffer += decoder.decode();
  if (buffer.trim()) {
    const parsed = parseSseChunk(`${buffer}\n\n`);
    for (const frame of parsed.frames) onFrame(frame);
  }
}
