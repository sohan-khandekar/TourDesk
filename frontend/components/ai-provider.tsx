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

      // Construct API payload with the system prompt injected at the start
      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...updatedMessages,
      ];

      try {
        const headers: Record<string, string> = {};
        if (settings.apiKey) {
          headers.Authorization = `Bearer ${settings.apiKey}`;
        }

        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

        const response = await axios.post(
          `${backendUrl}/ai/chat`,
          {
            messages: apiMessages,
            provider: settings.provider,
            model: settings.model,
            endpoint: settings.endpoint,
          },
          { headers },
        );

        const replyContent = response.data.content;
        const assistantMessage: Message = {
          role: "assistant",
          content: replyContent,
        };

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        window.localStorage.setItem(
          "tourdesk-ai-messages",
          JSON.stringify(finalMessages),
        );
        // biome-ignore lint/suspicious/noExplicitAny: error object has dynamic response fields
      } catch (error: any) {
        console.error("AI Assistant error", error);
        let errorMsg =
          "Sorry, I encountered an error communicating with the AI. ";
        if (error.response?.data?.detail) {
          errorMsg += `Detail: ${error.response.data.detail}`;
        } else {
          errorMsg +=
            "Please check your AI Settings (model name, endpoint, or API Key) and ensure Ollama or your cloud provider is accessible.";
        }

        const assistantMessage: Message = {
          role: "assistant",
          content: errorMsg,
        };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
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
