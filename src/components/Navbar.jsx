import { Link } from "react-router-dom";
import { ShoppingCart, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

export default function Navbar({ onCartClick }) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, profile, signOut } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
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
          padding: "0.85rem 1.25rem",
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
            fontSize: "1.75rem",
            color: "#FF6B35",
            textDecoration: "none",
          }}
        >
          Yum<span style={{ color: "#FFB800" }}>pora</span>
        </Link>

        {/* Desktop Links */}
        <ul
          className="desktop-nav"
          style={{
            alignItems: "center",
            gap: "2rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
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
                  }}
                >
                  ❤️ Wishlist
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Auth — desktop only */}
          <div className="desktop-nav">
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
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {profile?.full_name || user.email.split("@")[0]}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
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
          </div>

          {/* Cart button */}
          <button
            onClick={onCartClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#FF6B35",
              color: "#fff",
              padding: "8px 14px",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
            }}
          >
            <ShoppingCart size={18} />
            <span className="desktop-nav">Cart</span>
            <span
              style={{
                backgroundColor: "#FFB800",
                color: "#2C1810",
                fontSize: "0.75rem",
                fontWeight: 800,
                padding: "1px 7px",
                borderRadius: "20px",
                minWidth: "20px",
                textAlign: "center",
              }}
            >
              {totalItems}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="mobile-only"
            onClick={() => setMenuOpen((m) => !m)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#2C1810",
              alignItems: "center",
              padding: "4px",
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            backgroundColor: "#fff",
            borderTop: "1px solid #FFE0B2",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}
        >
          {[
            ["/", "Home"],
            ["/shop", "Shop"],
          ].map(([path, label]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              style={{
                fontWeight: 700,
                color: "#2C1810",
                textDecoration: "none",
                fontSize: "1rem",
                padding: "0.75rem 0",
                borderBottom: "1px solid #FFF3E0",
                display: "block",
              }}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontWeight: 700,
                  color: "#2C1810",
                  textDecoration: "none",
                  fontSize: "1rem",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #FFF3E0",
                  display: "block",
                }}
              >
                My Orders
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontWeight: 700,
                  color: "#2C1810",
                  textDecoration: "none",
                  fontSize: "1rem",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #FFF3E0",
                  display: "block",
                }}
              >
                ❤️ Wishlist
              </Link>
              <div
                style={{
                  padding: "0.75rem 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderBottom: "1px solid #FFF3E0",
                }}
              >
                <User size={15} style={{ color: "#FF6B35" }} />
                <span
                  style={{
                    fontWeight: 700,
                    color: "#2C1810",
                    fontSize: "0.9rem",
                  }}
                >
                  {profile?.full_name || user.email.split("@")[0]}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  color: "#EF4444",
                  fontSize: "1rem",
                  cursor: "pointer",
                  padding: "0.75rem 0",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMenuOpen(false)}
              style={{
                fontWeight: 700,
                color: "#FF6B35",
                textDecoration: "none",
                fontSize: "1rem",
                padding: "0.75rem 0",
                display: "block",
              }}
            >
              Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
