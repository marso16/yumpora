import { ShoppingCart, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      icon: "🛍️",
      style: { fontFamily: "Nunito, sans-serif", fontWeight: "700" },
    });
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1.5px solid #FFE0B2",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,53,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div
        style={{
          height: "180px",
          background: "linear-gradient(135deg, #FFF3E0, #FFF9C4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "4rem" }}>🍫</span>
        )}

        {product.is_featured && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "#FFB800",
              color: "#2C1810",
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "4px 10px",
              borderRadius: "20px",
            }}
          >
            ⭐ Featured
          </span>
        )}

        {/* Wishlist button on image */}
        <div
          style={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <WishlistButton productId={product.id} size={16} />
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "#BDBDBD",
            fontSize: "0.75rem",
            marginBottom: "4px",
          }}
        >
          <Globe size={12} />
          <span>{product.origin_country || "Exotic"}</span>
        </div>
        <h3
          style={{
            fontWeight: 800,
            color: "#2C1810",
            fontSize: "0.95rem",
            marginBottom: "4px",
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            color: "#9E9E9E",
            fontSize: "0.8rem",
            marginBottom: "0.75rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{ color: "#FF6B35", fontWeight: 800, fontSize: "1.1rem" }}
          >
            ${product.price}
          </span>
          <button
            onClick={handleAddToCart}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#FF6B35",
              color: "white",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e55a2b")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#FF6B35")
            }
          >
            <ShoppingCart size={15} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
