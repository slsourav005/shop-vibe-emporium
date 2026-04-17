import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, Sparkles, X, Check } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface ExtractedItem {
  name: string;
  quantity: string;
  suggestedPrice: string;
}

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  items?: ExtractedItem[];
  pendingTempId?: string;
}

interface Props {
  onListed?: () => void;
  compact?: boolean;
}

// Stable per-browser seller id
const getSellerId = () => {
  let id = localStorage.getItem("vv_seller_id");
  if (!id) {
    id = `seller-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("vv_seller_id", id);
  }
  return id;
};

const SellerChat = ({ onListed, compact = false }: Props) => {
  const sellerId = useRef(getSellerId());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hi! Tell me what you'd like to sell — e.g., \"I'm selling 2 kg rice and 3 kg wheat\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId: sellerId.current, message: text }),
      });
      const data = await res.json();

      if (data?.type === "SELL" && data?.tempId && Array.isArray(data.items)) {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: data.message || "Do you want to sell at the suggested price?",
            items: data.items,
            pendingTempId: data.tempId,
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "bot", text: data?.reply || "Got it 👍" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (tempId: string, confirm: boolean) => {
    setConfirming(tempId);
    try {
      const res = await fetch(`${API_BASE}/confirm-sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempId, confirm }),
      });
      const data = await res.json();

      // Remove the pending state from the message
      setMessages((m) =>
        m.map((msg) =>
          msg.pendingTempId === tempId ? { ...msg, pendingTempId: undefined } : msg
        )
      );

      if (confirm && data?.products) {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: `✅ ${data.products.length} item${data.products.length > 1 ? "s" : ""} listed on the marketplace!`,
          },
        ]);
        onListed?.();
      } else {
        setMessages((m) => [
          ...m,
          { role: "bot", text: confirm ? "Saved." : "Cancelled." },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Could not complete the action. Please try again." },
      ]);
    } finally {
      setConfirming(null);
    }
  };

  return (
    <div className={`flex flex-col ${compact ? "h-[520px]" : "h-[70vh]"} overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-modal)]`}>
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Sell with AI</h3>
          <p className="text-xs text-muted-foreground">Describe what you want to sell</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p>{m.text}</p>
                {m.items && (
                  <div className="mt-2 space-y-1.5">
                    {m.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-lg bg-card/80 px-2.5 py-1.5 text-xs text-foreground"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        <span className="font-medium capitalize">{it.name}</span>
                        <span className="text-muted-foreground">· {it.quantity}</span>
                        <span className="ml-auto font-semibold text-primary">
                          {it.suggestedPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {m.pendingTempId && (
                  <div className="mt-3 flex gap-2">
                    <button
                      disabled={confirming === m.pendingTempId}
                      onClick={() => handleConfirm(m.pendingTempId!, true)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
                    >
                      {confirming === m.pendingTempId ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5" /> List it
                        </>
                      )}
                    </button>
                    <button
                      disabled={confirming === m.pendingTempId}
                      onClick={() => handleConfirm(m.pendingTempId!, false)}
                      className="flex items-center justify-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-muted px-3.5 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-muted/20 p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="e.g., 2 kg rice and 1 L honey"
            className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:brightness-110 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerChat;
