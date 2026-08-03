"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, Star } from "lucide-react";
import { BottleConfig } from "@/data/perfumes";

interface ProductFocusPanelProps {
  perfume: BottleConfig;
  onClose: () => void;
  onAddToCart: (perfume: BottleConfig, size: string, qty: number, finalPrice: string) => void;
}

export default function ProductFocusPanel({
  perfume,
  onClose,
  onAddToCart,
}: ProductFocusPanelProps) {
  const [selectedSize, setSelectedSize] = useState<"30ml" | "50ml" | "100ml">("100ml");
  const [quantity, setQuantity] = useState(1);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);



  useEffect(() => {
    if (isMobileExpanded) {
      document.body.classList.add("mobile-panel-expanded");
    } else {
      document.body.classList.remove("mobile-panel-expanded");
    }
    return () => {
      document.body.classList.remove("mobile-panel-expanded");
    };
  }, [isMobileExpanded]);

  // Framer Motion variants
  const panelVariants: Variants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className={`glass-panel ${isMobileExpanded ? "expanded" : ""}`}
      variants={panelVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Mobile Expand/Collapse Indicator Handle */}
      <div 
        className="mobile-expand-handle"
        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
      >
        <span className="expand-icon">{isMobileExpanded ? "▼" : "▲"}</span>
      </div>

      <button className="close-btn mobile-hide-on-collapse" onClick={onClose} aria-label="Close Product Focus">
        <X size={20} />
      </button>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Category Header */}
        <motion.p className="hero-subtitle mobile-hide-on-collapse" variants={itemVariants}>
          {perfume.category}
        </motion.p>

        {/* Perfume Name */}
        <motion.h2 className="panel-name" variants={itemVariants}>
          {perfume.name}
        </motion.h2>

        {/* Rating & Price */}
        <motion.div className="panel-meta" variants={itemVariants}>
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedSize}
              className="panel-price"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {perfume.price}
            </motion.span>
          </AnimatePresence>

          <div className="panel-rating">
            <span className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.floor(perfume.rating) ? "var(--gold-color)" : "none"}
                  stroke="var(--gold-color)"
                  style={{ display: "inline-block", marginRight: "1px" }}
                />
              ))}
            </span>
            <span className="rating-val">{perfume.rating}</span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p className="panel-desc mobile-hide-on-collapse" variants={itemVariants}>
          {perfume.description}
        </motion.p>

        {/* Notes Pyramid Grid */}
        <motion.div className="fragrance-notes-panel mobile-hide-on-collapse" variants={itemVariants}>
          <h4>Fragrance Notes</h4>
          <div className="notes-grid">
            <div className="note-card">
              <div className="note-label">Top Notes</div>
              <div className="note-value">{perfume.notes.top[0]}</div>
            </div>
            <div className="note-card">
              <div className="note-label">Middle Notes</div>
              <div className="note-value">{perfume.notes.middle[0]}</div>
            </div>
            <div className="note-card">
              <div className="note-label">Base Notes</div>
              <div className="note-value">{perfume.notes.base[0]}</div>
            </div>
          </div>
        </motion.div>

        {/* Actions Group */}
        <motion.div className="cta-group mobile-hide-on-collapse" variants={itemVariants} style={{ marginTop: "2rem" }}>
          <a
            href="https://www.opaifragrance.com/?ref=yazim&s=simulator2"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-buy-now"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              width: "100%",
              textAlign: "center",
              height: "48px"
            }}
          >
            Buy Now
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
