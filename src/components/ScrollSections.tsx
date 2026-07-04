"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Clock, ShieldCheck, Truck, ArrowRight, Star } from "lucide-react";
import { BottleConfig } from "@/data/perfumes";

interface ScrollSectionsProps {
  perfumes: BottleConfig[];
  onSelectPerfume: (id: string) => void;
}

export default function ScrollSections({ perfumes, onSelectPerfume }: ScrollSectionsProps) {
  // Section 2: Fragrance Journey Pyramid State
  const [activePyramidLevel, setActivePyramidLevel] = useState<"top" | "middle" | "base">("top");

  const pyramidDetails = {
    top: {
      name: "Top Notes (Head)",
      time: "First 15 Minutes",
      desc: "The initial olfactory impression. Composed of light, volatile molecules that evaporate quickly, providing a burst of freshness and setting the emotional stage of the fragrance.",
      tags: ["Pineapple", "Berries", "Apple", "Bergamot", "Grapefruit", "Sichuan Pepper", "Pink Pepper", "Cinnamon"],
    },
    middle: {
      name: "Heart Notes (Heart)",
      time: "2 to 4 Hours",
      desc: "The true character and core personality of the perfume. Fades in as the top notes dissipate, creating a smooth, harmonious bridge to the heavier base notes.",
      tags: ["Cardamom", "Coriander", "Jasmine", "Sandalwood", "Patchouli", "Vetiver", "Tobacco", "Leather", "Honey"],
    },
    base: {
      name: "Base Notes (Drydown)",
      time: "Up to 24 Hours",
      desc: "The anchor of the fragrance. Heavy, rich, and slow-evaporating molecules that linger for hours, creating a rich, deep residual sillage on skin and fabrics.",
      tags: ["Amber", "Cedarwood", "Musk", "Ambergris", "Vanilla", "Tonka Bean", "Oud"],
    },
  };

  const currentPyramid = pyramidDetails[activePyramidLevel];

  // Framer motion variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 },
    }),
  };

  return (
    <div className="scroll-sections-wrapper">
      {/* SECTION 1: Signature Collection */}
      <section className="scroll-section" id="collection">
        <div className="section-hdr">
          <p className="section-subtitle">Curated Masterpieces</p>
          <h2 className="section-title">The Signature Collection</h2>
        </div>

        <div className="collection-grid">
          {perfumes.map((perfume, idx) => (
            <motion.div
              key={perfume.id}
              className="collection-card"
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={idx % 3}
            >
              <div className="card-num">Collection No. 0{idx + 1}</div>
              <h3 className="card-title">{perfume.name}</h3>
              <p className="card-category">{perfume.category}</p>
              <p className="card-desc">{perfume.description}</p>
              <div className="card-price-action">
                <span className="card-price">{perfume.price}</span>
                <button
                  className="card-action"
                  onClick={() => {
                    // Scroll to top where the 3D scene is, and select the perfume
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setTimeout(() => {
                      onSelectPerfume(perfume.id);
                    }, 500);
                  }}
                >
                  Experience <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Fragrance Journey (Interactive Note Pyramid) */}
      <section className="scroll-section" id="journey">
        <div className="section-hdr">
          <p className="section-subtitle">Olfactory Architecture</p>
          <h2 className="section-title">The Fragrance Journey</h2>
        </div>

        <div className="pyramid-container">
          <div className="pyramid-graphic">
            {/* Top Notes Level */}
            <div
              className={`pyramid-level ${activePyramidLevel === "top" ? "active" : ""}`}
              onClick={() => setActivePyramidLevel("top")}
            >
              <div className="pyramid-level-info">
                <div className="level-name">Top Notes</div>
                <div className="level-desc">Fresh, citrus, volatile elements</div>
              </div>
              <div className="level-time">15 Mins</div>
            </div>

            {/* Middle Notes Level */}
            <div
              className={`pyramid-level ${activePyramidLevel === "middle" ? "active" : ""}`}
              onClick={() => setActivePyramidLevel("middle")}
            >
              <div className="pyramid-level-info">
                <div className="level-name">Heart Notes</div>
                <div className="level-desc">Floral, spicy, core characters</div>
              </div>
              <div className="level-time">2-4 Hours</div>
            </div>

            {/* Base Notes Level */}
            <div
              className={`pyramid-level ${activePyramidLevel === "base" ? "active" : ""}`}
              onClick={() => setActivePyramidLevel("base")}
            >
              <div className="pyramid-level-info">
                <div className="level-name">Base Notes</div>
                <div className="level-desc">Oud, musk, grounding woods</div>
              </div>
              <div className="level-time">24 Hours</div>
            </div>
          </div>

          <div className="pyramid-detail">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePyramidLevel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3>{currentPyramid.name}</h3>
                <p>{currentPyramid.desc}</p>
                <div className="pyramid-notes-list">
                  {currentPyramid.tags.map((tag) => (
                    <span key={tag} className="pyramid-note-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION 3: Why Choose Us */}
      <section className="scroll-section" id="about">
        <div className="section-hdr">
          <p className="section-subtitle">Excellence In Every Drop</p>
          <h2 className="section-title">The Art Of Craftsmanship</h2>
        </div>

        <div className="features-grid">
          <motion.div
            className="feature-card"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <div className="feature-icon-wrapper">
              <Droplets size={36} strokeWidth={1} />
            </div>
            <h3 className="feature-title">Premium Oils</h3>
            <p className="feature-desc">
              Sourced from Grasse, France. We extract the finest absolute concentrates for uncompromised luxury.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <div className="feature-icon-wrapper">
              <Clock size={36} strokeWidth={1} />
            </div>
            <h3 className="feature-title">24H Longevity</h3>
            <p className="feature-desc">
              High concentration formulation (Extrait de Parfum) guarantees a lingering presence that persists all day.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <div className="feature-icon-wrapper">
              <ShieldCheck size={36} strokeWidth={1} />
            </div>
            <h3 className="feature-title">Artisan Giftwrap</h3>
            <p className="feature-desc">
              Housed in custom luxury thick-walled glass and enclosed in our signature wax-sealed velvet gift box.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
          >
            <div className="feature-icon-wrapper">
              <Truck size={36} strokeWidth={1} />
            </div>
            <h3 className="feature-title">Priority Shipping</h3>
            <p className="feature-desc">
              Nationwide express courier shipping with premium double-cushioned shockproof transit casing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: Customer Reviews */}
      <section className="scroll-section" id="reviews">
        <div className="section-hdr">
          <p className="section-subtitle">Whispers Of Satisfaction</p>
          <h2 className="section-title">Luxury Testimonials</h2>
        </div>

        <div className="reviews-grid">
          <motion.div
            className="review-card"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <div className="review-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="var(--gold-color)" stroke="var(--gold-color)" style={{ display: "inline-block", marginRight: "1px" }} />
              ))}
            </div>
            <p className="review-text">
              &quot;Summer Rock is a total masterpiece. The pineapple and berries smell incredibly fresh, and it gets so many compliments during hot days!&quot;
            </p>
            <div className="review-author-info">
              <span className="author-name">Marcus L.</span>
              <span className="author-parfum">Summer Rock</span>
            </div>
          </motion.div>

          <motion.div
            className="review-card"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <div className="review-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="var(--gold-color)" stroke="var(--gold-color)" style={{ display: "inline-block", marginRight: "1px" }} />
              ))}
            </div>
            <p className="review-text">
              &quot;Man in the Mirror is a sophisticated, bold scent. The transition from bergamot to sandalwood and vanilla is beautifully smooth.&quot;
            </p>
            <div className="review-author-info">
              <span className="author-name">Sophia R.</span>
              <span className="author-parfum">Man in the Mirror</span>
            </div>
          </motion.div>

          <motion.div
            className="review-card"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <div className="review-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="var(--gold-color)" stroke="var(--gold-color)" style={{ display: "inline-block", marginRight: "1px" }} />
              ))}
            </div>
            <p className="review-text">
              &quot;Rush Hour is seductive and intense. The cinnamon and tobacco notes are warm and perfect for formal evenings. Outstanding longevity!&quot;
            </p>
            <div className="review-author-info">
              <span className="author-name">Julian K.</span>
              <span className="author-parfum">Rush Hour</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: Final Call To Action */}
      <section className="scroll-section cta-section" id="cta">
        <div className="cta-content">
          <h2 className="cta-title">
            Find Your <span>Signature Scent</span>
          </h2>
          <p className="cta-desc">
            Explore the bounds of niche fragrance craft. Order a signature bottle or acquire the Discovery Set to explore the entire universe.
          </p>
          <button
            className="btn-cta"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Shop Collection
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <h4>PARFUM D&apos;ÉLIXIR</h4>
            <p>
              Crafting premium luxury fragrances for connoisseurs of fine scents since 2021. Designed to leave a lasting trace.
            </p>
          </div>
          <div className="footer-links">
            <h5>Collections</h5>
            <ul>
              <li><a href="#collection">Signature Line</a></li>
              <li><a href="#collection">Oud Exclusives</a></li>
              <li><a href="#collection">Fresh Aromatics</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h5>Heritage</h5>
            <ul>
              <li><a href="#journey">Fragrance Journey</a></li>
              <li><a href="#about">Why Choose Us</a></li>
              <li><a href="#reviews">Our Reviews</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PARFUM D&apos;ÉLIXIR. All rights reserved.</p>
          <div className="social-links">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
