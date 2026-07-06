import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, Calendar, Phone, Star } from "lucide-react";
import { API } from "@/lib/api";

const CLINIC_PHONE = "+1 (555) 123-4567";
const CLINIC_PHONE_TEL = "+15551234567";

// Only show action buttons when the assistant is actively directing the user.
// Match specific directive phrases (not just any mention of "appointment").
const detectActions = (text) => {
  if (!text) return { book: false, call: false, reviews: false };
  const t = text.toLowerCase();

  const book =
    /\b(click|tap|use|press|hit)\b[^.]{0,40}\bbook appointment\b/.test(t) ||
    t.includes("book appointment' button") ||
    t.includes('book appointment" button') ||
    t.includes("book-appointment button") ||
    t.includes("book your appointment") ||
    t.includes("schedule your visit") ||
    t.includes("schedule a visit");

  const call =
    t.includes("call us at") ||
    t.includes("call the clinic") ||
    t.includes("call our clinic") ||
    t.includes("call us directly") ||
    t.includes("(555) 123-4567") ||
    t.includes("555-123-4567");

  const reviews =
    t.includes("testimonials section") ||
    t.includes("patient reviews") ||
    t.includes("read our reviews") ||
    t.includes("view our reviews") ||
    t.includes("check our reviews") ||
    t.includes("see our reviews") ||
    t.includes("our testimonials");

  return { book, call, reviews };
};

const genId = () =>
  "sess-" + Math.random().toString(36).slice(2) + Date.now().toString(36);

const WELCOME = {
  role: "assistant",
  isWelcome: true,
  content:
    "Hi! I'm Smile Assistant. Ask me about our services, hours, dental care tips, or anything else — I'm here to help.",
};

export default function ChatWidget({ onBook }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const sessionId = useMemo(() => genId(), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      { role: "assistant", content: "", streaming: true },
    ]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${API}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Network error");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trimStart();
          if (data === "[DONE]") continue;
          if (data.startsWith("[ERROR]")) {
            setMessages((m) => {
              const copy = [...m];
              copy[copy.length - 1] = {
                role: "assistant",
                content:
                  "Sorry, something went wrong. Please try again in a moment.",
              };
              return copy;
            });
            continue;
          }
          setMessages((m) => {
            const copy = [...m];
            const last = copy[copy.length - 1];
            copy[copy.length - 1] = {
              ...last,
              content: (last.content || "") + data,
            };
            return copy;
          });
        }
      }

      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        copy[copy.length - 1] = { ...last, streaming: false };
        return copy;
      });
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry, I couldn't reach the assistant. Please try again.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {!open && (
        <button
          data-testid="ai-chat-toggle-button"
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white grid place-items-center shadow-2xl shadow-blue-900/25 pulse-ring transition-all hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div
          data-testid="ai-chat-panel"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[75vh] rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-blue-900/20 flex flex-col overflow-hidden animate-fade-in-up"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/15 grid place-items-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">
                  Smile Assistant
                </p>
                <p className="text-[11px] text-blue-100 leading-tight">
                  Powered by Gemini · usually replies instantly
                </p>
              </div>
            </div>
            <button
              data-testid="ai-chat-close-button"
              onClick={() => setOpen(false)}
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/15 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3 bg-sky-50/40"
            data-testid="ai-chat-messages"
          >
            {messages.map((m, i) => {
              const actions =
                m.role === "assistant" && !m.streaming && !m.isWelcome
                  ? detectActions(m.content)
                  : { book: false, call: false, reviews: false };
              return (
                <div
                  key={i}
                  className={`flex flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    data-testid={`ai-chat-message-${m.role}`}
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                    }`}
                  >
                    {m.content || (m.streaming ? "…" : "")}
                  </div>

                  {(actions.book || actions.call || actions.reviews) && (
                    <div className="mt-2 flex flex-col gap-2 max-w-[85%] w-full">
                      {actions.book && (
                        <button
                          data-testid="ai-chat-book-button"
                          onClick={() => {
                            setOpen(false);
                            onBook && onBook();
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium h-10 px-4 shadow-sm shadow-blue-600/20 transition-colors"
                        >
                          <Calendar className="h-4 w-4" />
                          Book Appointment
                        </button>
                      )}
                      {actions.call && (
                        <a
                          data-testid="ai-chat-call-button"
                          href={`tel:${CLINIC_PHONE_TEL}`}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium h-10 px-4 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          Call {CLINIC_PHONE}
                        </a>
                      )}
                      {actions.reviews && (
                        <a
                          data-testid="ai-chat-reviews-button"
                          href="#testimonials"
                          onClick={() => setOpen(false)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium h-10 px-4 transition-colors"
                        >
                          <Star className="h-4 w-4" />
                          Read patient reviews
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 p-3 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                data-testid="ai-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Ask about services, hours…"
                className="flex-1 resize-none rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none px-3 py-2 text-sm max-h-28"
              />
              <button
                data-testid="ai-chat-send-button"
                onClick={send}
                disabled={loading || !input.trim()}
                className="h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white grid place-items-center transition-colors"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
