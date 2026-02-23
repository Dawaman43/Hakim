"use client";

import { useState } from "react";
import { ArrowLeft, ArrowClockwise, Sparkle } from "@phosphor-icons/react";
import type { ViewType } from "../routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AssistantPageProps {
  darkMode: boolean;
  apiPost: (path: string, body: unknown, token?: string) => Promise<any>;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
  footer?: React.ReactNode;
  t: Record<string, string>;
}

export function AssistantPage({
  darkMode,
  apiPost,
  onNavigate,
  navigation,
  footer,
  t,
}: AssistantPageProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await apiPost("/api/assistant/chat", {
        messages: nextMessages.slice(-12),
      });
      if (res?.success && res.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
      } else {
        alert(res?.error || "Failed to get AI response.");
      }
    } catch (error) {
      console.error("Assistant chat error:", error);
      alert("Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background">
      {navigation}

      <section className="pt-8 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            onClick={() => onNavigate("dashboard")}
            variant="ghost"
            className="flex items-center gap-2 transition mb-6 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft size={20} />
            {t.backToDashboard}
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/30">
              <Sparkle size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t.aiDoctorTitle}</h1>
              <p className="text-muted-foreground">{t.aiDoctorSubtitle}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 mb-6 transition-colors duration-300">
            <p className="text-sm text-muted-foreground">{t.aiDoctorDisclaimer}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 transition-colors duration-300">
            <div className="rounded-xl p-4 mb-4 h-80 overflow-y-auto bg-background border border-border">
              {messages.length === 0 ? (
                <p className="text-muted-foreground">{t.aiDoctorEmpty}</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div key={idx} className="text-sm text-foreground">
                      <span className={`font-semibold ${msg.role === "assistant" ? "text-primary" : "text-foreground"}`}>
                        {msg.role === "assistant" ? t.aiDoctorName : t.youLabel}:
                      </span>{" "}
                      {msg.content}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={t.aiDoctorPlaceholder}
                className="flex-1 px-4 py-3 rounded-xl"
              />
              <Button
                onClick={sendMessage}
                disabled={loading || input.trim().length === 0}
                className="px-4 py-3 rounded-xl font-semibold"
              >
                {loading ? <ArrowClockwise className="animate-spin" size={18} /> : t.sendLabel}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
