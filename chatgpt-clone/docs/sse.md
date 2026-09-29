# SSE protocol

The answer is one long HTTP response. The media type is `text/event-stream`. Frames are separated by a blank line. The client reads them with `fetch` and a `ReadableStream`, then applies **delta encoding v1**: each frame is a JSON-pointer operation on a single message object.

A 2KB comment is written first (`: …`). Comments are not rendered. They exist so a buffering proxy flushes the headers before the first token.

## Request

`POST /backend-api/f/conversation`

```json
{
  "action": "next",
  "conversation_id": "c1",
  "parent_message_id": "u1",
  "message_id": "a1",
  "model": "gpt-prototype",
  "messages": [
    { "role": "user", "content": "Explain how this chat streams its answer" }
  ]
}
```

`message_id` is the assistant node the client already inserted. The server uses that id in the stream so the UI does not have to swap placeholders. `messages` is the active branch only.

Response headers:

```
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache, no-transform
X-Accel-Buffering: no
```

## Frames, in order

```
event: delta_encoding
data: "v1"

event: delta
data: {"type":"resume_conversation_token","token":"resume_c1_a1"}

event: delta
data: {"p":"","o":"add","v":{"message":{"id":"a1","author":{"role":"assistant"},"content":{"content_type":"text","parts":[""]},"status":"in_progress","recipient":"all"},"conversation_id":"c1","error":null}}

event: delta
data: {"p":"/message/content/parts/0","o":"append","v":"The typing"}

event: delta
data: {"v":" effect"}

event: title_generation
data: {"title":"Explain how this chat streams its","conversation_id":"c1"}

event: delta
data: {"p":"/message/status","o":"replace","v":"finished_successfully"}

data: [DONE]
```

`delta_encoding` declares the protocol. Anything other than `"v1"` is still applied, but v1 is what this server speaks.

The resume event is metadata. It is stored on the conversation and is not a text patch.

## Operations

A content frame is `{ p, o, v }`.

| Field | Meaning |
| --- | --- |
| `p` | JSON pointer into the message object. `""` is the whole object. |
| `o` | `add`, `append`, `replace`, `patch`, or `remove`. |
| `v` | The value. For `append` on a string, it is the next piece of text. |

The first text frame names the pointer and the operation:

```json
{ "p": "/message/content/parts/0", "o": "append", "v": "The typing" }
```

Later text frames omit both. The client keeps a cursor and repeats the last `p` and `o`:

```json
{ "v": " effect" }
```

That is the whole compression trick. The pointer is not sent again for every token. A later frame that sets status, or that patches an error onto the root, includes `p` and `o` explicitly, and that becomes the new cursor.

`add` or `replace` on `""` writes the fields of `v` onto the session object. `patch` shallow-merges an object. `append` concatenates when the current value is a string, which is how `/message/content/parts/0` grows. Keys named `__proto__`, `prototype`, or `constructor` are ignored.

## How the client applies a frame

`lib/stream-session.ts` is the reducer:

1. `[DONE]` ends the logical stream. The reader also stops when the body closes.
2. `delta_encoding` is checked and otherwise ignored.
3. `title_generation` saves `title`. The provider applies it only while the chat is still called “New chat”.
4. A delta whose `type` is `resume_conversation_token` saves `token`.
5. Every other `delta` goes to `applyDelta`.

After applying, `readAssistant` reads `message.content.parts` joined as a string, plus `message.status` and a root-level `error`. The React tree stores that snapshot. The session object itself is not rendered, so a partial JSON patch never reaches the DOM.

## Terminal status

| Status | When |
| --- | --- |
| `finished_successfully` | The generator finished and the client did not abort. |
| `stopped` | The fetch was aborted, or the server noticed the abort. Partial text is kept. |
| `error` | The model call failed. `error` on the session root is the message shown under the reply. |

The stream still ends with `data: [DONE]` after an error or a stop, unless the connection is already gone.

## Prepare

`POST /backend-api/f/conversation/prepare`

```json
{ "draft": "Explain how", "model": "gpt-prototype", "conversation_id": null }
```

```json
{ "status": "ok", "warmup_state": "warm", "conduit_prewarmed": true, "model": "gpt-prototype" }
```

An empty draft is `warmup_state: "cold"`. This request is not the answer and does not open an SSE stream.

## Hosted models

If the requested model is not `gpt-prototype`, the server calls `https://api.openai.com/v1/chat/completions` with `stream: true` and reads that API’s own SSE (`choices[].delta.content`, then `data: [DONE]`). Each content string is written back out as a v1 append. The browser never sees the upstream frame shape.

The local model takes the composed reply and writes it in short pieces, about 18 characters at a time, so the same client path is visible without a key.

## Watching it

```bash
curl -N -X POST http://localhost:3000/backend-api/f/conversation \
  -H 'content-type: application/json' \
  -H 'accept: text/event-stream' \
  -d '{"conversation_id":"c1","parent_message_id":"u1","message_id":"a1","model":"gpt-prototype","messages":[{"role":"user","content":"Explain how this chat streams its answer"}]}'
```

`-N` turns off curl’s buffer. Frames should print as they are produced, not in one block at the end.
