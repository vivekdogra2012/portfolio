"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/components/chat-provider";
import { CopyIcon, RefreshIcon } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import { siblingsOf, visibleThread } from "@/lib/tree";
import type { Conversation, MessageNode } from "@/lib/types";

export function MessageList({ conversation }: { conversation: Conversation }) {
  const { streaming, activateSibling, regenerate } = useChat();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const messages = visibleThread(conversation);
  const last = messages.at(-1);
  const streamingHere = streaming?.conversationId === conversation.id;

  useEffect(() => {
    const element = scrollerRef.current;
    if (!element || !stickRef.current) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, last?.content, last?.status]);

  return (
    <div
      ref={scrollerRef}
      className="min-h-0 flex-1 overflow-y-auto"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      onScroll={(event) => {
        const element = event.currentTarget;
        stickRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80;
      }}
    >
      <div className="mx-auto flex w-full max-w-[48rem] flex-col gap-6 px-4 py-6">
        {messages.map((message, index) => (
          <Message
            key={message.id}
            conversation={conversation}
            message={message}
            isLast={index === messages.length - 1}
            streamingHere={streamingHere}
            onActivate={activateSibling}
            onRegenerate={regenerate}
          />
        ))}
      </div>
    </div>
  );
}

function Message({
  conversation,
  message,
  isLast,
  streamingHere,
  onActivate,
  onRegenerate,
}: {
  conversation: Conversation;
  message: MessageNode;
  isLast: boolean;
  streamingHere: boolean;
  onActivate: (nodeId: string) => void;
  onRegenerate: () => void;
}) {
  const siblings = siblingsOf(conversation, message.id);
  const siblingIndex = siblings.findIndex((item) => item.id === message.id);
  const showActions = message.role === "assistant" && message.status !== "in_progress";
  const [copied, setCopied] = useState(false);

  if (message.role === "user") {
    return (
      <div className="flex justify-end" data-testid="message" data-role="user">
        <div className="max-w-[80%]">
          <div className="whitespace-pre-wrap break-words rounded-3xl bg-elevated px-4 py-2.5 text-base leading-7">
            {message.content}
          </div>
          {siblings.length > 1 ? (
            <SiblingPager index={siblingIndex} count={siblings.length} siblings={siblings} onActivate={onActivate} />
          ) : null}
        </div>
      </div>
    );
  }

  const generating = message.status === "in_progress";

  return (
    <article className="group" data-testid="message" data-role="assistant" data-status={message.status}>
      {generating && !message.content ? (
        <TypingDots />
      ) : (
        <div className="relative">
          {message.content ? <Markdown text={message.content} /> : null}
          {generating && message.content ? <span className="caret ml-0.5 inline-block h-[1.05em] w-[0.45em] translate-y-[0.15em] bg-white/80" /> : null}
        </div>
      )}
      {message.status === "stopped" ? <p className="mt-2 text-sm text-muted">Stopped</p> : null}
      {message.status === "error" ? (
        <p className="mt-2 text-sm text-red-300" role="alert">
          {message.error || "Something went wrong generating this reply."}
        </p>
      ) : null}
      <div className={`mt-2 flex items-center gap-1 ${isLast ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"}`}>
        {siblings.length > 1 ? (
          <SiblingPager index={siblingIndex} count={siblings.length} siblings={siblings} onActivate={onActivate} />
        ) : null}
        {showActions ? (
          <>
            <button
              type="button"
              className="grid size-8 place-items-center rounded-lg text-muted hover:bg-white/10 hover:text-ink"
              aria-label={copied ? "Copied" : "Copy"}
              onClick={() => {
                void navigator.clipboard?.writeText(message.content).then(() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                });
              }}
            >
              <CopyIcon className="size-4" />
            </button>
            {isLast && !streamingHere ? (
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg text-muted hover:bg-white/10 hover:text-ink"
                aria-label="Regenerate"
                data-testid="regenerate"
                onClick={onRegenerate}
              >
                <RefreshIcon className="size-4" />
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </article>
  );
}

function SiblingPager({
  index,
  count,
  siblings,
  onActivate,
}: {
  index: number;
  count: number;
  siblings: MessageNode[];
  onActivate: (nodeId: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 text-xs text-muted">
      <button
        type="button"
        className="grid size-7 place-items-center rounded-md hover:bg-white/10 disabled:opacity-30"
        aria-label="Previous branch"
        disabled={index <= 0}
        onClick={() => onActivate(siblings[index - 1].id)}
      >
        ‹
      </button>
      <span>
        {index + 1}/{count}
      </span>
      <button
        type="button"
        className="grid size-7 place-items-center rounded-md hover:bg-white/10 disabled:opacity-30"
        aria-label="Next branch"
        disabled={index >= count - 1}
        onClick={() => onActivate(siblings[index + 1].id)}
      >
        ›
      </button>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-3" data-testid="typing">
      <span className="size-2 animate-bounce rounded-full bg-white/70 [animation-delay:0ms]" />
      <span className="size-2 animate-bounce rounded-full bg-white/70 [animation-delay:150ms]" />
      <span className="size-2 animate-bounce rounded-full bg-white/70 [animation-delay:300ms]" />
    </span>
  );
}
