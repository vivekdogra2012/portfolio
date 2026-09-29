"use client";

import { useMemo } from "react";
import { useChat } from "@/components/chat-provider";
import { PlusIcon, SidebarIcon, TrashIcon } from "@/components/icons";
import type { Conversation } from "@/lib/types";

export function Sidebar() {
  const {
    hydrated,
    conversations,
    activeId,
    desktopOpen,
    drawerOpen,
    toggleDesktop,
    closeDrawer,
    newChat,
    openConversation,
    deleteConversation,
  } = useChat();

  const groups = useMemo(() => groupConversations(conversations), [conversations]);

  return (
    <>
      <div className="sidebar-backdrop" data-open={drawerOpen ? "true" : "false"} onClick={closeDrawer} />
      <aside className="sidebar" data-open={desktopOpen ? "true" : "false"} data-drawer={drawerOpen ? "open" : "closed"} aria-label="Conversations">
        <div className="flex items-center gap-1 px-2 pb-1 pt-2">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg text-ink hover:bg-white/10"
            aria-label="Close sidebar"
            onClick={() => {
              if (window.matchMedia("(min-width: 768px)").matches) toggleDesktop();
              else closeDrawer();
            }}
          >
            <SidebarIcon className="size-5" />
          </button>
          <span className="px-1 text-sm font-medium tracking-tight">ChatGPT</span>
        </div>

        <div className="px-2">
          <button
            type="button"
            onClick={newChat}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/10"
          >
            <PlusIcon className="size-4" />
            New chat
          </button>
        </div>

        <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-3" aria-label="Recent chats">
          {!hydrated ? null : conversations.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted">No chats yet</p>
          ) : (
            groups.map((group) => (
              <section key={group.label} className="mb-3">
                <h2 className="px-3 py-1 text-xs text-muted">{group.label}</h2>
                <ul>
                  {group.items.map((conversation) => {
                    const selected = conversation.id === activeId;
                    return (
                      <li key={conversation.id}>
                        <div className={`group flex items-center rounded-lg ${selected ? "bg-white/10" : "hover:bg-white/5"}`}>
                          <button
                            type="button"
                            className="min-w-0 flex-1 truncate px-3 py-2 text-left text-sm"
                            aria-current={selected ? "page" : undefined}
                            onClick={() => openConversation(conversation.id)}
                          >
                            {conversation.title}
                          </button>
                          <button
                            type="button"
                            className="mr-1 grid size-7 place-items-center rounded-md text-muted opacity-0 hover:bg-white/10 hover:text-ink group-hover:opacity-100 focus:opacity-100"
                            aria-label={`Delete ${conversation.title}`}
                            onClick={() => deleteConversation(conversation.id)}
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </nav>

        <div className="border-t border-white/10 px-3 py-3 text-sm text-muted">Local session</div>
      </aside>
    </>
  );
}

function groupConversations(conversations: Conversation[]): { label: string; items: Conversation[] }[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  const startOfWeek = startOfToday - 6 * 86_400_000;
  const buckets = [
    { label: "Today", items: [] as Conversation[] },
    { label: "Yesterday", items: [] as Conversation[] },
    { label: "Previous 7 days", items: [] as Conversation[] },
    { label: "Older", items: [] as Conversation[] },
  ];

  const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
  for (const conversation of sorted) {
    const time = conversation.updatedAt;
    if (time >= startOfToday) buckets[0].items.push(conversation);
    else if (time >= startOfYesterday) buckets[1].items.push(conversation);
    else if (time >= startOfWeek) buckets[2].items.push(conversation);
    else buckets[3].items.push(conversation);
  }
  return buckets.filter((bucket) => bucket.items.length > 0);
}
