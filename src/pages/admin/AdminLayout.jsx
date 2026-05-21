import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Package, LogOut, Menu, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin, full_name")
      .eq("id", session.user.id)
      .single();

    if (!profile?.is_admin) {
      navigate("/admin/login");
      return;
    }
    setAdminName(profile.full_name || session.user.email);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out", {
      style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
    });
    navigate("/admin/login");
  }

  const navItems = [
    { path: "/admin/orders", label: "Orders", icon: <Package size={18} /> },
    {
      path: "/admin/products",
      label: "Products",
      icon: <ShoppingBag size={18} />,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          width: sidebarOpen ? "240px" : "0px",
          minHeight: "100vh",
          backgroundColor: "#2C1810",
          transition: "width 0.3s",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: "1.75rem",
              color: "#FF6B35",
              whiteSpace: "nowrap",
            }}
          >
            Yum<span style={{ color: "#FFB800" }}>pora</span>
          </p>
          <span
            style={{
              backgroundColor: "#FF6B35",
              color: "#fff",
              fontSize: "0.65rem",
              fontWeight: 800,
              padding: "2px 10px",
              borderRadius: "20px",
              letterSpacing: "2px",
            }}
          >
            ADMIN
          </span>
        </div>

        {/* Nav items */}
        <nav style={{ padding: "1rem 0", flex: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 1.5rem",
                  textDecoration: "none",
                  color: active ? "#FF6B35" : "rgba(255,255,255,0.6)",
                  backgroundColor: active
                    ? "rgba(255,107,53,0.1)"
                    : "transparent",
                  borderLeft: active
                    ? "3px solid #FF6B35"
                    : "3px solid transparent",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin info + sign out */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.75rem",
              fontWeight: 600,
              marginBottom: "8px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {adminName}
          </p>
          <button
            onClick={handleSignOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.6)",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.82rem",
              width: "100%",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#FF6B35";
              e.currentTarget.style.color = "#FF6B35";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #E5E5E5",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#2C1810",
              display: "flex",
              alignItems: "center",
            }}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <p style={{ fontWeight: 800, color: "#2C1810", fontSize: "0.95rem" }}>
            {navItems.find((i) => i.path === location.pathname)?.label ||
              "Admin"}
          </p>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
