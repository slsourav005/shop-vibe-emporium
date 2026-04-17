import turmericImg from "@/assets/product-turmeric.jpg";
import honeyImg from "@/assets/product-honey.jpg";
import jaggeryImg from "@/assets/product-jaggery.jpg";
import oilImg from "@/assets/product-oil.jpg";
import potteryImg from "@/assets/product-pottery.jpg";
import textileImg from "@/assets/product-textile.jpg";
import basketImg from "@/assets/product-basket.jpg";

export interface Product {
  id: number;
  backendId?: string;
  name: string;
  price: number;
  suggestedPrice: number;
  quantity: string;
  description: string;
  image: string;
  category: string;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Organic Turmeric Powder",
    price: 180,
    suggestedPrice: 240,
    quantity: "500 g",
    description:
      "Hand-ground turmeric from Karnataka farms. Rich in curcumin, sun-dried, and 100% pure with no additives.",
    image: turmericImg,
    category: "Spices",
  },
  {
    id: 2,
    name: "Wild Forest Honey",
    price: 350,
    suggestedPrice: 450,
    quantity: "500 ml",
    description:
      "Raw, unfiltered honey collected from the forests of the Western Ghats. Pure sweetness with floral notes.",
    image: honeyImg,
    category: "Natural Foods",
  },
  {
    id: 3,
    name: "Traditional Jaggery Blocks",
    price: 120,
    suggestedPrice: 160,
    quantity: "1 kg",
    description:
      "Chemical-free jaggery made by village artisans using traditional sugarcane boiling methods.",
    image: jaggeryImg,
    category: "Natural Foods",
  },
  {
    id: 4,
    name: "Cold-Pressed Mustard Oil",
    price: 280,
    suggestedPrice: 340,
    quantity: "1 L",
    description:
      "Pungent, aromatic mustard oil cold-pressed in wooden ghani mills. Perfect for cooking and pickling.",
    image: oilImg,
    category: "Natural Foods",
  },
  {
    id: 5,
    name: "Handmade Clay Pottery",
    price: 450,
    suggestedPrice: 600,
    quantity: "1 piece",
    description:
      "Hand-thrown earthen pot crafted by skilled village potters. Keeps water naturally cool.",
    image: potteryImg,
    category: "Handicrafts",
  },
  {
    id: 6,
    name: "Handwoven Cotton Textile",
    price: 850,
    suggestedPrice: 1100,
    quantity: "2.5 m",
    description:
      "Soft, breathable cotton fabric handwoven by rural weavers. Natural dyes, traditional patterns.",
    image: textileImg,
    category: "Handicrafts",
  },
  {
    id: 7,
    name: "Bamboo Storage Basket",
    price: 320,
    suggestedPrice: 420,
    quantity: "1 piece",
    description:
      "Eco-friendly bamboo basket woven by tribal artisans of the Northeast. Sturdy and beautiful.",
    image: basketImg,
    category: "Handicrafts",
  },
];
