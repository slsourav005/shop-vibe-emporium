import { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import CheckoutModal from "@/components/CheckoutModal";
import FloatingChatButton from "@/components/FloatingChatButton";
import { mockProducts, type Product } from "@/data/products";
import { API_BASE } from "@/lib/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop";

const parsePrice = (priceStr: string | number | undefined): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  const match = String(priceStr).match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

const titleCase = (s: string) =>
  s
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// Filter out junk AI-extracted names like "unknown", "i am selling rice", long sentences
const isValidItemName = (name: string): boolean => {
  if (!name) return false;
  const n = name.toLowerCase().trim();
  if (n === "unknown" || n.length < 2) return false;
  if (n.split(" ").length > 4) return false; // long phrases = bad extraction
  if (/\b(i|am|want|selling|sell|to)\b/.test(n)) return false;
  return true;
};

const Index = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchProducts = useCallback(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => {
        let idCounter = 1000;
        const userListed: Product[] = [];

        // Backend now returns flat product docs:
        // { _id, sellerId, name, quantity, suggestedPrice, status }
        (Array.isArray(data) ? data : []).forEach((doc: any) => {
          if (!isValidItemName(doc.name)) return;

          const suggested = parsePrice(doc.suggestedPrice) || 100;
          const cleanName = titleCase(String(doc.name).trim());

          userListed.push({
            id: idCounter++,
            backendId: doc._id,
            name: cleanName,
            price: Math.max(1, Math.round(suggested * 0.9)),
            suggestedPrice: suggested,
            quantity: doc.quantity || "1 unit",
            description:
              `Freshly listed by a local seller through Vyapar Vaani. ` +
              `${cleanName} available in quantity of ${doc.quantity || "1 unit"}. ` +
              `Sourced directly from rural producers — fair price, no middlemen.`,
            image: FALLBACK_IMAGE,
            category: "Community Listings",
          });
        });

        setProducts([...mockProducts, ...userListed]);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchProducts();
    const t = setInterval(fetchProducts, 5000);
    return () => clearInterval(t);
  }, [fetchProducts]);

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

      <FloatingChatButton onListed={fetchProducts} />
    </div>
  );
};

export default Index;
