import turmericImg from "@/assets/product-turmeric.jpg";
import textileImg from "@/assets/product-textile.jpg";
import potteryImg from "@/assets/product-pottery.jpg";
import honeyImg from "@/assets/product-honey.jpg";
import basketImg from "@/assets/product-basket.jpg";
import jaggeryImg from "@/assets/product-jaggery.jpg";
import oilImg from "@/assets/product-oil.jpg";

export interface Product {
  id: number;
  name: string;
  price: number;
  suggestedPrice: number;
  quantity: string;
  description: string;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Organic Turmeric Powder",
    price: 120,
    suggestedPrice: 150,
    quantity: "500g",
    description:
      "Pure and natural turmeric powder sourced directly from farms in rural Maharashtra. Rich in curcumin, this hand-ground haldi adds vibrant color and authentic flavor to your dishes. No chemicals, no preservatives — just pure goodness from the earth.",
    image: turmericImg,
    category: "Spices",
  },
  {
    id: 2,
    name: "Handwoven Cotton Textile",
    price: 850,
    suggestedPrice: 1100,
    quantity: "1 piece (2.5m)",
    description:
      "Beautifully handwoven cotton fabric crafted by skilled artisans from Odisha. Each piece is unique with vibrant traditional patterns. Perfect for sarees, kurtas, or home décor. Supporting generations of weaving heritage.",
    image: textileImg,
    category: "Textiles",
  },
  {
    id: 3,
    name: "Terracotta Chai Set",
    price: 450,
    suggestedPrice: 600,
    quantity: "1 set (6 cups + 1 pot)",
    description:
      "Handcrafted terracotta chai set made by potters in Khurja. The earthen cups give your tea a distinctive earthy flavor. Eco-friendly, biodegradable, and beautifully rustic. A perfect blend of tradition and sustainability.",
    image: potteryImg,
    category: "Handicrafts",
  },
  {
    id: 4,
    name: "Wild Forest Honey",
    price: 350,
    suggestedPrice: 450,
    quantity: "500ml",
    description:
      "Raw, unprocessed honey harvested from wild bee colonies in the forests of Chhattisgarh. Rich in natural enzymes and antioxidants. No heating, no blending — just pure wild honey with a complex, floral flavor profile.",
    image: honeyImg,
    category: "Food",
  },
  {
    id: 5,
    name: "Bamboo Storage Basket",
    price: 280,
    suggestedPrice: 350,
    quantity: "1 piece (Large)",
    description:
      "Sturdy and elegant bamboo basket handwoven by tribal artisans from Northeast India. Perfect for storage, gifting, or home décor. Each basket is unique and showcases incredible craftsmanship passed down through generations.",
    image: basketImg,
    category: "Handicrafts",
  },
  {
    id: 6,
    name: "Organic Jaggery Blocks",
    price: 180,
    suggestedPrice: 220,
    quantity: "1kg",
    description:
      "Traditional gur made from freshly pressed sugarcane in Kolhapur. Slow-cooked in iron kadhai, this jaggery retains all its natural minerals and has a rich, caramel-like taste. A healthier alternative to refined sugar.",
    image: jaggeryImg,
    category: "Food",
  },
  {
    id: 7,
    name: "Cold-Pressed Mustard Oil",
    price: 220,
    suggestedPrice: 280,
    quantity: "1 litre",
    description:
      "Premium cold-pressed mustard oil from Rajasthan. Extracted using traditional wooden ghani method, preserving all nutrients and the characteristic pungent aroma. Ideal for cooking, pickling, and hair care.",
    image: oilImg,
    category: "Food",
  },
];
