import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSseChunk } from "../lib/sse";

test("reassembles frames split across chunks", () => {
  const first = parseSseChunk("event: delta\ndata: {\"v\":\"Hel");
  assert.equal(first.frames.length, 0);
  assert.match(first.rest, /Hel/);

  const second = parseSseChunk(`${first.rest}lo"}\n\n: keep-alive\n\ndata: [DONE]\n\n`);
  assert.equal(second.frames.length, 2);
  assert.equal(second.frames[0].event, "delta");
  assert.equal(JSON.parse(second.frames[0].data).v, "Hello");
  assert.equal(second.frames[1].event, "message");
  assert.equal(second.frames[1].data, "[DONE]");
  assert.equal(second.rest, "");
});

test("joins multi-line data fields and ignores comments", () => {
  const parsed = parseSseChunk(": pad\n\nevent: delta\ndata: line one\ndata: line two\n\n");
  assert.equal(parsed.frames.length, 1);
  assert.equal(parsed.frames[0].data, "line one\nline two");
});
