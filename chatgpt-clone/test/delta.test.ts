import assert from "node:assert/strict";
import { test } from "node:test";
import { applyDelta } from "../lib/delta";

test("appends tokens with a sticky cursor", () => {
  const root: Record<string, unknown> = {};
  let cursor = applyDelta(
    root,
    {
      p: "",
      o: "add",
      v: {
        message: {
          id: "a1",
          content: { content_type: "text", parts: [""] },
          status: "in_progress",
        },
        conversation_id: "c1",
        error: null,
      },
    },
    null,
  );
  cursor = applyDelta(root, { p: "/message/content/parts/0", o: "append", v: "Hello" }, cursor);
  cursor = applyDelta(root, { v: " there" }, cursor);
  cursor = applyDelta(root, { p: "/message/status", o: "replace", v: "finished_successfully" }, cursor);

  const message = root.message as { content: { parts: string[] }; status: string };
  assert.equal(message.content.parts[0], "Hello there");
  assert.equal(message.status, "finished_successfully");
  assert.equal(cursor?.p, "/message/status");
  assert.equal(cursor?.o, "replace");
});

test("patches the root and ignores prototype keys", () => {
  const root: Record<string, unknown> = { message: { status: "in_progress" } };
  applyDelta(root, { p: "", o: "patch", v: { error: "nope" } }, { p: "/message/status", o: "replace" });
  assert.equal(root.error, "nope");

  applyDelta(root, { p: "/__proto__/polluted", o: "replace", v: "x" }, null);
  assert.equal(({} as { polluted?: string }).polluted, undefined);
});
