import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Lock, Save, Package, Heart, Star } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { supabase } from "../lib/supabase";
import useAuthStore from "../store/authStore";
import RewardBanner from "../components/RewardBanner";
import { useWindowSize } from "../hooks/useWindowSize";

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuthStore();
  const { isMobile } = useWindowSize();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
      });
    }
    fetchStats();
  }, [user, profile]);

  async function fetchStats() {
    try {
      const [ordersRes, wishlistRes] = await Promise.all([
        api.get(`/rest/v1/orders?user_id=eq.${user.id}&select=id`),
        api.get(`/rest/v1/wishlist?user_id=eq.${user.id}&select=id`),
      ]);
      setOrderCount(ordersRes.data?.length || 0);
      setWishlistCount(wishlistRes.data?.length || 0);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  async function handleSaveProfile() {
    if (!form.full_name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/rest/v1/profiles?id=eq.${user.id}`, {
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        city: form.city,
      });
      await refreshProfile(user.id);
      toast.success("Profile updated! ✅", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!passwordForm.newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });
      if (error) throw error;
      toast.success("Password updated! 🔒", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setChangingPassword(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 11px 11px 40px",
    border: "1.5px solid #FFE0B2",
    borderRadius: "11px",
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    backgroundColor: "#FAFAFA",
    color: "#2C1810",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const iconStyle = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#BDBDBD",
    pointerEvents: "none",
  };

  const tabs = [
    { id: "profile", label: "👤 Profile" },
    { id: "rewards", label: "⭐ Rewards" },
    { id: "security", label: "🔒 Security" },
  ];

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF9F0" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFF9C4 100%)",
          padding: isMobile ? "1.5rem 1rem" : "2.5rem 2rem",
          borderBottom: "2px solid #FFE0B2",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Avatar */}
            <div
              style={{
                width: isMobile ? "56px" : "72px",
                height: isMobile ? "56px" : "72px",
                borderRadius: "50%",
                backgroundColor: "#FF6B35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "Boogaloo, cursive",
                  fontSize: isMobile ? "1.5rem" : "2rem",
                  color: "#fff",
                }}
              >
                {(profile?.full_name || user.email)?.[0]?.toUpperCase()}
              </span>
            </div>

            <div>
              <h1
                style={{
                  fontFamily: "Boogaloo, cursive",
                  fontSize: isMobile ? "1.75rem" : "2.25rem",
                  color: "#2C1810",
                  lineHeight: 1.1,
                }}
              >
                {profile?.full_name || "My Profile"}
              </h1>
              <p
                style={{
                  color: "#9E9E9E",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              marginTop: "1.25rem",
            }}
          >
            {[
              {
                icon: <Package size={16} />,
                label: "Total Orders",
                value: orderCount,
                path: "/orders",
              },
              {
                icon: <Heart size={16} />,
                label: "Wishlist",
                value: wishlistCount,
                path: "/wishlist",
              },
              {
                icon: <Star size={16} />,
                label: "Delivered",
                value: profile?.completed_orders || 0,
                path: "/orders",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                onClick={() => navigate(stat.path)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "14px",
                  padding: isMobile ? "0.75rem 0.5rem" : "1rem",
                  border: "1.5px solid #FFE0B2",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#FF6B35")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#FFE0B2")
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    color: "#FF6B35",
                    marginBottom: "4px",
                  }}
                >
                  {stat.icon}
                </div>
                <p
                  style={{
                    fontFamily: "Boogaloo, cursive",
                    fontSize: "1.5rem",
                    color: "#2C1810",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    color: "#9E9E9E",
                    fontSize: isMobile ? "0.65rem" : "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: isMobile ? "1rem" : "2rem 1.5rem",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: "1.5rem",
            backgroundColor: "#fff",
            padding: "4px",
            borderRadius: "14px",
            border: "1.5px solid #FFE0B2",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "9px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? "0.75rem" : "0.88rem",
                transition: "all 0.2s",
                backgroundColor:
                  activeTab === tab.id ? "#FF6B35" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#9E9E9E",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              border: "1.5px solid #FFE0B2",
              padding: "1.75rem",
            }}
          >
            <h2
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: "1.4rem",
                color: "#2C1810",
                marginBottom: "1.25rem",
              }}
            >
              Personal Information
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Full name */}
              <div>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9E9E9E",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={iconStyle} />
                  <input
                    type="text"
                    value={form.full_name}
                    placeholder="Your full name"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, full_name: e.target.value }))
                    }
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
              </div>

              {/* Phone with flag */}
              <div>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9E9E9E",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Phone Number
                </label>
                <PhoneInput
                  defaultCountry="lb"
                  value={form.phone}
                  onChange={(phone) => setForm((f) => ({ ...f, phone }))}
                  style={{
                    "--react-international-phone-border-radius": "11px",
                    "--react-international-phone-border-color": "#FFE0B2",
                    "--react-international-phone-background-color": "#FAFAFA",
                    "--react-international-phone-font-family":
                      "Nunito, sans-serif",
                    "--react-international-phone-font-size": "0.9rem",
                    "--react-international-phone-height": "44px",
                    "--react-international-phone-text-color": "#2C1810",
                    width: "100%",
                  }}
                />
              </div>

              {/* Address */}
              <div>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9E9E9E",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Street Address
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin size={16} style={iconStyle} />
                  <input
                    type="text"
                    value={form.address}
                    placeholder="Your street address"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9E9E9E",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  City
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin size={16} style={iconStyle} />
                  <input
                    type="text"
                    value={form.city}
                    placeholder="Your city"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  backgroundColor: saving ? "#BDBDBD" : "#FF6B35",
                  color: "#fff",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!saving)
                    e.currentTarget.style.backgroundColor = "#e55a2b";
                }}
                onMouseLeave={(e) => {
                  if (!saving)
                    e.currentTarget.style.backgroundColor = "#FF6B35";
                }}
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* REWARDS TAB */}
        {activeTab === "rewards" && <RewardBanner profile={profile} />}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              border: "1.5px solid #FFE0B2",
              padding: "1.75rem",
            }}
          >
            <h2
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: "1.4rem",
                color: "#2C1810",
                marginBottom: "0.5rem",
              }}
            >
              Change Password 🔒
            </h2>
            <p
              style={{
                color: "#9E9E9E",
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
              }}
            >
              Choose a strong password with at least 6 characters.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9E9E9E",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={iconStyle} />
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    placeholder="Enter new password"
                    onChange={(e) =>
                      setPasswordForm((f) => ({
                        ...f,
                        newPassword: e.target.value,
                      }))
                    }
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9E9E9E",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={iconStyle} />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    placeholder="Confirm new password"
                    onChange={(e) =>
                      setPasswordForm((f) => ({
                        ...f,
                        confirmPassword: e.target.value,
                      }))
                    }
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  backgroundColor: changingPassword ? "#BDBDBD" : "#2C1810",
                  color: "#fff",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: changingPassword ? "not-allowed" : "pointer",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                <Lock size={18} />
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
