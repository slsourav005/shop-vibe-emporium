import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface ExtractedItem {
  name: string;
  quantity: string;
  suggestedPrice: string;
  imageUrl?: string | null;
}

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  items?: ExtractedItem[];
}

interface Props {
  onListed?: () => void;
  compact?: boolean;
}

const SellerChat = ({ onListed, compact = false }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Hi! I'm your selling assistant. Tell me what you'd like to sell — e.g., \"I'm selling 2 kg rice and 3 kg wheat\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      if (data?.items?.length) {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: `✅ Listed ${data.items.length} item${data.items.length > 1 ? "s" : ""} on the marketplace!`,
            items: data.items,
          },
        ]);
        onListed?.();
      } else {
        setMessages((m) => [
          ...m,
          { role: "bot", text: "Hmm, I couldn't extract any items. Try being more specific." },
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

  return (
    <div className={`flex flex-col ${compact ? "h-[480px]" : "h-[70vh]"} overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-modal)]`}>
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Sell with AI</h3>
          <p className="text-xs text-muted-foreground">Describe what you want to sell</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
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
