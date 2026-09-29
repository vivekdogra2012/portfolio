"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { applyFrame, createStreamSession, readAssistant } from "@/lib/stream-session";
import { readSse } from "@/lib/sse";
import { loadConversations, saveConversations } from "@/lib/storage";
import {
  activateNode,
  appendTurn,
  modelMessages,
  patchNode,
  removeConversation,
  setResumeToken,
  setTitle,
  spawnAssistant,
} from "@/lib/tree";
import type { Conversation, MessageStatus, ModelInfo } from "@/lib/types";

const MODEL_KEY = "chatgpt-clone.model";

type Streaming = { conversationId: string; messageId: string };

type ChatContextValue = {
  hydrated: boolean;
  conversations: Conversation[];
  activeId: string | null;
  active: Conversation | null;
  streaming: Streaming | null;
  models: ModelInfo[];
  model: string;
  setModel: (id: string) => void;
  desktopOpen: boolean;
  drawerOpen: boolean;
  routeReady: boolean;
  toggleDesktop: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  focusTick: number;
  newChat: () => void;
  openConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  send: (text: string) => void;
  stop: () => void;
  regenerate: () => void;
  activateSibling: (nodeId: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [routeReady, setRouteReady] = useState(false);
  const [streaming, setStreaming] = useState<Streaming | null>(null);
  const [model, setModelState] = useState("gpt-prototype");
  const [models, setModels] = useState<ModelInfo[]>([
    { id: "gpt-prototype", label: "gpt-prototype", provider: "local" },
  ]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [focusTick, setFocusTick] = useState(0);

  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const modelRef = useRef(model);
  modelRef.current = model;
  const streamingRef = useRef(streaming);
  streamingRef.current = streaming;
  const abortRef = useRef<AbortController | null>(null);
  const stopRequested = useRef(false);
  const inflight = useRef(false);

  const urlId = useMemo(() => {
    const match = pathname.match(/^\/c\/([^/]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }, [pathname]);

  useEffect(() => {
    setConversations(loadConversations());
    const saved = window.localStorage.getItem(MODEL_KEY);
    if (saved) setModelState(saved);
    const savedSidebar = window.localStorage.getItem("chatgpt-clone.sidebar");
    if (savedSidebar === "closed") setDesktopOpen(false);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setActiveId(urlId);
    setRouteReady(true);
  }, [hydrated, urlId]);

  useEffect(() => {
    if (!hydrated) return;
    saveConversations(conversations);
  }, [conversations, hydrated]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (media.matches) setDrawerOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/backend-api/models")
      .then((response) => response.json())
      .then((data: { models?: ModelInfo[] }) => {
        if (cancelled || !Array.isArray(data.models) || data.models.length === 0) return;
        setModels(data.models);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setModelsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;
    if (!models.some((item) => item.id === model)) setModelState("gpt-prototype");
  }, [models, model, modelsLoaded]);

  const setModel = useCallback((id: string) => {
    setModelState(id);
    window.localStorage.setItem(MODEL_KEY, id);
  }, []);

  const toggleDesktop = useCallback(() => {
    setDesktopOpen((open) => {
      const next = !open;
      window.localStorage.setItem("chatgpt-clone.sidebar", next ? "open" : "closed");
      return next;
    });
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);

  const newChat = useCallback(() => {
    setActiveId(null);
    setDrawerOpen(false);
    setFocusTick((tick) => tick + 1);
    router.push("/");
  }, [router]);

  const openConversation = useCallback(
    (id: string) => {
      setActiveId(id);
      setDrawerOpen(false);
      router.push(`/c/${id}`);
    },
    [router],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((current) => removeConversation(current, id));
      if (activeIdRef.current === id) {
        setActiveId(null);
        router.push("/");
      }
    },
    [router],
  );

  const activateSibling = useCallback((nodeId: string) => {
    const conversationId = activeIdRef.current;
    if (!conversationId || streamingRef.current) return;
    setConversations((current) => activateNode(current, conversationId, nodeId, Date.now()));
  }, []);

  const streamInto = useCallback(
    async (input: { conversationId: string; messageId: string; parentMessageId: string; messages: { role: "user" | "assistant" | "system"; content: string }[] }) => {
      const controller = new AbortController();
      abortRef.current = controller;
      stopRequested.current = false;
      inflight.current = true;
      const nextStreaming = { conversationId: input.conversationId, messageId: input.messageId };
      streamingRef.current = nextStreaming;
      setStreaming(nextStreaming);
      const session = createStreamSession();
      let raf = 0;
      let closed = false;

      const flushNow = () => {
        if (stopRequested.current) return;
        const assistant = readAssistant(session);
        if (assistant) {
          setConversations((current) =>
            patchNode(current, input.conversationId, input.messageId, assistant, Date.now()),
          );
        }
        if (session.title) {
          const title = session.title;
          setConversations((current) => setTitle(current, input.conversationId, title, Date.now()));
        }
        if (session.resumeToken) {
          const token = session.resumeToken;
          setConversations((current) => setResumeToken(current, input.conversationId, token));
        }
      };

      const schedule = () => {
        if (raf || closed || stopRequested.current) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          flushNow();
        });
      };

      try {
        const response = await fetch("/backend-api/f/conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            action: "next",
            conversation_id: input.conversationId,
            parent_message_id: input.parentMessageId,
            message_id: input.messageId,
            model: modelRef.current,
            messages: input.messages,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const detail = (await response.text()).trim();
          let message = detail || `Request failed (${response.status})`;
          try {
            const parsed = JSON.parse(detail) as { error?: unknown };
            if (typeof parsed.error === "string" && parsed.error.trim()) message = parsed.error.trim();
          } catch {
            /* The body was not JSON. Show it as-is. */
          }
          setConversations((current) =>
            patchNode(
              current,
              input.conversationId,
              input.messageId,
              { status: "error", error: message },
              Date.now(),
            ),
          );
          return;
        }

        await readSse(response, (frame) => {
          applyFrame(session, frame);
          schedule();
        });

        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        flushNow();

        const assistant = readAssistant(session);
        if (assistant && assistant.status === "in_progress" && !controller.signal.aborted && !stopRequested.current) {
          setConversations((current) =>
            patchNode(
              current,
              input.conversationId,
              input.messageId,
              { ...assistant, status: "finished_successfully" },
              Date.now(),
            ),
          );
        }
      } catch (error) {
        if (raf) cancelAnimationFrame(raf);
        const aborted = controller.signal.aborted || (error instanceof Error && error.name === "AbortError");
        const assistant = readAssistant(session);
        if (aborted || stopRequested.current) {
          setConversations((current) => {
            const node = current.find((conversation) => conversation.id === input.conversationId)?.mapping[input.messageId];
            const content = assistant?.content ?? node?.content ?? "";
            const status: MessageStatus = assistant?.status === "error" ? "error" : "stopped";
            if (node && node.status !== "in_progress" && node.status !== "stopped") return current;
            return patchNode(
              current,
              input.conversationId,
              input.messageId,
              { content, status, error: assistant?.error },
              Date.now(),
            );
          });
          return;
        }
        const message = error instanceof Error ? error.message : "Stream failed";
        setConversations((current) =>
          patchNode(
            current,
            input.conversationId,
            input.messageId,
            { content: assistant?.content ?? "", status: "error", error: message },
            Date.now(),
          ),
        );
      } finally {
        closed = true;
        inflight.current = false;
        streamingRef.current = null;
        if (abortRef.current === controller) abortRef.current = null;
        setStreaming((current) => (current?.messageId === input.messageId ? null : current));
      }
    },
    [],
  );

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || inflight.current || streamingRef.current) return;
      if (trimmed.length > 8000) return;

      const now = Date.now();
      const existing = conversationsRef.current.find((conversation) => conversation.id === activeIdRef.current);
      const conversationId = existing ? existing.id : createId();
      const systemId = createId();
      const userId = createId();
      const assistantId = createId();

      const next = appendTurn(conversationsRef.current, {
        conversationId,
        now,
        systemId,
        user: { id: userId, content: trimmed },
        assistant: { id: assistantId },
      });
      const conversation = next.find((item) => item.id === conversationId);
      if (!conversation) return;
      const messages = modelMessages(conversation, userId);

      setConversations(next);
      setActiveId(conversationId);
      setDrawerOpen(false);
      if (pathname !== `/c/${conversationId}`) router.push(`/c/${conversationId}`);

      void streamInto({
        conversationId,
        messageId: assistantId,
        parentMessageId: userId,
        messages,
      });
    },
    [pathname, router, streamInto],
  );

  const stop = useCallback(() => {
    stopRequested.current = true;
    abortRef.current?.abort();
    const current = streamingRef.current;
    if (!current) return;
    setConversations((list) => {
      const node = list.find((conversation) => conversation.id === current.conversationId)?.mapping[current.messageId];
      if (!node || node.status !== "in_progress") return list;
      return patchNode(list, current.conversationId, current.messageId, { status: "stopped" }, Date.now());
    });
  }, []);

  const regenerate = useCallback(() => {
    if (inflight.current || streamingRef.current) return;
    const conversationId = activeIdRef.current;
    if (!conversationId) return;
    const conversation = conversationsRef.current.find((item) => item.id === conversationId);
    if (!conversation) return;
    const current = conversation.mapping[conversation.currentNodeId];
    if (!current || current.role !== "assistant" || !current.parentId) return;
    const parent = conversation.mapping[current.parentId];
    if (!parent || parent.role !== "user") return;

    const assistantId = createId();
    const next = spawnAssistant(conversationsRef.current, {
      conversationId,
      parentId: parent.id,
      assistantId,
      now: Date.now(),
    });
    const updated = next.find((item) => item.id === conversationId);
    if (!updated) return;
    setConversations(next);
    void streamInto({
      conversationId,
      messageId: assistantId,
      parentMessageId: parent.id,
      messages: modelMessages(updated, parent.id),
    });
  }, [streamInto]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta || !event.shiftKey) {
        if (event.key === "Escape") setDrawerOpen(false);
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "o") {
        event.preventDefault();
        newChat();
      } else if (key === "s") {
        event.preventDefault();
        toggleDesktop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [newChat, toggleDesktop]);

  const active = conversations.find((conversation) => conversation.id === activeId) ?? null;

  const value = useMemo<ChatContextValue>(
    () => ({
      hydrated,
      conversations,
      activeId,
      active,
      streaming,
      models,
      model,
      setModel,
      desktopOpen,
      drawerOpen,
      routeReady,
      toggleDesktop,
      openDrawer,
      closeDrawer,
      focusTick,
      newChat,
      openConversation,
      deleteConversation,
      send,
      stop,
      regenerate,
      activateSibling,
    }),
    [
      hydrated,
      conversations,
      activeId,
      active,
      streaming,
      models,
      model,
      setModel,
      desktopOpen,
      drawerOpen,
      routeReady,
      toggleDesktop,
      openDrawer,
      closeDrawer,
      focusTick,
      newChat,
      openConversation,
      deleteConversation,
      send,
      stop,
      regenerate,
      activateSibling,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const value = useContext(ChatContext);
  if (!value) throw new Error("useChat must be used within ChatProvider");
  return value;
}

function createId(): string {
  return crypto.randomUUID();
}
