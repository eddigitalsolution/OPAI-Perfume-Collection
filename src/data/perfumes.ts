import { BottleConfig } from "@/components/PerfumeBottle";

export const PERFUMES: BottleConfig[] = [
  {
    id: "summer-rock",
    name: "SUMMER ROCK",
    category: "Fruity • Floral • Unisex",
    price: "RM89",
    rating: 4.8,
    description: "Summer Rock is a vibrant and refreshing unisex perfume that captures the spirit of summer with its fruity and floral blend. Designed for those who crave energy, confidence, and sunshine in a bottle, it opens with a juicy burst of pineapple, berries, and apple, balanced with warm cardamom and a hint of coriander.",
    notes: {
      top: ["Pineapple", "Berries", "Apple"],
      middle: ["Cardamom", "Coriander", "Jasmine"],
      base: ["Amber", "Cedarwood", "Musk"]
    },
    liquidColor: "#e5a93b", // Amber sunset gold
    shape: "oval",
    capMaterial: "gold",
    labelBg: "#ffffff",
    labelTextColor: "#1a1a1a",
    borderColor: "#e5a93b"
  },
  {
    id: "man-in-the-mirror",
    name: "MAN IN THE MIRROR",
    category: "Elegant • Spicy • Woody",
    price: "RM89",
    rating: 4.9,
    description: "A sophisticated fragrance crafted for the man who dares to reflect deeply and lead boldly. Designed as an Extrait De Parfum, it delivers a strong yet smooth scent trail that evolves with elegance.",
    notes: {
      top: ["Bergamot", "Grapefruit", "Sichuan Pepper"],
      middle: ["Sandalwood", "Patchouli", "Vetiver"],
      base: ["Ambergris", "Vanilla", "Tonka Bean"]
    },
    liquidColor: "#b4c3d6", // Cool silver-blue
    shape: "rect",
    capMaterial: "marble",
    labelBg: "#121212",
    labelTextColor: "#ffffff",
    borderColor: "#dcdcdc"
  },
  {
    id: "rush-hour",
    name: "RUSH HOUR",
    category: "Bold • Seductive • Intense",
    price: "RM89",
    rating: 4.9,
    description: "A bold and seductive fragrance designed for those who move with purpose and leave an unforgettable trail. Crafted as an Extrait De Parfum, Rush Hour offers intense longevity and deep character, perfect for evenings, events, and power moves.",
    notes: {
      top: ["Pink Pepper", "Cinnamon", "Saffron"],
      middle: ["Tobacco", "Leather", "Honey"],
      base: ["Oud", "Amber", "Cedarwood"]
    },
    liquidColor: "#631818", // Crimson burgundy
    shape: "cylinder",
    capMaterial: "gold",
    labelBg: "#1a1a1a",
    labelTextColor: "#d4af37",
    borderColor: "#d4af37"
  }
];

export type { BottleConfig };
