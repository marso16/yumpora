import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Globe, Package } from "lucide-react";
import api from "../lib/axios";
import ProductCard from "../components/ProductCard";
import { useWindowSize } from "../hooks/useWindowSize";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useWindowSize();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get(
          "/rest/v1/products?is_featured=eq.true&is_available=eq.true&limit=4",
        ),
        api.get("/rest/v1/categories?limit=6"),
      ]);
      setFeaturedProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const categoryEmojis = {
    chocolate: "🍫",
    "chips-crisps": "🍟",
    "candy-gummies": "🍬",
    "cookies-biscuits": "🍪",
    drinks: "🧃",
    "mixed-snacks": "🎁",
  };

  const featuredCols = isMobile
    ? "repeat(2, 1fr)"
    : isTablet
      ? "repeat(2, 1fr)"
      : "repeat(4, 1fr)";
  const categoryCols = isMobile
    ? "repeat(3, 1fr)"
    : isTablet
      ? "repeat(3, 1fr)"
      : "repeat(6, 1fr)";

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, #FFF3E0, #FFFDE7, #FFF0F5)",
          padding: isMobile ? "2.5rem 1rem" : "5rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: isMobile ? "2rem" : "2.5rem",
          }}
        >
          {/* Text */}
          <div style={{ flex: 1, textAlign: isMobile ? "center" : "left" }}>
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#FFB800",
                color: "#2C1810",
                fontSize: "0.85rem",
                fontWeight: 800,
                padding: "6px 16px",
                borderRadius: "50px",
                marginBottom: "1rem",
              }}
            >
              🌍 Snacks from 30+ Countries
            </span>
            <h1
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: isMobile ? "3rem" : "5rem",
                color: "#2C1810",
                lineHeight: 1.1,
                marginBottom: "1rem",
              }}
            >
              Snacks From
              <span style={{ color: "#FF6B35" }}> Around</span>
              <br />
              the World
            </h1>
            <p
              style={{
                color: "#9E9E9E",
                fontSize: isMobile ? "0.95rem" : "1.1rem",
                marginBottom: "1.75rem",
                maxWidth: "420px",
                margin: isMobile ? "0 auto 1.75rem" : "0 0 1.75rem",
              }}
            >
              Discover exotic chocolates, chips, candies and more — delivered
              straight to your door.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "0.75rem",
                justifyContent: isMobile ? "center" : "flex-start",
                alignItems: isMobile ? "stretch" : "center",
              }}
            >
              <Link
                to="/shop"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  backgroundColor: "#FF6B35",
                  color: "#fff",
                  padding: "14px 28px",
                  borderRadius: "16px",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  textDecoration: "none",
                }}
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/shop"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  border: "2px solid #FF6B35",
                  color: "#FF6B35",
                  padding: "14px 28px",
                  borderRadius: "16px",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                }}
              >
                Browse Categories
              </Link>
            </div>
          </div>

          {/* Hero visual — hide on very small screens */}
          {!isMobile && (
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1rem",
                  maxWidth: "280px",
                }}
              >
                {["🍫", "🍟", "🍬", "🍪"].map((emoji, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#fff",
                      width: "120px",
                      height: "120px",
                      borderRadius: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3.5rem",
                      border: "1px solid #FFE0B2",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      transform: i % 2 === 0 ? "rotate(-3deg)" : "rotate(3deg)",
                    }}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PERKS */}
      <section
        style={{
          backgroundColor: "#FF6B35",
          padding: isMobile ? "1.5rem 1rem" : "2.5rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(3, 1fr)",
            gap: isMobile ? "1rem" : "2rem",
            color: "#fff",
            textAlign: "center",
          }}
        >
          {[
            {
              icon: <Globe size={isMobile ? 22 : 28} />,
              title: "30+ Countries",
              desc: "Sourced globally",
            },
            {
              icon: <Zap size={isMobile ? 22 : 28} />,
              title: "Fast Delivery",
              desc: "To your door",
            },
            {
              icon: <Package size={isMobile ? 22 : 28} />,
              title: "Cash on Delivery",
              desc: "Pay on receipt",
            },
          ].map((perk, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {perk.icon}
              <p
                style={{
                  fontWeight: 800,
                  fontSize: isMobile ? "0.82rem" : "1rem",
                }}
              >
                {perk.title}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: isMobile ? "0.72rem" : "0.85rem",
                }}
              >
                {perk.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: isMobile ? "2rem 1rem" : "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <h2
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: isMobile ? "1.75rem" : "2.5rem",
                color: "#2C1810",
              }}
            >
              Shop by Category
            </h2>
            <Link
              to="/shop"
              style={{
                color: "#FF6B35",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: categoryCols,
              gap: "0.75rem",
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                style={{
                  backgroundColor: "#fff",
                  border: "1.5px solid #FFE0B2",
                  borderRadius: "16px",
                  padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: isMobile ? "1.75rem" : "2.5rem" }}>
                  {categoryEmojis[cat.slug] || "🍿"}
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: isMobile ? "0.7rem" : "0.85rem",
                    textAlign: "center",
                    color: "#2C1810",
                  }}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section
        style={{
          backgroundColor: "#FFF3E0",
          padding: isMobile ? "2rem 1rem" : "4rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <h2
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: isMobile ? "1.75rem" : "2.5rem",
                color: "#2C1810",
              }}
            >
              Featured Snacks
            </h2>
            <Link
              to="/shop"
              style={{
                color: "#FF6B35",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: featuredCols,
                gap: "1rem",
              }}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    height: "260px",
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: featuredCols,
                gap: "1rem",
              }}
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: "#2C1810",
          color: "#fff",
          padding: isMobile ? "1.5rem 1rem" : "2.5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Boogaloo, cursive",
            fontSize: "1.75rem",
            marginBottom: "0.5rem",
          }}
        >
          Yum<span style={{ color: "#FFB800" }}>pora</span>
        </p>
        <p style={{ color: "#9E9E9E", fontSize: "0.85rem" }}>
          © 2026 Yumpora. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
