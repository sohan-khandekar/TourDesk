"use client";

import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronRight,
  Compass,
  Info,
  Send,
  Settings,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { type Message, useAi } from "./ai-provider";

const SUGGESTIONS = [
  {
    label: "🗺️ Plan a 1-Day Trip",
    prompt:
      "Plan a dense 1-day historical tour of Hyderabad including Charminar, Golconda Fort, and local food.",
  },
  {
    label: "🍛 What Local Food to Try?",
    prompt:
      "Suggest famous local foods to try in Hyderabad and the best restaurants from the database.",
  },
  {
    label: "🕌 Historical Places Tour",
    prompt:
      "Show me a list of all historical places in the database with their ticket prices and timings.",
  },
  {
    label: "🎡 Amusement & Kids Spots",
    prompt:
      "Which places in the database are best for families with young children?",
  },
];

export default function AiAssistantDrawer() {
  const {
    isChatOpen,
    setChatOpen,
    setSettingsOpen,
    messages,
    sendMessage,
    clearHistory,
    isLoading,
    settings,
  } = useAi();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages list or loading state changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll needs to trigger on loading and message changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isChatOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isChatOpen) {
        setChatOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen, setChatOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput("");
    await sendMessage(msg);
  };

  const handleSuggestionClick = async (prompt: string) => {
    if (isLoading) return;
    await sendMessage(prompt);
  };

  // Safe inline markdown renderer (**bold**, - bullets, line breaks)
  const renderInlineMarkdown = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: parsed inline parts are static
          <strong key={i} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderMessageContent = (content: string) => {
    // Error messages from the provider start with ⚠️
    if (content.startsWith("⚠️")) {
      return (
        <div className="space-y-2">
          <p className="text-red-600 font-bold text-xs flex items-center gap-1.5">
            <span>⚠️</span> AI Error
          </p>
          <p className="text-slate-700 text-sm leading-relaxed">
            {content.replace("⚠️ ", "")}
          </p>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2 transition-colors"
          >
            <Settings size={12} /> Open AI Settings
          </button>
        </div>
      );
    }
    const lines = content.split("\n");
    return (
      <div className="space-y-1.5">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: static parsed lines
              <ul key={idx} className="list-disc pl-5 my-0.5 space-y-1">
                <li className="text-slate-700 text-sm">
                  {renderInlineMarkdown(trimmed.substring(2))}
                </li>
              </ul>
            );
          }
          if (trimmed.match(/^\d+\.\s/)) {
            const match = trimmed.match(/^(\d+\.\s)(.*)/);
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: static parsed lines
              <ol key={idx} className="list-decimal pl-5 my-0.5 space-y-1">
                <li className="text-slate-700 text-sm">
                  {renderInlineMarkdown(match ? match[2] : trimmed)}
                </li>
              </ol>
            );
          }
          if (!trimmed) {
            // biome-ignore lint/suspicious/noArrayIndexKey: empty spacing line
            return <div key={idx} className="h-2" />;
          }
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: static parsed lines
            <p key={idx} className="text-slate-700 text-sm leading-relaxed">
              {renderInlineMarkdown(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isChatOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handles mouse interaction only
        <div
          className="fixed inset-0 z-[80] bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => setChatOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        ref={containerRef}
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[440px] z-[90] bg-white shadow-2xl flex flex-col border-l border-slate-100 transition-transform duration-300 ease-out transform",
          isChatOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="gradient-navy px-5 py-4 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-saffron flex items-center justify-center shadow-lg relative shrink-0">
              <Compass size={20} className="text-white animate-spin-slow" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <span>Sheru</span>
                <span className="text-[9px] bg-white/10 text-orange-400 font-mono px-1.5 py-0.5 rounded uppercase tracking-wider">
                  AI Guide
                </span>
              </h3>
              <p className="text-[10px] text-slate-300">
                Using {settings.provider === "ollama" ? "Local " : ""}
                {settings.provider.toUpperCase()} ({settings.model})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Settings */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              title="AI Settings"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings size={18} />
            </button>
            {/* Clear history */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                title="Clear Chat History"
                className="p-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
            {/* Close drawer */}
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-inner">
                <Sparkles size={32} />
              </div>
              <div className="space-y-2 max-w-sm">
                <h4 className="font-bold text-slate-800 text-base">
                  Hyderabad Travel Assistant
                </h4>
                <p className="text-xs text-slate-500">
                  I can plan itineraries, recommend sightseeing, guide your food
                  adventures, and check metro directions!
                </p>
              </div>

              {/* Suggestion Chips */}
              <div className="w-full space-y-2.5 pt-4">
                <p className="text-[10px] font-bold text-slate-400 text-left uppercase tracking-wider">
                  Quick Prompt Suggestions
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => handleSuggestionClick(s.prompt)}
                      className="flex items-center justify-between p-3 bg-white hover:bg-orange-50/30 border border-slate-200 hover:border-orange-200 rounded-xl text-left text-xs font-semibold text-slate-700 transition duration-200 group shadow-sm"
                    >
                      <span>{s.label}</span>
                      <ChevronRight
                        size={14}
                        className="text-slate-400 group-hover:text-orange-500 group-hover:translate-x-0.5 transition"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m, idx) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: message indices are stable
                    key={idx}
                    className={cn(
                      "flex gap-3 max-w-[85%] animate-in fade-in-50 slide-in-from-bottom-2 duration-200",
                      isAssistant ? "mr-auto" : "ml-auto flex-row-reverse",
                    )}
                  >
                    {/* Icon/Avatar for assistant */}
                    {isAssistant && (
                      <div className="w-8 h-8 rounded-full bg-gradient-saffron flex items-center justify-center shadow shrink-0">
                        <Compass size={14} className="text-white" />
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-slate-800 text-sm shadow-sm border",
                        isAssistant
                          ? "bg-white border-slate-100 rounded-tl-none"
                          : "gradient-navy text-white border-transparent rounded-tr-none",
                      )}
                    >
                      {isAssistant ? (
                        renderMessageContent(m.content)
                      ) : (
                        <p className="leading-relaxed text-sm whitespace-pre-wrap">
                          {m.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing loader */}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-gradient-saffron flex items-center justify-center shadow shrink-0">
                    <Compass size={14} className="text-white animate-spin" />
                  </div>
                  <div className="p-3.5 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Footer Input */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sheru anything about Hyderabad..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-xs sm:text-sm disabled:bg-slate-50 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-200"
            >
              <Send size={16} />
            </button>
          </form>
          <div className="mt-2.5 flex items-center gap-1 justify-center text-[10px] text-slate-400">
            <Info size={12} className="shrink-0" />
            <span>AI responses are built from local database attractions.</span>
          </div>
        </div>
      </div>
    </>
  );
}
