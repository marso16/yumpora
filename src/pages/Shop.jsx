import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, SlidersHorizontal } from "lucide-react";
import api from "../lib/axios";
import ProductCard from "../components/ProductCard";
import { useWindowSize } from "../hooks/useWindowSize";

export default function Shop() {
  const { isMobile, isTablet } = useWindowSize();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [sortBy, setSortBy] = useState("newest");
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  async function fetchCategories() {
    try {
      const res = await api.get("/rest/v1/categories");
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      let url = "/rest/v1/products?is_available=eq.true";
      if (selectedCategory !== "all") {
        const catRes = await api.get(
          `/rest/v1/categories?slug=eq.${selectedCategory}&limit=1`,
        );
        if (catRes.data && catRes.data.length > 0) {
          url += `&category_id=eq.${catRes.data[0].id}`;
        }
      }
      if (sortBy === "price-asc") url += "&order=price.asc";
      else if (sortBy === "price-desc") url += "&order=price.desc";
      else url += "&order=created_at.desc";
      const res = await api.get(url);
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin_country?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categoryEmojis = {
    chocolate: "🍫",
    "chips-crisps": "🍟",
    "candy-gummies": "🍬",
    "cookies-biscuits": "🍪",
    drinks: "🧃",
    "mixed-snacks": "🎁",
  };

  function handleCategoryChange(slug) {
    setSelectedCategory(slug);
    setSearchParams(slug !== "all" ? { category: slug } : {});
    if (isMobile) setShowCategories(false);
  }

  const gridCols = isMobile
    ? "1fr"
    : isTablet
      ? "repeat(2, 1fr)"
      : "repeat(3, 1fr)";

  const categoryList = [
    { name: "All Snacks", slug: "all", emoji: "🍿" },
    ...categories.map((c) => ({ ...c, emoji: categoryEmojis[c.slug] || "🍿" })),
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF9F0" }}>
      {/* PAGE HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFF9C4 100%)",
          padding: isMobile ? "1.5rem 1rem" : "2.5rem 1.5rem 2rem",
          borderBottom: "2px solid #FFE0B2",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: isMobile ? "2.5rem" : "3.5rem",
              color: "#2C1810",
              marginBottom: "0.25rem",
            }}
          >
            All Snacks 🍿
          </h1>
          <p style={{ color: "#9E9E9E", fontWeight: 600, fontSize: "0.9rem" }}>
            Exotic treats from around the world
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "1rem" : "2rem 1.5rem",
        }}
      >
        {/* SEARCH + SORT BAR */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
            <Search
              size={17}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#BDBDBD",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search snacks, countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "38px",
                paddingRight: "36px",
                paddingTop: "10px",
                paddingBottom: "10px",
                border: "2px solid #FFE0B2",
                borderRadius: "12px",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.9rem",
                outline: "none",
                backgroundColor: "white",
                boxSizing: "border-box",
                color: "#2C1810",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#BDBDBD",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "10px 12px",
              border: "2px solid #FFE0B2",
              borderRadius: "12px",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              color: "#2C1810",
              backgroundColor: "white",
              cursor: "pointer",
              outline: "none",
              fontSize: "0.85rem",
            }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>

          {/* Mobile filter button */}
          {isMobile && (
            <button
              onClick={() => setShowCategories((s) => !s)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 14px",
                border: "2px solid #FFE0B2",
                borderRadius: "12px",
                backgroundColor: showCategories ? "#FFF3E0" : "white",
                color: showCategories ? "#FF6B35" : "#2C1810",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>
          )}
        </div>

        {/* Mobile categories dropdown */}
        {isMobile && showCategories && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1.5px solid #FFE0B2",
              padding: "1rem",
              marginBottom: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "6px",
            }}
          >
            {categoryList.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                style={{
                  padding: "8px 10px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  textAlign: "left",
                  backgroundColor:
                    selectedCategory === cat.slug ? "#FF6B35" : "#F5F5F5",
                  color: selectedCategory === cat.slug ? "white" : "#757575",
                  transition: "all 0.15s",
                }}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* MAIN LAYOUT */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "flex-start",
          }}
        >
          {/* SIDEBAR — desktop only */}
          {!isMobile && (
            <aside
              style={{
                width: "200px",
                flexShrink: 0,
                backgroundColor: "white",
                borderRadius: "16px",
                border: "1.5px solid #FFE0B2",
                padding: "1rem",
                position: "sticky",
                top: "90px",
                alignSelf: "flex-start",
              }}
            >
              <p
                style={{
                  fontWeight: 800,
                  color: "#2C1810",
                  marginBottom: "0.75rem",
                  fontSize: "0.95rem",
                }}
              >
                Categories
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                {categoryList.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      transition: "all 0.15s",
                      backgroundColor:
                        selectedCategory === cat.slug
                          ? "#FF6B35"
                          : "transparent",
                      color:
                        selectedCategory === cat.slug ? "white" : "#757575",
                    }}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
            </aside>
          )}

          {/* PRODUCT GRID */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#BDBDBD",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              {loading
                ? "Loading..."
                : `${filteredProducts.length} products found`}
            </p>

            {loading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: gridCols,
                  gap: "1rem",
                }}
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      height: "260px",
                      opacity: 0.5,
                      border: "1.5px solid #FFE0B2",
                    }}
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>😢</p>
                <p
                  style={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: "#2C1810",
                    marginBottom: "0.5rem",
                  }}
                >
                  No snacks found
                </p>
                <p
                  style={{
                    color: "#BDBDBD",
                    marginBottom: "1rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Try a different search or category
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    handleCategoryChange("all");
                  }}
                  style={{
                    backgroundColor: "#FF6B35",
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: "12px",
                    border: "none",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: gridCols,
                  gap: "1rem",
                }}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
