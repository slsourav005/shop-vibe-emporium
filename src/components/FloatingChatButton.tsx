import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import SellerChat from "./SellerChat";

interface Props {
  onListed?: () => void;
}

const FloatingChatButton = ({ onListed }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, delay: 0.5 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-modal)] transition-all hover:scale-110"
        aria-label="Sell with AI"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-end bg-foreground/40 p-4 backdrop-blur-sm sm:items-end"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 22 }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card text-muted-foreground shadow-md transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <SellerChat
                compact
                onListed={() => {
                  onListed?.();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatButton;
