import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import CheckoutModal from "@/components/CheckoutModal";
import type { Product } from "@/data/products";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop";

const parsePrice = (priceStr: string | number | undefined): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  const match = String(priceStr).match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("https://vyapar-vaani.onrender.com/products")
      .then((res) => res.json())
      .then((data) => {
        // Flatten backend shape: each doc has an `items` array
        const flattened: Product[] = [];
        let idCounter = 1;

        (Array.isArray(data) ? data : []).forEach((doc: any) => {
          (doc.items || []).forEach((item: any) => {
            const suggested = parsePrice(item.suggestedPrice);
            flattened.push({
              id: idCounter++,
              name: item.name
                ? item.name.charAt(0).toUpperCase() + item.name.slice(1)
                : "Unknown",
              price: suggested ? Math.max(1, Math.round(suggested * 0.9)) : 100,
              suggestedPrice: suggested || 100,
              quantity: item.quantity || "1 unit",
              description:
                `Fresh ${item.name || "product"} sourced directly from rural artisans and farmers. ` +
                `Quantity: ${item.quantity || "1 unit"}.`,
              image: item.imageUrl || FALLBACK_IMAGE,
              category: "General",
            });
          });
        });

        setProducts(flattened);
      })
      .catch((err) => console.error(err));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory, products]);

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(null);
    setTimeout(() => setCheckoutProduct(product), 200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearch} />
      <HeroBanner />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={setSelectedProduct}
              index={i}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">
            No products found. Try a different search.
          </p>
        )}
      </main>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
      />

      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={() => setCheckoutProduct(null)}
        />
      )}

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Vyapar Vaani — Empowering Rural Commerce</p>
      </footer>
    </div>
  );
};

export default Index;
