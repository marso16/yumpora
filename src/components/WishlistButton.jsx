import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useWishlistStore from "../store/wishlistStore";
import useAuthStore from "../store/authStore";

export default function WishlistButton({ productId, size = 18 }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const wishlisted = isWishlisted(productId);

  async function handleClick(e) {
    e.stopPropagation();
    if (!user) {
      toast("Please log in to save items ❤️", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
      navigate("/auth");
      return;
    }
    try {
      await toggleWishlist(user.id, productId);
      toast.success(
        wishlisted ? "Removed from wishlist" : "Added to wishlist! ❤️",
        {
          style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
        },
      );
    } catch (error) {
      toast.error("Something went wrong", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    }
  }

  return (
    <button
      onClick={handleClick}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      style={{
        background: wishlisted ? "#FFF0EE" : "white",
        border: `1.5px solid ${wishlisted ? "#FF6B35" : "#FFE0B2"}`,
        borderRadius: "50%",
        width: `${size + 16}px`,
        height: `${size + 16}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FF6B35")}
      onMouseLeave={(e) => {
        if (!wishlisted) e.currentTarget.style.borderColor = "#FFE0B2";
      }}
    >
      <Heart
        size={size}
        style={{
          color: wishlisted ? "#FF6B35" : "#BDBDBD",
          fill: wishlisted ? "#FF6B35" : "none",
          transition: "all 0.2s",
        }}
      />
    </button>
  );
}
