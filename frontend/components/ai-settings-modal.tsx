"use client";

import { cn } from "@/lib/utils";
import {
  Cpu,
  Eye,
  EyeOff,
  Info,
  Settings,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { type AIProvider, type AISettings, useAi } from "./ai-provider";

export default function AiSettingsModal() {
  const { settings, saveSettings, isSettingsOpen, setSettingsOpen } = useAi();

  const [provider, setProvider] = useState<AIProvider>("ollama");
  const [endpoint, setEndpoint] = useState("");
  const [model, setModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  // Sync state when settings are loaded/opened
  useEffect(() => {
    if (isSettingsOpen) {
      setProvider(settings.provider);
      setEndpoint(settings.endpoint || "");
      setModel(settings.model || "");
      setApiKey(settings.apiKey || "");
      setError("");
    }
  }, [isSettingsOpen, settings]);

  // Handle provider changes to set sensible defaults
  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider);
    if (newProvider === "ollama") {
      setEndpoint("http://localhost:11434");
      setModel("llama3");
    } else if (newProvider === "gemini") {
      setEndpoint("");
      setModel("gemini-1.5-flash");
    } else if (newProvider === "openai") {
      setEndpoint("");
      setModel("gpt-4o-mini");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if ((provider === "openai" || provider === "gemini") && !apiKey.trim()) {
      setError(
        `API Key is required for ${provider === "openai" ? "OpenAI" : "Google Gemini"}.`,
      );
      return;
    }

    if (provider === "ollama" && !endpoint.trim()) {
      setError("Ollama API Endpoint is required.");
      return;
    }

    if (!model.trim()) {
      setError("Model name is required.");
      return;
    }

    const updatedSettings: AISettings = {
      provider,
      endpoint: provider === "ollama" ? endpoint.trim() : "",
      model: model.trim(),
      apiKey: provider === "ollama" ? "" : apiKey.trim(),
    };

    saveSettings(updatedSettings);
    setSettingsOpen(false);
  };

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop handles dismissal via mouse/tap click */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setSettingsOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="gradient-navy px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <Settings size={18} className="text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">AI Assistant Settings</h3>
              <p className="text-[11px] text-slate-300">
                Configure your local or cloud LLM provider
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content & Form */}
        <form
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
              <Info size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Provider Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block uppercase tracking-wider">
              Select AI Provider
            </span>
            <div className="grid grid-cols-3 gap-3">
              {/* Ollama */}
              <button
                type="button"
                onClick={() => handleProviderChange("ollama")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 gap-1.5",
                  provider === "ollama"
                    ? "border-orange-500 bg-orange-50/50 text-orange-700 ring-2 ring-orange-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                <Cpu
                  size={20}
                  className={cn(
                    provider === "ollama"
                      ? "text-orange-500"
                      : "text-slate-400",
                  )}
                />
                <span className="text-xs font-bold block leading-none">
                  Ollama
                </span>
                <span className="text-[9px] text-slate-400">
                  Local Inference
                </span>
              </button>

              {/* Gemini */}
              <button
                type="button"
                onClick={() => handleProviderChange("gemini")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 gap-1.5",
                  provider === "gemini"
                    ? "border-orange-500 bg-orange-50/50 text-orange-700 ring-2 ring-orange-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                <Sparkles
                  size={20}
                  className={cn(
                    provider === "gemini"
                      ? "text-orange-500"
                      : "text-slate-400",
                  )}
                />
                <span className="text-xs font-bold block leading-none">
                  Gemini
                </span>
                <span className="text-[9px] text-slate-400">Google BYOK</span>
              </button>

              {/* OpenAI */}
              <button
                type="button"
                onClick={() => handleProviderChange("openai")}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 gap-1.5",
                  provider === "openai"
                    ? "border-orange-500 bg-orange-50/50 text-orange-700 ring-2 ring-orange-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                <Shield
                  size={20}
                  className={cn(
                    provider === "openai"
                      ? "text-orange-500"
                      : "text-slate-400",
                  )}
                />
                <span className="text-xs font-bold block leading-none">
                  OpenAI
                </span>
                <span className="text-[9px] text-slate-400">OpenAI BYOK</span>
              </button>
            </div>
          </div>

          {/* Dynamic Inputs depending on Provider */}
          <div className="space-y-4">
            {/* Ollama Endpoint */}
            {provider === "ollama" && (
              <div className="space-y-1.5 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="endpoint-input"
                    className="text-xs font-semibold text-slate-700 block uppercase tracking-wider"
                  >
                    Ollama API Endpoint
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Default: http://localhost:11434
                  </span>
                </div>
                <input
                  id="endpoint-input"
                  type="url"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="e.g. http://localhost:11434"
                  className="td-input"
                />
              </div>
            )}

            {/* Model Name */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="model-input"
                  className="text-xs font-semibold text-slate-700 block uppercase tracking-wider"
                >
                  Model Name
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {provider === "ollama" && "e.g. llama3, phi3, gemma"}
                  {provider === "gemini" &&
                    "e.g. gemini-1.5-flash, gemini-1.5-pro"}
                  {provider === "openai" && "e.g. gpt-4o-mini, gpt-4o"}
                </span>
              </div>
              <input
                id="model-input"
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={
                  provider === "ollama"
                    ? "llama3"
                    : provider === "gemini"
                      ? "gemini-1.5-flash"
                      : "gpt-4o-mini"
                }
                className="td-input"
              />
            </div>

            {/* API Key (for Cloud BYOK) */}
            {provider !== "ollama" && (
              <div className="space-y-1.5 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                <label
                  htmlFor="api-key-input"
                  className="text-xs font-semibold text-slate-700 block uppercase tracking-wider"
                >
                  API Key
                </label>
                <div className="relative">
                  <input
                    id="api-key-input"
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={
                      provider === "gemini"
                        ? "Enter Google Gemini API Key"
                        : "Enter OpenAI API Key"
                    }
                    className="td-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 flex items-start gap-1">
                  <Info size={12} className="shrink-0 mt-0.5" />
                  <span>
                    Keys are stored strictly in your browser's local storage and
                    sent proxy-encrypted.
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-200 hover:shadow-orange-300 transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
