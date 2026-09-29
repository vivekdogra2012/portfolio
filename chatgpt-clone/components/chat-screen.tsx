"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/components/chat-provider";
import { Composer } from "@/components/composer";
import { ChevronIcon, PlusIcon, SidebarIcon } from "@/components/icons";
import { MessageList } from "@/components/message-list";
import { visibleThread } from "@/lib/tree";

export function ChatScreen() {
  const {
    hydrated,
    active,
    activeId,
    model,
    models,
    setModel,
    desktopOpen,
    toggleDesktop,
    openDrawer,
    newChat,
    send,
    focusTick,
    routeReady,
  } = useChat();
  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft("");
  }, [activeId, focusTick]);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [menuOpen]);

  const messages = active ? visibleThread(active) : [];
  const missing = Boolean(hydrated && activeId && !active);
  const empty = hydrated && !missing && messages.length === 0;

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    send(text);
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 items-center gap-2 px-2">
        <div className="flex items-center">
          <button
            type="button"
            className={`grid size-9 place-items-center rounded-lg hover:bg-white/10 ${desktopOpen ? "md:hidden" : ""}`}
            aria-label="Open sidebar"
            onClick={() => {
              if (window.matchMedia("(min-width: 768px)").matches) toggleDesktop();
              else openDrawer();
            }}
          >
            <SidebarIcon className="size-5" />
          </button>
          <button
            type="button"
            className={`grid size-9 place-items-center rounded-lg hover:bg-white/10 ${desktopOpen ? "hidden" : "hidden md:grid"}`}
            aria-label="New chat"
            onClick={newChat}
          >
            <PlusIcon className="size-5" />
          </button>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-lg hover:bg-white/10"
            aria-expanded={menuOpen}
            aria-haspopup="listbox"
            onClick={() => setMenuOpen((open) => !open)}
          >
            ChatGPT
            <ChevronIcon className="size-4 text-muted" />
          </button>
          {menuOpen ? (
            <ul
              role="listbox"
              aria-label="Model"
              className="absolute left-0 top-11 z-20 w-64 rounded-xl bg-elevated p-1.5 shadow-xl shadow-black/40 ring-1 ring-white/10"
            >
              {models.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={item.id === model}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                    onClick={() => {
                      setModel(item.id);
                      setMenuOpen(false);
                    }}
                  >
                    <span>
                      <span className="block">{item.label}</span>
                      <span className="text-xs text-muted">{item.provider === "local" ? "On this server" : "Hosted"}</span>
                    </span>
                    {item.id === model ? <span aria-hidden="true">✓</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      {!hydrated || !routeReady ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted">Loading chats…</div>
      ) : missing ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-lg">This chat isn’t on this device.</p>
          <button type="button" className="rounded-full bg-white px-4 py-2 text-sm text-black" onClick={newChat}>
            Start a new chat
          </button>
        </div>
      ) : empty ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10">
          <h1 className="mb-7 text-center text-[1.75rem] font-normal tracking-tight">What can I help with?</h1>
          <Composer
            value={draft}
            onChange={setDraft}
            onSubmit={submit}
            showSuggestions
            onSuggest={(text) => {
              setDraft("");
              send(text);
            }}
          />
        </div>
      ) : active ? (
        <>
          <MessageList conversation={active} />
          <div className="bg-gradient-to-t from-bg via-bg to-transparent px-4 pb-4 pt-2">
            <Composer value={draft} onChange={setDraft} onSubmit={submit} showSuggestions={false} onSuggest={() => {}} />
          </div>
        </>
      ) : null}
    </section>
  );
}
