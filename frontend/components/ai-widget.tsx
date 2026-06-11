"use client";

import { cn } from "@/lib/utils";
import { Compass } from "lucide-react";
import AiAssistantDrawer from "./ai-assistant-drawer";
import { useAi } from "./ai-provider";
import AiSettingsModal from "./ai-settings-modal";

export default function AiWidget() {
  const { isChatOpen, setChatOpen } = useAi();

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-20 right-4 z-[70] flex flex-col items-center">
        {/* Tooltip on hover */}
        <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 hover:opacity-100 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-md border border-white/10 whitespace-nowrap hidden sm:block">
          Ask Sheru, your Hyderabad Guide!
        </div>

        <button
          type="button"
          onClick={() => setChatOpen(!isChatOpen)}
          className="group relative w-12 h-12 rounded-full bg-gradient-saffron flex items-center justify-center text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 border border-orange-400"
          aria-label="Toggle AI Assistant"
        >
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full bg-orange-500/30 animate-ping opacity-75 scale-110 pointer-events-none" />

          {/* Icon */}
          <Compass
            size={22}
            className={cn(
              "transition-transform duration-500 ease-in-out",
              isChatOpen ? "rotate-[360deg] scale-90" : "group-hover:rotate-45",
            )}
          />

          {/* Small notification indicator */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </span>
        </button>
      </div>

      {/* Floating Chat Drawer */}
      <AiAssistantDrawer />

      {/* Settings Modal */}
      <AiSettingsModal />
    </>
  );
}
