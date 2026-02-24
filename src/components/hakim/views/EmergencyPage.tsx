"use client";

import { useState } from "react";
import {
  Ambulance,
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowLeft,
  FirstAid,
  Phone,
  Warning,
} from "@phosphor-icons/react";
import type { Hospital, TriageResult } from "@/types";
import type { ViewType } from "../routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface EmergencyPageProps {
  darkMode: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  symptoms: string;
  setSymptoms: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  triageResult: TriageResult | null;
  setTriageResult: (value: TriageResult | null) => void;
  reportEmergency: () => void;
  apiPost: (path: string, body: unknown, token?: string) => Promise<any>;
  getSeverityColor: (level: string) => string;
  getSeverityLabel: (level: string) => string;
  onNavigate: (view: ViewType) => void;
  navigation: React.ReactNode;
  footer?: React.ReactNode;
}

export function EmergencyPage({
  darkMode,
  loading,
  isAuthenticated,
  symptoms,
  setSymptoms,
  phone,
  setPhone,
  name,
  setName,
  hospitals,
  selectedHospital,
  setSelectedHospital,
  triageResult,
  setTriageResult,
  reportEmergency,
  apiPost,
  getSeverityColor,
  getSeverityLabel,
  onNavigate,
  navigation,
  footer,
}: EmergencyPageProps) {
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const sendChat = async () => {
    const content = chatInput.trim();
    if (!content || chatLoading) return;
    const nextMessages = [...chatMessages, { role: "user", content }];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await apiPost("/api/emergency/chat", {
        messages: nextMessages.slice(-10),
        symptomsText: symptoms,
      });
      if (res?.success && res.reply) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
      } else {
        alert(res?.error || "Failed to get AI response.");
      }
    } catch (error) {
      console.error("Emergency chat error:", error);
      alert("Failed to get AI response.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background">
      {navigation}

      <section className="pt-8 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <Button
              onClick={() => onNavigate("landing")}
              variant="ghost"
              className="flex items-center gap-2 transition mb-6 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-destructive/15 border border-destructive/30">
                <Ambulance size={24} className="text-destructive" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Emergency Assist</h1>
                <p className="text-muted-foreground">Get triage guidance for your symptoms</p>
              </div>
            </div>

            <div className="rounded-2xl p-4 mb-6 bg-destructive/10 border border-destructive/30">
              <div className="flex items-start gap-3">
                <Warning size={24} className="text-destructive flex-shrink-0" />
                <div>
                  <p className="font-bold text-destructive">IMPORTANT DISCLAIMER</p>
                  <p className="text-sm mt-1 text-destructive/90">
                    This system does NOT replace emergency services. If this is a life-threatening
                    emergency, call <strong>911</strong> immediately or proceed to the nearest emergency room.
                  </p>
                </div>
              </div>
            </div>

            {!triageResult ? (
              <>
                <div className="rounded-2xl border border-border bg-card p-6 mb-6 transition-colors duration-300">
                  <Label className="block font-semibold mb-3" htmlFor="emergency-symptoms">
                    Describe Your Symptoms
                  </Label>
                  <Textarea
                    id="emergency-symptoms"
                    placeholder="Please describe your symptoms in detail. For example: 'I have severe chest pain and difficulty breathing for the past 30 minutes'"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl"
                  />
                  {isAuthenticated && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      Be as specific as possible for better triage assessment.
                    </p>
                  )}
                </div>

                {!isAuthenticated && (
                  <div className="rounded-2xl border border-border bg-card p-6 mb-6 transition-colors duration-300">
                    <h3 className="font-semibold mb-4 text-foreground">Your Contact Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="block text-sm font-medium mb-2" htmlFor="emergency-phone">
                          Phone Number *
                        </Label>
                        <Input
                          id="emergency-phone"
                          type="tel"
                          placeholder="09XXXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label className="block text-sm font-medium mb-2" htmlFor="emergency-name">
                          Your Name
                        </Label>
                        <Input
                          id="emergency-name"
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-border bg-card p-6 mb-6 transition-colors duration-300">
                  <Label className="block font-semibold mb-3" htmlFor="emergency-hospital">
                    Nearest Hospital (Optional)
                  </Label>
                  <Select
                    value={selectedHospital?.id || ""}
                    onValueChange={(value) => {
                      const hospital = hospitals.find(h => h.id === value);
                      setSelectedHospital(hospital || null);
                    }}
                  >
                    <SelectTrigger id="emergency-hospital" className="h-12 rounded-xl">
                      <SelectValue placeholder="Select hospital (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals.map(h => (
                        <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={reportEmergency}
                  disabled={loading || symptoms.length < 10}
                  variant="destructive"
                  size="lg"
                  className="w-full rounded-xl text-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <ArrowClockwise className="animate-spin" size={20} />
                  ) : (
                    <>
                      <FirstAid size={20} />
                      Get Triage Assessment
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <div className={`rounded-2xl p-6 ${getSeverityColor(triageResult.severityLevel)}`}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-black/10 border border-black/20">
                      {triageResult.isEmergency ? (
                        <Warning size={32} weight="fill" className="text-current" />
                      ) : (
                        <FirstAid size={32} weight="fill" className="text-current" />
                      )}
                    </div>
                    <p className="text-sm opacity-80">Severity Level</p>
                    <p className="text-3xl font-bold">{getSeverityLabel(triageResult.severityLevel)}</p>
                    <p className="text-sm opacity-80 mt-1">
                      Confidence: {Math.round(triageResult.confidence * 100)}%
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 transition-colors duration-300">
                  <h3 className="font-semibold mb-3 text-foreground">Recommendation</h3>
                  <p className="leading-relaxed text-muted-foreground">{triageResult.recommendation}</p>
                  {triageResult.keywords.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm mb-2 text-muted-foreground">Identified keywords:</p>
                      <div className="flex flex-wrap gap-2">
                        {triageResult.keywords.map((keyword, i) => (
                          <Badge key={i} variant="outline" className="bg-background/40 text-foreground border-border">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {triageResult.isEmergency && (
                  <Button
                    href="tel:911"
                    asChild
                    variant="destructive"
                    size="lg"
                    className="w-full rounded-xl text-lg"
                  >
                    <a>
                      <Phone size={20} className="inline mr-2 text-white" />
                      Call Emergency Services (911)
                    </a>
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setTriageResult(null);
                    setSymptoms("");
                  }}
                  variant="outline"
                  className="w-full rounded-xl flex items-center justify-center gap-2"
                >
                  <ArrowCounterClockwise size={16} className="text-foreground" />
                  Report Another Symptom
                </Button>
              </div>
            )}

            {isAuthenticated && (
              <div className="mt-8 rounded-2xl border border-border bg-card p-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  AI Emergency Chat
                </h3>
                <p className="text-sm mb-4 text-muted-foreground">
                  Ask follow-up questions about your symptoms or next steps.
                </p>
                <div className="rounded-xl p-4 mb-4 h-56 overflow-y-auto bg-background border border-border">
                  {chatMessages.length === 0 ? (
                    <p className="text-muted-foreground">Start a conversation...</p>
                  ) : (
                    <div className="space-y-3">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`text-sm ${msg.role === "assistant" ? "text-foreground" : "text-foreground"}`}>
                          <span className={`font-semibold ${msg.role === "assistant" ? "text-emerald-700 dark:text-emerald-300" : "text-primary"}`}>
                            {msg.role === "assistant" ? "Assistant" : "You"}:
                          </span>{" "}
                          {msg.content}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendChat();
                      }
                    }}
                    placeholder="Ask about your symptoms..."
                    className="flex-1 px-4 py-3 rounded-xl"
                  />
                  <Button
                    onClick={sendChat}
                    disabled={chatLoading || chatInput.trim().length === 0}
                    className="px-4 py-3 rounded-xl font-semibold"
                  >
                    {chatLoading ? <ArrowClockwise className="animate-spin" size={18} /> : "Send"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {footer}
    </div>
  );
}
