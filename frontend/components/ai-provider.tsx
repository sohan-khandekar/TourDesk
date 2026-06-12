"use client";

import axios from "axios";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PLACES_DATA } from "../data/places";

export type AIProvider = "ollama" | "openai" | "gemini";

export interface AISettings {
  provider: AIProvider;
  endpoint: string;
  model: string;
  apiKey: string;
}

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIContextType {
  settings: AISettings;
  saveSettings: (settings: AISettings) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
  isLoading: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const defaultSettings: AISettings = {
  provider: "ollama",
  endpoint: "http://localhost:11434",
  model: "llama3",
  apiKey: "",
};

// Generate a compact text summary of the places for system prompt context
const placesSummary = Object.values(PLACES_DATA)
  .flat()
  .map((p) => {
    const highlightStr = p.highlights.join(", ");
    const base = `- ${p.name} (${p.category}): ${p.description} Location: ${p.location}. Timings: ${p.timings}. Ticket Price: ${p.ticketPrice === 0 ? "Free" : `₹${p.ticketPrice}`}. Metro: ${p.nearestMetro || "N/A"}. Highlights: ${highlightStr}.`;
    if (p.category === "food" && p.dishesToTry) {
      return `${base} Famous dishes to try: ${p.dishesToTry.join(", ")}.`;
    }
    return base;
  })
  .join("\n");

const systemPrompt = `You are "Sheru", a helpful local AI travel assistant for TourDesk in Hyderabad.
You have access to the following official tourist places database for Hyderabad:
${placesSummary}

Rules:
1. Recommend ONLY the actual places in the database above. If a user asks for other places in Hyderabad, you may mention them briefly but always prioritize the ones listed above because TourDesk provides direct information/links for them.
2. Provide daily itineraries or trip plans when asked, combining historical, devotional, nature, food, and amusement spots.
3. For restaurants/food, specify the "Dishes to try" and clearly mention that TourDesk does NOT provide table booking or food ordering, but serves as a local food guide.
4. For attractions, note that TourDesk will redirect them to the official booking site on the details page.
5. Keep your responses concise, welcoming, structured, and helpful. Use bullet points and markdown formatting.`;

// ─────────────────────────────────────────────────────────────────────────────
// Direct provider call helpers — no backend proxy needed
// ─────────────────────────────────────────────────────────────────────────────

async function callOllama(
  endpoint: string,
  model: string,
  messages: Message[],
): Promise<string> {
  const url = `${endpoint.replace(/\/$/, "")}/api/chat`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: false,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data?.message?.content ?? "";
}

async function callOpenAI(
  apiKey: string,
  model: string,
  messages: Message[],
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data?.error?.message ?? res.statusText;
    if (res.status === 401)
      throw new Error("Invalid OpenAI API key. Check your key in AI Settings.");
    if (res.status === 429)
      throw new Error(
        "OpenAI rate limit or quota exceeded. Check your plan on platform.openai.com.",
      );
    throw new Error(`OpenAI error ${res.status}: ${msg}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function callGemini(
  apiKey: string,
  model: string,
  messages: Message[],
): Promise<string> {
  // Gemini doesn't support a system role natively — prepend as a user turn
  const contents: { role: string; parts: { text: string }[] }[] = [];
  for (const m of messages) {
    if (m.role === "system") {
      contents.push({ role: "user", parts: [{ text: m.content }] });
      contents.push({
        role: "model",
        parts: [{ text: "Understood. I will follow those instructions." }],
      });
    } else {
      contents.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      });
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data?.error?.message ?? res.statusText;
    if (res.status === 400 && msg.toLowerCase().includes("api key"))
      throw new Error("Invalid Gemini API key. Check your key in AI Settings.");
    throw new Error(`Gemini error ${res.status}: ${msg}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider component
// ─────────────────────────────────────────────────────────────────────────────

export function AiProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<AISettings>(defaultSettings);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load settings and messages from localStorage client-side
  useEffect(() => {
    const savedSettings = window.localStorage.getItem("tourdesk-ai-settings");
    if (savedSettings) {
      try {
        setSettingsState(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse AI settings", e);
      }
    }

    const savedMessages = window.localStorage.getItem("tourdesk-ai-messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse AI messages", e);
      }
    }
  }, []);

  const saveSettings = useCallback((newSettings: AISettings) => {
    setSettingsState(newSettings);
    window.localStorage.setItem(
      "tourdesk-ai-settings",
      JSON.stringify(newSettings),
    );
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    window.localStorage.removeItem("tourdesk-ai-messages");
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const newUserMessage: Message = { role: "user", content };
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      window.localStorage.setItem(
        "tourdesk-ai-messages",
        JSON.stringify(updatedMessages),
      );

      setIsLoading(true);

      // Build messages array with system prompt prepended
      const apiMessages: Message[] = [
        { role: "system", content: systemPrompt },
        ...updatedMessages,
      ];

      try {
        let replyContent = "";

        if (settings.provider === "ollama") {
          replyContent = await callOllama(
            settings.endpoint || "http://localhost:11434",
            settings.model,
            apiMessages,
          );
        } else if (settings.provider === "openai") {
          if (!settings.apiKey) {
            throw new Error(
              "OpenAI API key is missing. Open AI Settings and add your key.",
            );
          }
          replyContent = await callOpenAI(
            settings.apiKey,
            settings.model,
            apiMessages,
          );
        } else if (settings.provider === "gemini") {
          if (!settings.apiKey) {
            throw new Error(
              "Gemini API key is missing. Open AI Settings and add your key.",
            );
          }
          replyContent = await callGemini(
            settings.apiKey,
            settings.model,
            apiMessages,
          );
        }

        const assistantMessage: Message = {
          role: "assistant",
          content:
            replyContent || "I received an empty response. Please try again.",
        };

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        window.localStorage.setItem(
          "tourdesk-ai-messages",
          JSON.stringify(finalMessages),
        );
      } catch (error: unknown) {
        console.error("AI Assistant error", error);
        const errMsg =
          error instanceof Error
            ? error.message
            : "Unexpected error. Please try again.";

        const assistantMessage: Message = {
          role: "assistant",
          content: `⚠️ ${errMsg}`,
        };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        window.localStorage.setItem(
          "tourdesk-ai-messages",
          JSON.stringify(finalMessages),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, settings, isLoading],
  );

  const contextValue = useMemo(
    () => ({
      settings,
      saveSettings,
      isSettingsOpen,
      setSettingsOpen,
      isChatOpen,
      setChatOpen,
      messages,
      sendMessage,
      clearHistory,
      isLoading,
    }),
    [
      settings,
      saveSettings,
      isSettingsOpen,
      isChatOpen,
      messages,
      sendMessage,
      clearHistory,
      isLoading,
    ],
  );

  return (
    <AIContext.Provider value={contextValue}>{children}</AIContext.Provider>
  );
}

export function useAi() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAi must be used within an AiProvider");
  }
  return context;
}
