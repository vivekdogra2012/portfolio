import type { ChatTurn } from "./types";

export function titleFrom(prompt: string): string {
  const clean = prompt.replace(/\s+/g, " ").trim();
  if (!clean) return "New chat";
  const words = clean.split(" ").slice(0, 6).join(" ");
  const clipped = words.length > 48 ? `${words.slice(0, 48).trimEnd()}…` : words;
  return clipped.charAt(0).toUpperCase() + clipped.slice(1);
}

export function chunkText(text: string, size = 18): string[] {
  const chunks: string[] = [];
  let buffer = "";
  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    buffer += part;
    if (buffer.length >= size) {
      chunks.push(buffer);
      buffer = "";
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

export function composeReply(messages: ChatTurn[]): string {
  const users = messages.filter((message) => message.role === "user" && message.content.trim());
  const latest = users.at(-1)?.content.trim() ?? "";
  if (!latest) return "Send a message and I will stream a reply over SSE.";

  const previous = users.length > 1 ? users[users.length - 2].content.trim() : "";
  if (previous && /^(continue|go on|more|expand|elaborate)\b/i.test(latest)) {
    return followUp(previous);
  }

  return answer(latest);
}

function answer(prompt: string): string {
  const normalized = prompt.toLowerCase();

  if (/^(hi|hello|hey|yo)\b/.test(normalized)) {
    return [
      "Hello. Ask a question and the reply is streamed here token by token.",
      "",
      "This prototype follows the ChatGPT web client: the thread is a message tree, and the answer arrives as Server-Sent Events using delta encoding v1.",
      "",
      "Try “Explain how this chat streams its answer” if you want the wire format.",
    ].join("\n");
  }

  if (/sse|server-sent|delta encoding|how (this|the) (chat|app) streams/.test(normalized)) {
    return sseExplanation();
  }

  if (/websocket/.test(normalized) && /sse|server-sent|event/.test(normalized)) {
    return sseVersusWebSockets();
  }

  if (/debounce/.test(normalized)) {
    return debounceSnippet(normalized.includes("python") ? "python" : "typescript");
  }

  if (/product brief|prd\b/.test(normalized)) {
    return productBrief(prompt);
  }

  if (/^compare\b|\bvs\.?\b|\bversus\b/.test(normalized)) {
    return genericComparison(prompt);
  }

  if (/```|\bcode\b|\bfunction\b|\btypescript\b|\bjavascript\b|\bpython\b|\breact\b/.test(normalized)) {
    return codeReply(prompt);
  }

  if (/^explain\b|^what is\b|^what's\b|^how does\b|^how do\b|^tell me about\b/.test(normalized)) {
    return explainTopic(prompt);
  }

  return defaultReply(prompt);
}

function sseExplanation(): string {
  return [
    "## How this chat streams its answer",
    "",
    "The typing effect is the network, not a timer in the browser. One `POST` stays open and the server writes the answer in pieces.",
    "",
    "1. The composer submits the active branch of the conversation tree.",
    "2. The browser calls `fetch` on `/backend-api/f/conversation` and reads `response.body` with a stream reader. `EventSource` is not used, because that API cannot send a POST body.",
    "3. The response is `text/event-stream`. The first event declares the protocol:",
    "",
    "```",
    "event: delta_encoding",
    'data: "v1"',
    "```",
    "",
    "4. A delta then creates the assistant message. Later deltas append text at the JSON pointer `/message/content/parts/0`. After the first append, the path and operation are omitted and only `v` is sent.",
    "5. A `title_generation` event names the chat while the answer is still streaming.",
    "6. The message status becomes `finished_successfully`, and the stream ends with `data: [DONE]`.",
    "",
    "Open the Network panel, filter for `conversation`, and send another message. You should see those frames arrive over time rather than as one JSON document.",
  ].join("\n");
}

function sseVersusWebSockets(): string {
  return [
    "## SSE and WebSockets",
    "",
    "Both keep a connection open. They solve different directions of traffic.",
    "",
    "| | Server-Sent Events | WebSockets |",
    "| --- | --- | --- |",
    "| Direction | Server to client | Both ways |",
    "| Transport | Ordinary HTTP response | Upgrade from HTTP |",
    "| Client API | `fetch` stream, or `EventSource` for GET | `WebSocket` |",
    "| Framing | `text/event-stream` records | Binary or text frames |",
    "| Fits chat output | Yes. The prompt is the request body, the answer is the stream | Yes, when the client must also push mid-generation |",
    "",
    "ChatGPT’s web client uses SSE for the answer because generation is one-way after you press Enter. A socket is extra machinery until you need the server to accept further input on the same connection, which is why resume can later hand off to one.",
    "",
    "This prototype stays on SSE end to end: deltas in, `[DONE]` closes it, and Stop aborts the fetch.",
  ].join("\n");
}

function debounceSnippet(language: "python" | "typescript"): string {
  if (language === "python") {
    return [
      "## Debounce",
      "",
      "Debounce waits until calls stop arriving, then runs once with the latest arguments.",
      "",
      "```python",
      "import threading",
      "",
      "def debounce(wait, fn):",
      "    timer = None",
      "",
      "    def wrapped(*args, **kwargs):",
      "        nonlocal timer",
      "        if timer is not None:",
      "            timer.cancel()",
      "",
      "        def fire():",
      "            fn(*args, **kwargs)",
      "",
      "        timer = threading.Timer(wait, fire)",
      "        timer.daemon = True",
      "        timer.start()",
      "",
      "    return wrapped",
      "```",
      "",
      "Use it around work that should not run on every keystroke, such as the draft `prepare` request this composer sends while you type.",
    ].join("\n");
  }

  return [
    "## Debounce",
    "",
    "Debounce collapses a burst of calls into one call that runs after the burst goes quiet.",
    "",
    "```typescript",
    "export function debounce<T extends (...args: never[]) => void>(fn: T, wait = 200) {",
    "  let timer: ReturnType<typeof setTimeout> | undefined;",
    "  return (...args: Parameters<T>) => {",
    "    clearTimeout(timer);",
    "    timer = setTimeout(() => fn(...args), wait);",
    "  };",
    "}",
    "```",
    "",
    "The composer uses the same idea: it waits until you pause, then POSTs the draft to `/backend-api/f/conversation/prepare` so the server can warm up before Enter.",
  ].join("\n");
}

function productBrief(prompt: string): string {
  const subject = subjectFrom(prompt);
  return [
    `## Product brief: ${subject}`,
    "",
    "### Problem",
    `People lose track of small thoughts because capturing them is slower than having them. ${capitalize(subject)} should make capture instant and retrieval obvious.`,
    "",
    "### User",
    "Someone who already takes notes in more than one place and wants one list they trust.",
    "",
    "### Solution",
    "- Create a note in one action, with the cursor already in the body.",
    "- Search titles and bodies as you type.",
    "- Pin one note and leave the rest in reverse chronological order.",
    "",
    "### MVP",
    "- Local-only storage",
    "- New, edit, delete",
    "- Search",
    "- No accounts and no sync",
    "",
    "### Non-goals",
    "- Collaboration",
    "- Rich media",
    "- Folders beyond a single pin",
    "",
    "### Success",
    "A new user can save a note and find it again in under a minute, without a tutorial.",
  ].join("\n");
}

function genericComparison(prompt: string): string {
  const parts = prompt
    .replace(/^compare\s+/i, "")
    .split(/\s+vs\.?\s+|\s+versus\s+|\s+and\s+/i)
    .map((part) => part.replace(/[?.!|]+$/g, "").replace(/\|/g, "/").trim())
    .filter(Boolean);
  const left = parts[0] || "the first option";
  const right = parts[1] || "the second option";
  return [
    `## ${capitalize(left)} and ${right}`,
    "",
    `Compare them on the job you need done, not on which name is more familiar.`,
    "",
    `| Question | ${capitalize(left)} | ${right.charAt(0).toUpperCase()}${right.slice(1)} |`,
    "| --- | --- | --- |",
    "| Best when | The workflow already matches it | You need a different constraint or interface |",
    "| Cost of choosing it | Learning curve and lock-in | Migration and two ways to do the same thing |",
    "| What to try first | The smallest task that would prove it | The same task, timed |",
    "",
    "Pick the one that makes the next hour easier. Keep the other as the fallback if that trial stalls.",
  ].join("\n");
}

function codeReply(prompt: string): string {
  const python = /\bpython\b/i.test(prompt);
  if (python) {
    return [
      "## A small Python starting point",
      "",
      "This is a direct sketch you can run and then specialize:",
      "",
      "```python",
      "def respond(prompt: str) -> str:",
      '    text = " ".join(prompt.split())',
      "    if not text:",
      '        return "Ask a question."',
      '    return f"Working from: {text}"',
      "",
      'if __name__ == "__main__":',
      '    print(respond("hello"))',
      "```",
      "",
      `You asked: “${clip(prompt, 180)}”. Replace \`respond\` with the real behavior, and keep the empty-input branch so the function stays safe to call.`,
    ].join("\n");
  }

  return [
    "## A small TypeScript starting point",
    "",
    "```typescript",
    "export function summarize(input: string): string {",
    "  const text = input.trim().replace(/\\s+/g, \" \");",
    "  if (!text) return \"Nothing to summarize.\";",
    "  return text.length > 120 ? `${text.slice(0, 117)}…` : text;",
    "}",
    "```",
    "",
    `You asked: “${clip(prompt, 180)}”. Use the function as the boundary, then fill in the real transformation behind it.`,
  ].join("\n");
}

function explainTopic(prompt: string): string {
  const topic = prompt
    .replace(/^(please\s+)?(explain|describe|what is|what's|how does|how do|tell me about)\s+/i, "")
    .replace(/[?.!]+$/g, "")
    .trim();
  const subject = topic || "that";
  return [
    `## ${capitalize(subject)}`,
    "",
    `${capitalize(subject)} is easier to use once you can say what it takes in, what it produces, and what it refuses to do.`,
    "",
    "### Take in",
    `The inputs are the pieces you already have that relate to ${subject}.`,
    "",
    "### Produce",
    "The output is one next artifact: an explanation, a decision, or a draft. It should be small enough to check.",
    "",
    "### Leave out",
    "Edge cases that do not change the first version. Add them after the main path works.",
    "",
    "If you want, the next message can turn this into a checklist or into code.",
  ].join("\n");
}

function defaultReply(prompt: string): string {
  const topic = clip(prompt.replace(/\s+/g, " ").trim(), 240);
  return [
    `Here is a direct pass at “${topic}”.`,
    "",
    "### Goal",
    "Name the outcome in one sentence so the rest of the work can be checked against it.",
    "",
    "### Constraints",
    "- Stay specific to the request above",
    "- Prefer a step you can finish in one sitting",
    "- Keep the result easy to revise",
    "",
    "### First step",
    "Write the smallest version and decide what “done” looks like. Send that definition next and the following reply can turn it into a plan, a draft, or code.",
  ].join("\n");
}

function followUp(previous: string): string {
  const topic = clip(previous.replace(/\s+/g, " ").trim(), 160);
  return [
    `Continuing from “${topic}”.`,
    "",
    "### Go one level deeper",
    "- Separate what is already decided from what is still a guess.",
    "- Turn the guess into a check you can run today.",
    "- Stop when you have one artifact someone else could read.",
    "",
    "### A tighter version",
    "Lead with the result, follow with the two facts that support it, and end with the open question. That shape is enough for a second draft.",
    "",
    "Ask for a rewrite in a specific format if you want this turned into prose, a list, or code.",
  ].join("\n");
}

function subjectFrom(prompt: string): string {
  const match = prompt.match(/\b(?:for|about)\s+(?:an?|the)?\s*(.+)$/i);
  const raw = (match?.[1] ?? "a notes app").replace(/[?.!]+$/g, "").trim();
  return raw || "a notes app";
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function clip(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}
