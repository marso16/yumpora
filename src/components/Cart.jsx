import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

export default function Cart({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 90,
            transition: "opacity 0.3s",
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "420px",
          backgroundColor: "#fff",
          zIndex: 100,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1.5px solid #FFE0B2",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FFF9F0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShoppingBag size={22} style={{ color: "#FF6B35" }} />
            <span
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: "1.6rem",
                color: "#2C1810",
              }}
            >
              Your Cart
            </span>
            <span
              style={{
                backgroundColor: "#FF6B35",
                color: "#fff",
                fontSize: "0.75rem",
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: "20px",
              }}
            >
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9E9E9E",
              display: "flex",
              alignItems: "center",
              padding: "4px",
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem" }}>
          {items.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                gap: "1rem",
              }}
            >
              <span style={{ fontSize: "4rem" }}>🛒</span>
              <p
                style={{
                  fontWeight: 800,
                  color: "#2C1810",
                  fontSize: "1.1rem",
                }}
              >
                Your cart is empty
              </p>
              <p style={{ color: "#BDBDBD", fontSize: "0.9rem" }}>
                Add some exotic snacks!
              </p>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: "#FF6B35",
                  color: "#fff",
                  padding: "10px 24px",
                  borderRadius: "12px",
                  border: "none",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                }}
              >
                Browse Snacks
              </button>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "#FFF9F0",
                    borderRadius: "14px",
                    padding: "1rem",
                    border: "1.5px solid #FFE0B2",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      flexShrink: 0,
                      backgroundColor: "#FFF3E0",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    ) : (
                      "🍫"
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 800,
                        color: "#2C1810",
                        fontSize: "0.9rem",
                        marginBottom: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        color: "#FF6B35",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    {/* Quantity controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0",
                        marginTop: "8px",
                        width: "fit-content",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={{
                          width: "28px",
                          height: "28px",
                          border: "1.5px solid #FFE0B2",
                          borderRadius: "8px 0 0 8px",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#FF6B35",
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <div
                        style={{
                          width: "36px",
                          height: "28px",
                          border: "1.5px solid #FFE0B2",
                          borderLeft: "none",
                          borderRight: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          backgroundColor: "#fff",
                          color: "#2C1810",
                        }}
                      >
                        {item.quantity}
                      </div>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={{
                          width: "28px",
                          height: "28px",
                          border: "1.5px solid #FFE0B2",
                          borderRadius: "0 8px 8px 0",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#FF6B35",
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#BDBDBD",
                      padding: "4px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#FF6B35")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#BDBDBD")
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderTop: "1.5px solid #FFE0B2",
              backgroundColor: "#FFF9F0",
            }}
          >
            {/* Subtotal */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ color: "#9E9E9E", fontWeight: 600 }}>
                Subtotal
              </span>
              <span
                style={{ fontWeight: 800, color: "#2C1810", fontSize: "1rem" }}
              >
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <span style={{ color: "#9E9E9E", fontWeight: 600 }}>
                Delivery
              </span>
              <span style={{ fontWeight: 800, color: "#4CAF50" }}>Free</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
                paddingTop: "0.75rem",
                borderTop: "1.5px solid #FFE0B2",
              }}
            >
              <span
                style={{ fontWeight: 800, color: "#2C1810", fontSize: "1rem" }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "Boogaloo, cursive",
                  fontSize: "1.5rem",
                  color: "#FF6B35",
                }}
              >
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>

            {/* COD badge */}
            <div
              style={{
                backgroundColor: "#FFF3E0",
                borderRadius: "10px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>💵</span>
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#9E9E9E",
                }}
              >
                Cash on Delivery available at checkout
              </span>
            </div>

            <Link
              to="/checkout"
              onClick={onClose}
              style={{
                display: "block",
                textAlign: "center",
                backgroundColor: "#FF6B35",
                color: "#fff",
                padding: "14px",
                borderRadius: "14px",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e55a2b")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#FF6B35")
              }
            >
              Proceed to Checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
