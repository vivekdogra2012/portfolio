"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/components/chat-provider";
import { ArrowUpIcon, StopIcon } from "@/components/icons";

const SUGGESTIONS = [
  "Explain how this chat streams its answer",
  "Compare SSE with WebSockets",
  "Write a TypeScript debounce function",
  "Draft a product brief for a notes app",
];

type ComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  showSuggestions: boolean;
  onSuggest: (text: string) => void;
};

export function Composer({ value, onChange, onSubmit, showSuggestions, onSuggest }: ComposerProps) {
  const { streaming, activeId, model, focusTick, stop } = useChat();
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const prepareAbort = useRef<AbortController | null>(null);
  const streamingHere = streaming?.conversationId === activeId;
  const blocked = Boolean(streaming) && !streamingHere;

  useEffect(() => {
    areaRef.current?.focus();
  }, [focusTick, activeId]);

  useEffect(() => {
    const draft = value.trim();
    if (!draft) return;
    const timer = window.setTimeout(() => {
      prepareAbort.current?.abort();
      const controller = new AbortController();
      prepareAbort.current = controller;
      void fetch("/backend-api/f/conversation/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft,
          model,
          conversation_id: activeId,
        }),
        signal: controller.signal,
      }).catch(() => {});
    }, 450);
    return () => window.clearTimeout(timer);
  }, [value, model, activeId]);

  const resize = (element: HTMLTextAreaElement) => {
    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
  };

  return (
    <div className="mx-auto w-full max-w-[48rem]">
      <form
        className="flex items-end gap-2 rounded-[28px] bg-elevated px-2 py-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
        onSubmit={(event) => {
          event.preventDefault();
          if (streamingHere) {
            stop();
            return;
          }
          onSubmit();
        }}
      >
        <label className="sr-only" htmlFor="composer">
          Message
        </label>
        <textarea
          id="composer"
          ref={areaRef}
          data-testid="composer"
          rows={1}
          value={value}
          maxLength={8000}
          placeholder="Ask anything"
          className="max-h-[200px] min-h-10 flex-1 resize-none bg-transparent px-3 py-2 text-base outline-none placeholder:text-white/40"
          onChange={(event) => {
            onChange(event.target.value);
            resize(event.target);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              if (streamingHere) stop();
              else onSubmit();
            }
          }}
        />
        {streamingHere ? (
          <button
            type="button"
            data-testid="stop"
            aria-label="Stop generating"
            className="mb-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white text-black"
            onClick={stop}
          >
            <StopIcon className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            data-testid="send"
            aria-label="Send message"
            disabled={!value.trim() || blocked}
            className="mb-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white text-black disabled:bg-white/15 disabled:text-white/35"
          >
            <ArrowUpIcon className="size-4" />
          </button>
        )}
      </form>
      {blocked ? (
        <p className="mt-2 text-center text-xs text-muted">Wait for the current reply to finish.</p>
      ) : (
        <p className="mt-2 text-center text-xs text-muted">Prototype replies can be incomplete. Check important details.</p>
      )}
      {showSuggestions ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="rounded-full border border-white/10 px-3 py-1.5 text-left text-sm text-ink/90 hover:bg-white/10"
              onClick={() => onSuggest(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
