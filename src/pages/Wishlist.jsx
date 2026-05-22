import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useWishlistStore from "../store/wishlistStore";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import { useWindowSize } from "../hooks/useWindowSize";

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, loading, fetchWishlist, removeFromWishlist } =
    useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const { isMobile, isTablet } = useWindowSize();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchWishlist(user.id);
  }, [user]);

  async function handleRemove(productId) {
    try {
      await removeFromWishlist(user.id, productId);
      toast.success("Removed from wishlist", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    } catch {
      toast.error("Something went wrong");
    }
  }

  function handleAddToCart(product) {
    addItem(product);
    toast.success(`${product.name} added to cart! 🛍️`, {
      style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
    });
  }

  const gridCols = isMobile
    ? "repeat(2, 1fr)"
    : isTablet
      ? "repeat(3, 1fr)"
      : "repeat(3, 1fr)";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF9F0" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFF9C4 100%)",
          padding: isMobile ? "1.5rem 1rem" : "2.5rem 2rem 2rem",
          borderBottom: "2px solid #FFE0B2",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: isMobile ? "2.2rem" : "3rem",
              color: "#2C1810",
              marginBottom: "0.25rem",
            }}
          >
            My Wishlist ❤️
          </h1>
          <p style={{ color: "#9E9E9E", fontWeight: 600, fontSize: "0.9rem" }}>
            {items.length} saved item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: isMobile ? "1rem" : "2rem 1.5rem",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: gridCols,
              gap: "1rem",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  height: "240px",
                  opacity: 0.5,
                  border: "1.5px solid #FFE0B2",
                }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <Heart
              size={56}
              style={{ color: "#FFE0B2", margin: "0 auto 1rem" }}
            />
            <p
              style={{
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "#2C1810",
                marginBottom: "0.5rem",
              }}
            >
              Your wishlist is empty
            </p>
            <p
              style={{
                color: "#BDBDBD",
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
              }}
            >
              Save items you love by clicking the heart icon
            </p>
            <Link
              to="/shop"
              style={{
                backgroundColor: "#FF6B35",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "12px",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
            >
              Browse Snacks
            </Link>
          </div>
        ) : (
          <>
            {/* Add all to cart */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
              }}
            >
              <button
                onClick={() => {
                  items.forEach((i) => addItem(i.products));
                  toast.success("All items added to cart! 🛍️", {
                    style: {
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 700,
                    },
                  });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#FF6B35",
                  color: "#fff",
                  padding: "9px 18px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                }}
              >
                <ShoppingCart size={16} />
                Add All to Cart
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: gridCols,
                gap: "1rem",
              }}
            >
              {items.map((item) => {
                const product = item.products;
                if (!product) return null;
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "16px",
                      border: "1.5px solid #FFE0B2",
                      overflow: "hidden",
                      transition: "all 0.2s",
                      cursor: "pointer",
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
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image */}
                    <div
                      style={{
                        height: isMobile ? "120px" : "150px",
                        background: "linear-gradient(135deg, #FFF3E0, #FFF9C4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        fontSize: "3.5rem",
                      }}
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "🍫"
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(product.id);
                        }}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          backgroundColor: "#fff",
                          border: "1.5px solid #FFE0B2",
                          borderRadius: "50%",
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#BDBDBD",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#EF4444";
                          e.currentTarget.style.color = "#EF4444";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#FFE0B2";
                          e.currentTarget.style.color = "#BDBDBD";
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Info */}
                    <div style={{ padding: isMobile ? "0.7rem" : "0.9rem" }}>
                      <p
                        style={{
                          fontWeight: 800,
                          color: "#2C1810",
                          fontSize: isMobile ? "0.82rem" : "0.9rem",
                          marginBottom: "2px",
                        }}
                      >
                        {product.name}
                      </p>
                      <p
                        style={{
                          color: "#9E9E9E",
                          fontSize: "0.75rem",
                          marginBottom: "0.6rem",
                        }}
                      >
                        🌐 {product.origin_country}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            color: "#FF6B35",
                            fontWeight: 800,
                            fontSize: "0.95rem",
                          }}
                        >
                          ${product.price}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            backgroundColor: "#FF6B35",
                            color: "#fff",
                            padding: isMobile ? "5px 9px" : "7px 12px",
                            borderRadius: "9px",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "Nunito, sans-serif",
                            fontWeight: 700,
                            fontSize: "0.78rem",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#e55a2b")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#FF6B35")
                          }
                        >
                          <ShoppingCart size={13} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
