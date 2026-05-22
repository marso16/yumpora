import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;

        // Fetch profile using the access token directly
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.user.id)
          .single()
          .setHeader("Authorization", `Bearer ${data.session.access_token}`);

        toast.success("Welcome back! 👋", {
          style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
        });

        if (profile?.is_admin) {
          navigate("/admin/orders");
        } else {
          navigate("/");
        }
      } else {
        if (!form.fullName?.trim()) {
          toast.error("Please enter your name");
          setLoading(false);
          return;
        }
        await signUp(form.email, form.password, form.fullName);
        toast.success("Account created! Check your email to confirm. 📧", {
          style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
          duration: 5000,
        });
        setMode("login");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", {
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
    transition: "border-color 0.2s",
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
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link
            to="/"
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: "2.5rem",
              color: "#FF6B35",
              textDecoration: "none",
            }}
          >
            Yum<span style={{ color: "#FFB800" }}>pora</span>
          </Link>
          <p
            style={{
              color: "#9E9E9E",
              fontWeight: 600,
              fontSize: "0.9rem",
              marginTop: "4px",
            }}
          >
            {mode === "login" ? "Welcome back! 👋" : "Create your account 🎉"}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            border: "1.5px solid #FFE0B2",
            padding: "2rem",
            boxShadow: "0 4px 24px rgba(255,107,53,0.08)",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#FFF3E0",
              borderRadius: "12px",
              padding: "4px",
              marginBottom: "1.75rem",
            }}
          >
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "9px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                  backgroundColor: mode === m ? "#FF6B35" : "transparent",
                  color: mode === m ? "#fff" : "#9E9E9E",
                }}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Full name */}
              {mode === "signup" && (
                <div style={{ position: "relative" }}>
                  <User
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
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
              )}

              {/* Email */}
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
                  name="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                  onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                />
              </div>

              {/* Password */}
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                  onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#BDBDBD",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                  backgroundColor: loading ? "#BDBDBD" : "#FF6B35",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!loading)
                    e.currentTarget.style.backgroundColor = "#e55a2b";
                }}
                onMouseLeave={(e) => {
                  if (!loading)
                    e.currentTarget.style.backgroundColor = "#FF6B35";
                }}
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Log In"
                    : "Create Account"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "1.5rem 0",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#FFE0B2" }}
            />
            <span
              style={{ color: "#BDBDBD", fontSize: "0.8rem", fontWeight: 600 }}
            >
              or
            </span>
            <div
              style={{ flex: 1, height: "1px", backgroundColor: "#FFE0B2" }}
            />
          </div>

          {/* Switch mode */}
          <p
            style={{
              textAlign: "center",
              color: "#9E9E9E",
              fontSize: "0.9rem",
            }}
          >
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              style={{
                background: "none",
                border: "none",
                color: "#FF6B35",
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.9rem",
                padding: 0,
              }}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>

        {/* Guest note */}
        <p
          style={{
            textAlign: "center",
            color: "#BDBDBD",
            fontSize: "0.8rem",
            marginTop: "1.25rem",
            fontWeight: 600,
          }}
        >
          You can also checkout as a guest — no account needed.
        </p>
      </div>
    </div>
  );
}
