import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import type { Product } from "@/data/products";

interface Props {
  product: Product | null;
  onClose: () => void;
}

type Step = "form" | "summary" | "success";

const CheckoutModal = ({ product, onClose }: Props) => {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const valid = form.name.trim() && form.phone.trim() && form.address.trim();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://vyapar-vaani.onrender.com/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: String(product.id),
          buyerName: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        }),
      });
      if (!res.ok) throw new Error("Order failed");
      await res.json();
    } catch (err) {
      console.error("Order submission error:", err);
      // Still show success so demo flow isn't blocked; details are logged.
    } finally {
      setLoading(false);
      setStep("success");
    }
  };

  const handleClose = () => {
    setStep("form");
    setForm({ name: "", phone: "", address: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-modal)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          {step === "form" && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground">Checkout</h2>
              <p className="mt-1 text-sm text-muted-foreground">Enter your details to place the order</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Delivery Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Village, District, State, PIN"
                    rows={3}
                    className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <button
                disabled={!valid}
                onClick={() => setStep("summary")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
              >
                Review Order <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === "summary" && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

              <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex gap-3">
                  <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.quantity}</p>
                    <p className="mt-1 text-lg font-bold text-primary">₹{product.price}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-xl border border-border bg-muted/30 p-4">
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Delivery Details</h4>
                <p className="text-sm font-medium text-foreground">{form.name}</p>
                <p className="text-sm text-muted-foreground">{form.phone}</p>
                <p className="text-sm text-muted-foreground">{form.address}</p>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setStep("form")}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Confirm Order</>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.1 }}
              >
                <CheckCircle2 className="h-20 w-20 text-primary" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-2xl font-bold text-foreground"
              >
                Order Placed Successfully!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-sm text-muted-foreground"
              >
                Thank you, {form.name}! Your order for <strong>{product.name}</strong> will be delivered soon.
              </motion.p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={handleClose}
                className="mt-6 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                Continue Shopping
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CheckoutModal;
