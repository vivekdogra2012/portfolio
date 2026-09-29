import assert from "node:assert/strict";
import { test } from "node:test";
import { appendTurn, modelMessages, siblingsOf, spawnAssistant, visibleThread } from "../lib/tree";

const base = {
  conversationId: "c1",
  now: 1_000,
  systemId: "sys",
  user: { id: "u1", content: "Hello" },
  assistant: { id: "a1" },
};

test("a new chat hides the system root and ends on the assistant", () => {
  const conversations = appendTurn([], base);
  const conversation = conversations[0];
  const visible = visibleThread(conversation);
  assert.deepEqual(
    visible.map((node) => node.role),
    ["user", "assistant"],
  );
  assert.equal(conversation.currentNodeId, "a1");
  assert.equal(conversation.mapping.sys.role, "system");
  assert.equal(conversation.mapping.u1.parentId, "sys");
});

test("regenerate adds an assistant sibling and can switch branches", () => {
  let conversations = appendTurn([], base);
  conversations = spawnAssistant(conversations, {
    conversationId: "c1",
    parentId: "u1",
    assistantId: "a2",
    now: 2_000,
  });
  let conversation = conversations[0];
  assert.equal(conversation.currentNodeId, "a2");
  assert.equal(siblingsOf(conversation, "a2").length, 2);
  assert.deepEqual(modelMessages(conversation, "u1"), [{ role: "user", content: "Hello" }]);

  conversations = appendTurn(conversations, {
    conversationId: "c1",
    now: 3_000,
    systemId: "unused",
    user: { id: "u2", content: "Follow up" },
    assistant: { id: "a3" },
  });
  conversation = conversations[0];
  assert.equal(visibleThread(conversation).at(-1)?.id, "a3");

  const switched = visibleThread({ ...conversation, currentNodeId: "a1" });
  assert.deepEqual(
    switched.map((node) => node.id),
    ["u1", "a1"],
  );
});
