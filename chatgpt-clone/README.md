# Chat prototype

A working chat UI shaped like the ChatGPT web client. Replies are not animated locally: the server holds one HTTP response open and streams Server-Sent Events. The browser applies those events to a conversation tree.

This is an independent prototype. It is not affiliated with OpenAI.

## Run it

From this directory, with Node.js 20+:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm test` | Protocol, tree, and stream tests |
| `npm run lint` | `tsc --noEmit` |
| `npm run build` | Production build |
| `npm start` | Serve the production build |

The default model, `gpt-prototype`, runs on this server and needs no API key. Set `OPENAI_API_KEY` (see `.env.example`) to add a hosted model. Hosted tokens are translated into the same SSE protocol, so the UI does not change.

## What to try

- Send a message and watch the reply land in pieces.
- In DevTools, filter the Network panel for `conversation`. The long request is `POST /backend-api/f/conversation`, content type `text/event-stream`.
- Press Stop while it is still writing.
- Send a follow-up. The active branch, not every abandoned branch, is what the server receives.
- Regenerate the last reply, then use `‹ 1/2 ›` to switch branches.
- Refresh. Chats are stored in `localStorage` on this device.

Suggested prompts on the empty screen exercise the stream, a comparison table, a code block, and a longer markdown reply.

## Docs

- [Architecture](docs/architecture.md) — shell, conversation tree, submit flow, and how this maps to the ChatGPT client
- [SSE protocol](docs/sse.md) — delta encoding v1, frame by frame

## Layout

```
app/                          routes and the streaming endpoints
components/                   shell, sidebar, thread, composer
lib/delta.ts                  JSON-pointer patches
lib/sse.ts                    frame encoder and reader
lib/stream-session.ts         applies frames to the in-flight message
lib/tree.ts                   conversation mapping and branches
lib/conversation-stream.ts    server stream
docs/                         architecture and protocol
```
