"use client";

import { ChatProvider } from "@/components/chat-provider";
import { ChatScreen } from "@/components/chat-screen";
import { Sidebar } from "@/components/sidebar";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <div className="flex h-dvh overflow-hidden bg-bg text-ink">
        <Sidebar />
        <ChatScreen />
        <div hidden>{children}</div>
      </div>
    </ChatProvider>
  );
}
