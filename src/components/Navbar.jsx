import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

export default function Navbar({ onCartClick }) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, profile, signOut } = useAuthStore();

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out successfully", {
      style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
    });
  }

  return (
    <nav
      style={{
        backgroundColor: "#fff",
        borderBottom: "2px solid #FFE4B5",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0.85rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: "Boogaloo, cursive",
            fontSize: "2rem",
            color: "#FF6B35",
            textDecoration: "none",
          }}
        >
          Yum<span style={{ color: "#FFB800" }}>pora</span>
        </Link>

        {/* Links */}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            listStyle: "none",
          }}
        >
          {[
            ["/", "Home"],
            ["/shop", "Shop"],
          ].map(([path, label]) => (
            <li key={path}>
              <Link
                to={path}
                style={{
                  fontWeight: 700,
                  color: "#2C1810",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                }}
              >
                {label}
              </Link>
            </li>
          ))}
          {user && (
            <>
              <li>
                <Link
                  to="/orders"
                  style={{
                    fontWeight: 700,
                    color: "#2C1810",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                  }}
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/wishlist"
                  style={{
                    fontWeight: 700,
                    color: "#2C1810",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Wishlist
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Auth */}
          {user ? (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#FFF3E0",
                  padding: "6px 12px",
                  borderRadius: "50px",
                  border: "1.5px solid #FFE0B2",
                  textDecoration: "none",
                }}
              >
                <User size={15} style={{ color: "#FF6B35" }} />
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#2C1810",
                    maxWidth: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {profile?.full_name || user.email}
                </span>
                {profile?.loyalty_points > 0 && (
                  <span
                    style={{
                      backgroundColor: "#FFB800",
                      color: "#2C1810",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      padding: "1px 7px",
                      borderRadius: "20px",
                    }}
                  >
                    ⭐ {profile.loyalty_points}pts
                  </span>
                )}
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign out"
                style={{
                  background: "none",
                  border: "1.5px solid #FFE0B2",
                  borderRadius: "50px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "#9E9E9E",
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              style={{
                fontWeight: 700,
                color: "#FF6B35",
                textDecoration: "none",
                fontSize: "0.9rem",
                border: "1.5px solid #FFE0B2",
                padding: "7px 16px",
                borderRadius: "50px",
              }}
            >
              Log In
            </Link>
          )}

          {/* Cart */}
          <button
            onClick={onCartClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#FF6B35",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            <ShoppingCart size={18} />
            Cart
            <span
              style={{
                backgroundColor: "#FFB800",
                color: "#2C1810",
                fontSize: "0.75rem",
                fontWeight: 800,
                padding: "1px 8px",
                borderRadius: "20px",
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
