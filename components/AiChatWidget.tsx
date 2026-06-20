"use client";

import { useState, useRef, useEffect, useCallback, useMemo, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { sendChatMessage } from "@/lib/openrouter";
import { useAiChatContext, type ScreenData } from "@/lib/ai-chat-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AiChatWidget({ screenData: propScreenData }: { screenData?: ScreenData | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { screenData: contextScreenData } = useAiChatContext();

  // Use prop screenData if provided, otherwise fall back to context
  const screenData = propScreenData ?? contextScreenData;

  // Only render after mount (avoids SSR issues with createPortal + document.body)
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Compute a stable navigation key from screenData
  const pageKey = useMemo(() => {
    if (!screenData) return "none";
    if (screenData.type === "calculator") return `calc:${screenData.slug}`;
    return "canvas";
  }, [screenData]);

  // Reset messages when navigating to a new page (screenData changes)
  useEffect(() => {
    startTransition(() => {
      setMessages([]);
      setError(null);
    });
  }, [pageKey]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setError(null);

    const userMessage: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    const pendingMessages = [...messages, userMessage];
    setMessages(pendingMessages);
    setIsLoading(true);

    try {
      const apiMessages = pendingMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendChatMessage(apiMessages, screenData);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: response },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, screenData]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mounted) return null;

  return (
    <>{createPortal(
      <>
      {/* Chat button — fixed bottom-right */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg hover:bg-brand-700 transition-all hover:scale-105 active:scale-95"
        aria-label="Open AI Chat"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat panel — slide-over */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-32px)] flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
            style={{ height: "min(600px, calc(100vh - 160px))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">
                  AI
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Ask AI
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close chat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && !error && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-8">
                  {screenData?.type === "calculator"
                    ? `Ask me about the ${screenData.title} calculator.`
                    : "Ask me about the calculators on this page."}
                </p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-brand-600 text-white rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
              {error && (
                <div className="rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    screenData?.type === "calculator"
                      ? `Ask about ${screenData.title}...`
                      : "Ask about this page..."
                  }
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Send message"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>, document.body)}</>
  );
}
