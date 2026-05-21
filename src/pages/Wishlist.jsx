import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useWishlistStore from "../store/wishlistStore";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, loading, fetchWishlist, removeFromWishlist } =
    useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF9F0" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFF9C4 100%)",
          padding: "2.5rem 2rem 2rem",
          borderBottom: "2px solid #FFE0B2",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: "3rem",
              color: "#2C1810",
              marginBottom: "0.25rem",
            }}
          >
            My Wishlist ❤️
          </h1>
          <p style={{ color: "#9E9E9E", fontWeight: 600 }}>
            {items.length} saved item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.25rem",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  height: "280px",
                  opacity: 0.5,
                  border: "1.5px solid #FFE0B2",
                }}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <Heart
              size={64}
              style={{ color: "#FFE0B2", margin: "0 auto 1rem" }}
            />
            <p
              style={{
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#2C1810",
                marginBottom: "0.5rem",
              }}
            >
              Your wishlist is empty
            </p>
            <p style={{ color: "#BDBDBD", marginBottom: "1.5rem" }}>
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
                marginBottom: "1.25rem",
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
                  padding: "10px 20px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                <ShoppingCart size={17} />
                Add All to Cart
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.25rem",
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
                        height: "160px",
                        background: "linear-gradient(135deg, #FFF3E0, #FFF9C4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        fontSize: "4rem",
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

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(product.id);
                        }}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "#fff",
                          border: "1.5px solid #FFE0B2",
                          borderRadius: "50%",
                          width: "34px",
                          height: "34px",
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
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Info */}
                    <div style={{ padding: "0.9rem" }}>
                      <p
                        style={{
                          fontWeight: 800,
                          color: "#2C1810",
                          fontSize: "0.9rem",
                          marginBottom: "2px",
                        }}
                      >
                        {product.name}
                      </p>
                      <p
                        style={{
                          color: "#9E9E9E",
                          fontSize: "0.78rem",
                          marginBottom: "0.75rem",
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
                            fontSize: "1rem",
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
                            gap: "5px",
                            backgroundColor: "#FF6B35",
                            color: "#fff",
                            padding: "7px 12px",
                            borderRadius: "9px",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "Nunito, sans-serif",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#e55a2b")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#FF6B35")
                          }
                        >
                          <ShoppingCart size={14} /> Add
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
