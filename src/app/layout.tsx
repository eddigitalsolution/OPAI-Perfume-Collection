import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OPAI Perfume Collection | Immersive 3D Luxury Fragrances",
  description: "Experience the ultimate collection of OPAI luxury scents. Procedural 3D perfume bottles in a cinematic atmosphere. Crafting unforgettable fragrance experiences.",
  keywords: "perfume, luxury perfume, fragrance, 3d perfume, oud royal, rose noire, tom ford, creed, dior, opai",
  authors: [{ name: "OPAI Perfume Collection" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
