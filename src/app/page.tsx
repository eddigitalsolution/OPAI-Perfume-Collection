"use client";

import { useState, useEffect, useRef } from "react";
import { PERFUMES } from "@/data/perfumes";
import dynamic from "next/dynamic";

const ThreeScene = dynamic(() => import("@/components/ThreeScene"), { ssr: false });
const ProductFocusPanel = dynamic(() => import("@/components/ProductFocusPanel"), { ssr: false });

interface CartItem {
  id: string;
  name: string;
  size: string;
  qty: number;
  price: string;
}

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="loading-screen">
      <div className="loading-logo">
        OPAI <span>Perfume Collection</span>
      </div>
      <div className="loading-bar-wrap">
        <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
        <div className="loading-bar-shimmer" />
      </div>
      <p className="loading-text">Loading Collection&hellip;</p>
    </div>
  );
}

export default function Home() {
  const [activeBottleId, setActiveBottleId] = useState<string | null>(null);
  const [hoveredBottleId, setHoveredBottleId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });
  const [activeTheme, setActiveTheme] = useState<"raining" | "beach" | "city">("beach");

  useEffect(() => {
    document.body.classList.remove("theme-raining", "theme-beach", "theme-city");
    document.body.classList.add(`theme-${activeTheme}`);
  }, [activeTheme]);

  useEffect(() => {
    setMounted(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 18 + 4;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => setSceneReady(true), 400);
      }
      setLoadProgress(Math.min(prog, 100));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const activePerfume = PERFUMES.find((p) => p.id === activeBottleId);
  const hoveredPerfume = PERFUMES.find((p) => p.id === hoveredBottleId);

  const totalCartCount = cart.reduce((total, item) => total + item.qty, 0);

  const handleAddToCart = (perfume: typeof PERFUMES[0], size: string, qty: number, finalPrice: string) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === perfume.id && i.size === size);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].qty += qty;
        return updated;
      }
      return [...prev, { id: perfume.id, name: perfume.name, size, qty, price: finalPrice }];
    });
    setToast({ visible: true, message: `Added ${qty}x ${perfume.name} (${size}) to collection.` });
  };

  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  const handlePrevBottle = () => {
    if (!activeBottleId) return;
    const idx = PERFUMES.findIndex((p) => p.id === activeBottleId);
    setActiveBottleId(PERFUMES[(idx - 1 + PERFUMES.length) % PERFUMES.length].id);
  };

  const handleNextBottle = () => {
    if (!activeBottleId) return;
    const idx = PERFUMES.findIndex((p) => p.id === activeBottleId);
    setActiveBottleId(PERFUMES[(idx + 1) % PERFUMES.length].id);
  };

  // Touch Swipe Gesture Detection for Mobile Navigation
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // min distance in pixels

    if (diffX > swipeThreshold) {
      // Swiped left -> Next product
      handleNextBottle();
    } else if (diffX < -swipeThreshold) {
      // Swiped right -> Previous product
      handlePrevBottle();
    }

    // Reset
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!mounted || !sceneReady) return <LoadingScreen progress={loadProgress} />;

  return (
    <main style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <div className="ambient-glow" />

      {/* Header */}
      <header>
        <a href="#" className="logo" onClick={() => setActiveBottleId(null)}>
          OPAI <span>Perfume Collection</span>
        </a>
        <div className="theme-switcher">
          <button 
            className={`theme-btn raining ${activeTheme === "raining" ? "active" : ""}`}
            onClick={() => setActiveTheme("raining")}
            aria-label="Raining Day Theme"
          />
          <button 
            className={`theme-btn beach ${activeTheme === "beach" ? "active" : ""}`}
            onClick={() => setActiveTheme("beach")}
            aria-label="Sunshine Beach Theme"
          />
          <button 
            className={`theme-btn city ${activeTheme === "city" ? "active" : ""}`}
            onClick={() => setActiveTheme("city")}
            aria-label="Midnight Busy City Theme"
          />
        </div>
      </header>

      {/* 3D Scene — full screen */}
      <ThreeScene
        activeBottleId={activeBottleId}
        hoveredBottleId={hoveredBottleId}
        onHoverBottle={setHoveredBottleId}
        onClickBottle={setActiveBottleId}
        theme={activeTheme}
      />

      {/* Overlay UI */}
      <div className="overlay-ui">
        {/* Bottle name hint on hover */}
        {hoveredPerfume && !activeBottleId && (
          <div className="hover-info-overlay">
            <h3>{hoveredPerfume.name}</h3>
            <p>{hoveredPerfume.category}</p>
          </div>
        )}

        {/* Focus mode panel */}
        <div className={`focus-mode-container ${activeBottleId ? "active" : ""}`}>
          <div 
            className="focus-left-spacer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {activeBottleId && (
              <>
                <button className="slide-nav-btn prev" onClick={handlePrevBottle} aria-label="Previous">&#8592;</button>
                <div className="drag-hint">DRAG TO ROTATE • SCROLL TO ZOOM</div>
                <button className="slide-nav-btn next" onClick={handleNextBottle} aria-label="Next">&#8594;</button>
              </>
            )}
          </div>
          <div 
            className="focus-right-panel"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {activePerfume && (
              <ProductFocusPanel
                key={activePerfume.id}
                perfume={activePerfume}
                onClose={() => setActiveBottleId(null)}
                onAddToCart={handleAddToCart}
              />
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.visible && (
        <div className="toast-notification">
          <div className="toast-message">
            <span>Maison Notification:</span> {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}
