import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Tag, Package } from "lucide-react";
import type { Product } from "@/data/products";

interface Props {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

const ProductDetailModal = ({ product, onClose, onBuyNow }: Props) => (
  <AnimatePresence>
    {product && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card shadow-[var(--shadow-modal)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-card/80 p-1.5 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row">
            <div className="aspect-square w-full sm:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover sm:rounded-l-2xl"
                width={512}
                height={512}
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {product.category}
                </span>
                <h2 className="mt-3 text-2xl font-bold text-foreground">{product.name}</h2>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4 text-primary" />
                    <span>Price: <strong className="text-foreground">₹{product.price}</strong></span>
                    <span className="line-through">₹{product.suggestedPrice}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4 text-primary" />
                    <span>Quantity: {product.quantity}</span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <button
                onClick={() => onBuyNow(product)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <ShoppingCart className="h-5 w-5" />
                Buy Now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ProductDetailModal;
