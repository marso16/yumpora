import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;

      // Check if admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .single();

      if (!profile?.is_admin) {
        await supabase.auth.signOut();
        toast.error("Access denied. Admins only.", {
          style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
        });
        return;
      }

      toast.success("Welcome back, Admin! 👋", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
      navigate("/admin/orders");
    } catch (error) {
      toast.error(error.message, {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 12px 12px 42px",
    border: "1.5px solid #FFE0B2",
    borderRadius: "12px",
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.95rem",
    outline: "none",
    backgroundColor: "#FAFAFA",
    color: "#2C1810",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFF9F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: "2.5rem",
              color: "#FF6B35",
            }}
          >
            Yum<span style={{ color: "#FFB800" }}>pora</span>
          </p>
          <p
            style={{
              backgroundColor: "#2C1810",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 800,
              padding: "4px 14px",
              borderRadius: "20px",
              display: "inline-block",
              marginTop: "4px",
              letterSpacing: "2px",
            }}
          >
            ADMIN PANEL
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            border: "1.5px solid #FFE0B2",
            padding: "2rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: "1.75rem",
              color: "#2C1810",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Admin Login 🔐
          </h2>

          <form onSubmit={handleSubmit}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ position: "relative" }}>
                <Mail
                  size={17}
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#BDBDBD",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="email"
                  placeholder="Admin email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                  onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                />
              </div>

              <div style={{ position: "relative" }}>
                <Lock
                  size={17}
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#BDBDBD",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                  onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  backgroundColor: loading ? "#BDBDBD" : "#2C1810",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                {loading ? "Logging in..." : "Login to Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
