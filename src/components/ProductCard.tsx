import { motion } from "framer-motion";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  index: number;
}

const ProductCard = ({ product, onClick, index }: ProductCardProps) => (
  <motion.button
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.07 }}
    whileHover={{ y: -6, scale: 1.02 }}
    className="group w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-card text-left shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
    onClick={() => onClick(product)}
  >
    <div className="aspect-square overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        width={512}
        height={512}
      />
    </div>
    <div className="p-4">
      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        {product.category}
      </span>
      <h3 className="mt-2 font-semibold text-foreground">{product.name}</h3>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-bold text-primary">₹{product.price}</span>
        <span className="text-sm text-muted-foreground line-through">₹{product.suggestedPrice}</span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">Qty: {product.quantity}</p>
    </div>
  </motion.button>
);

export default ProductCard;
