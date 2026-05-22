import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart,
  ArrowLeft,
  Globe,
  Package,
  Plus,
  Minus,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import useCartStore from "../store/cartStore";
import WishlistButton from "../components/WishlistButton";
import { useWindowSize } from "../hooks/useWindowSize";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    try {
      const res = await api.get(`/rest/v1/products?id=eq.${id}&limit=1`);
      if (res.data && res.data.length > 0) {
        setProduct(res.data[0]);
        fetchRelated(res.data[0].category_id, res.data[0].id);
      } else {
        navigate("/shop");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      navigate("/shop");
    } finally {
      setLoading(false);
    }
  }

  async function fetchRelated(categoryId, currentId) {
    if (!categoryId) return;
    try {
      const res = await api.get(
        `/rest/v1/products?category_id=eq.${categoryId}&id=neq.${currentId}&is_available=eq.true&limit=3`,
      );
      setRelatedProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching related:", error);
    }
  }

  function handleAddToCart() {
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`, {
      icon: "🛍️",
      style: { fontFamily: "Nunito, sans-serif", fontWeight: "700" },
    });
  }

  const categoryEmojis = {
    chocolate: "🍫",
    "chips-crisps": "🍟",
    "candy-gummies": "🍬",
    "cookies-biscuits": "🍪",
    drinks: "🧃",
    "mixed-snacks": "🎁",
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍿</p>
          <p style={{ fontWeight: 700, color: "#9E9E9E" }}>Loading snack...</p>
        </div>
      </div>
    );

  if (!product) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF9F0" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "1rem" : "2rem 1.5rem",
        }}
      >
        {/* BREADCRUMB */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#FF6B35",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              padding: 0,
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <span style={{ color: "#BDBDBD" }}>•</span>
          <Link
            to="/shop"
            style={{
              color: "#BDBDBD",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Shop
          </Link>
          <span style={{ color: "#BDBDBD" }}>•</span>
          <span
            style={{
              color: "#2C1810",
              fontWeight: 700,
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {product.name}
          </span>
        </div>

        {/* PRODUCT SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "1.5rem" : "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Image */}
          <div
            style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFF9C4)",
              borderRadius: "24px",
              border: "2px solid #FFE0B2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: isMobile ? "260px" : "400px",
              position: "relative",
            }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: "100%",
                  height: isMobile ? "260px" : "400px",
                  objectFit: "cover",
                  borderRadius: "24px",
                }}
              />
            ) : (
              <span style={{ fontSize: isMobile ? "6rem" : "8rem" }}>
                {categoryEmojis[product.slug] || "🍫"}
              </span>
            )}
            {product.is_featured && (
              <span
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  backgroundColor: "#FFB800",
                  color: "#2C1810",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  padding: "6px 14px",
                  borderRadius: "20px",
                }}
              >
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#FFF3E0",
                color: "#FF6B35",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: 700,
                marginBottom: "1rem",
                width: "fit-content",
              }}
            >
              <Globe size={14} />
              {product.origin_country || "Exotic Origin"}
            </div>

            <h1
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: isMobile ? "2.2rem" : "3rem",
                color: "#2C1810",
                lineHeight: 1.1,
                marginBottom: "0.75rem",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                color: "#757575",
                lineHeight: 1.7,
                fontSize: "0.95rem",
                marginBottom: "1.25rem",
              }}
            >
              {product.description}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1.25rem",
              }}
            >
              <Package size={16} style={{ color: "#4CAF50" }} />
              <span
                style={{
                  color: "#4CAF50",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </span>
            </div>

            <div
              style={{
                fontSize: isMobile ? "2rem" : "2.5rem",
                fontWeight: 800,
                color: "#FF6B35",
                marginBottom: "1.25rem",
                fontFamily: "Boogaloo, cursive",
              }}
            >
              ${product.price}
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p
                style={{
                  fontWeight: 700,
                  color: "#2C1810",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Quantity
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "2px solid #FFE0B2",
                    borderRadius: "10px 0 0 10px",
                    backgroundColor: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FF6B35",
                  }}
                >
                  <Minus size={16} />
                </button>
                <div
                  style={{
                    width: "56px",
                    height: "40px",
                    border: "2px solid #FFE0B2",
                    borderLeft: "none",
                    borderRight: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "#2C1810",
                    backgroundColor: "white",
                  }}
                >
                  {quantity}
                </div>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock_quantity, q + 1))
                  }
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "2px solid #FFE0B2",
                    borderRadius: "0 10px 10px 0",
                    backgroundColor: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FF6B35",
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Subtotal */}
            <div
              style={{
                backgroundColor: "#FFF3E0",
                borderRadius: "12px",
                padding: "12px 16px",
                marginBottom: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 700, color: "#9E9E9E" }}>
                Subtotal
              </span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: "#FF6B35",
                }}
              >
                ${(product.price * quantity).toFixed(2)}
              </span>
            </div>

            {/* Add to cart + wishlist */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  backgroundColor:
                    product.stock_quantity > 0 ? "#FF6B35" : "#BDBDBD",
                  color: "white",
                  padding: "14px 24px",
                  borderRadius: "14px",
                  border: "none",
                  cursor:
                    product.stock_quantity > 0 ? "pointer" : "not-allowed",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (product.stock_quantity > 0)
                    e.currentTarget.style.backgroundColor = "#e55a2b";
                }}
                onMouseLeave={(e) => {
                  if (product.stock_quantity > 0)
                    e.currentTarget.style.backgroundColor = "#FF6B35";
                }}
              >
                <ShoppingCart size={20} />
                {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
              <WishlistButton productId={product.id} size={22} />
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                color: "#9E9E9E",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              💵 Cash on Delivery available
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div>
            <h2
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: isMobile ? "1.75rem" : "2.5rem",
                color: "#2C1810",
                marginBottom: "1.25rem",
              }}
            >
              You Might Also Like
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(3, 1fr)",
                gap: "1rem",
              }}
            >
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    border: "1.5px solid #FFE0B2",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(255,107,53,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      height: isMobile ? "100px" : "140px",
                      background: "linear-gradient(135deg, #FFF3E0, #FFF9C4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                    }}
                  >
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "🍫"
                    )}
                  </div>
                  <div style={{ padding: "0.75rem" }}>
                    <p
                      style={{
                        fontWeight: 800,
                        color: "#2C1810",
                        fontSize: "0.85rem",
                        marginBottom: "4px",
                      }}
                    >
                      {p.name}
                    </p>
                    <p style={{ color: "#FF6B35", fontWeight: 800 }}>
                      ${p.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
