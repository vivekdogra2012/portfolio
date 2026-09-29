"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ text }: { text: string }) {
  return (
    <div className="chat-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            return <>{children}</>;
          },
          code({ className, children }) {
            const value = String(children).replace(/\n$/, "");
            const language = /language-([\w-]+)/.exec(className ?? "")?.[1];
            const block = Boolean(language) || value.includes("\n");
            if (!block) {
              return <code>{value}</code>;
            }
            return <CodeBlock language={language} value={value} />;
          },
          a({ href, children }) {
            const safe = safeHref(href);
            if (!safe) return <span>{children}</span>;
            return (
              <a href={safe} target="_blank" rel="noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, value }: { language?: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className="my-3 overflow-hidden rounded-xl bg-black/45">
      <div className="flex items-center justify-between px-3 py-1.5 text-xs text-white/60">
        <span>{language ?? "code"}</span>
        <button
          type="button"
          className="rounded-md px-2 py-0.5 hover:bg-white/10 hover:text-white"
          onClick={() => {
                void navigator.clipboard?.writeText(value).then(() => {
              setCopied(true);
              window.clearTimeout(timer.current);
              timer.current = window.setTimeout(() => setCopied(false), 1500);
            });
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 pb-3 text-sm leading-6">
        <code className="font-mono">{value}</code>
      </pre>
    </div>
  );
}

function safeHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  if (href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:")) return href;
  return undefined;
}
