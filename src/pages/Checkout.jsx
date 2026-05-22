import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  MapPin,
  User,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  Gift,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import RewardBanner from "../components/RewardBanner";
import { getTierInfo } from "../lib/rewards";

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, profile, refreshProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [finalTotal, setFinalTotal] = useState(0);
  const [rewardApplied, setRewardApplied] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  const [form, setForm] = useState({
    full_name: profile?.full_name || user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    notes: "",
  });

  const rewardInfo =
    user && profile
      ? getTierInfo(
          profile.completed_orders || 0,
          profile.total_tiers_claimed || 0,
        )
      : null;

  const subtotal = getTotalPrice();
  const totalAfterDiscount = Math.max(0, subtotal - rewardAmount);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleClaimReward() {
    if (!rewardInfo?.hasReward) return;
    if (rewardApplied) {
      setRewardApplied(false);
      setRewardAmount(0);
      toast("Reward removed", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    } else {
      setRewardApplied(true);
      setRewardAmount(rewardInfo.nextRewardAmount);
      toast.success(
        `$${rewardInfo.nextRewardAmount.toFixed(2)} reward applied! 🎉`,
        {
          style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
        },
      );
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setLoading(true);

    try {
      setFinalTotal(totalAfterDiscount);

      const orderRes = await api.post(
        "/rest/v1/orders",
        {
          customer_name: form.full_name,
          customer_email: form.email,
          customer_phone: form.phone,
          delivery_address: form.address,
          city: form.city,
          notes: form.notes,
          payment_method: "cash_on_delivery",
          status: "pending",
          total_amount: totalAfterDiscount,
          discount_amount: rewardAmount,
          reward_applied: rewardApplied,
          reward_amount: rewardAmount,
          user_id: user?.id || null,
        },
        { headers: { Prefer: "return=representation" } },
      );

      const order = orderRes.data[0];

      await api.post(
        "/rest/v1/order_items",
        items.map((item) => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
      );

      if (user) {
        const newTiersClaimed = rewardApplied
          ? (profile.total_tiers_claimed || 0) + 1
          : profile.total_tiers_claimed || 0;

        await api.patch(`/rest/v1/profiles?id=eq.${user.id}`, {
          total_tiers_claimed: newTiersClaimed,
        });
        await refreshProfile(user.id);
      }

      setOrderId(order.id);
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong. Please try again.", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    } finally {
      setLoading(false);
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

  // SUCCESS SCREEN
  if (orderPlaced) {
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
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "24px",
            border: "1.5px solid #FFE0B2",
            padding: "3rem 2.5rem",
            textAlign: "center",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 4px 24px rgba(255,107,53,0.08)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#FFF3E0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <CheckCircle size={44} style={{ color: "#FF6B35" }} />
          </div>

          <h1
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: "2.5rem",
              color: "#2C1810",
              marginBottom: "0.5rem",
            }}
          >
            Order Placed! 🎉
          </h1>
          <p
            style={{
              color: "#9E9E9E",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Your exotic snacks are on their way! We'll contact you on{" "}
            <strong style={{ color: "#2C1810" }}>{form.phone}</strong> to
            confirm.
          </p>

          {/* Order ID */}
          <div
            style={{
              backgroundColor: "#FFF3E0",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <p
              style={{
                color: "#9E9E9E",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              Order ID
            </p>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "0.85rem",
                color: "#FF6B35",
                fontWeight: 700,
                wordBreak: "break-all",
              }}
            >
              {orderId}
            </p>
          </div>

          {/* Reward used */}
          {rewardApplied && (
            <div
              style={{
                backgroundColor: "#FFFBEB",
                border: "1.5px solid #FDE68A",
                borderRadius: "12px",
                padding: "0.75rem 1rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Gift size={18} style={{ color: "#FFB800" }} />
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#2C1810",
                }}
              >
                Tier reward applied — ${rewardAmount.toFixed(2)} off!
              </p>
            </div>
          )}

          {/* COD reminder */}
          <div
            style={{
              backgroundColor: "#F0FFF4",
              border: "1.5px solid #C6F6D5",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>💵</span>
            <div style={{ textAlign: "left" }}>
              <p
                style={{
                  fontWeight: 800,
                  color: "#2C1810",
                  fontSize: "0.9rem",
                }}
              >
                Cash on Delivery
              </p>
              <p style={{ color: "#9E9E9E", fontSize: "0.8rem" }}>
                Please have{" "}
                <strong style={{ color: "#2C1810" }}>
                  ${finalTotal.toFixed(2)}
                </strong>{" "}
                ready when your order arrives
              </p>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {user && (
              <Link
                to="/orders"
                style={{
                  display: "block",
                  textAlign: "center",
                  backgroundColor: "#FF6B35",
                  color: "#fff",
                  padding: "13px",
                  borderRadius: "12px",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                View My Orders
              </Link>
            )}
            <Link
              to="/shop"
              style={{
                display: "block",
                textAlign: "center",
                backgroundColor: "#FFF3E0",
                color: "#FF6B35",
                padding: "13px",
                borderRadius: "12px",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART
  if (items.length === 0) {
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
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</p>
          <p
            style={{
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#2C1810",
              marginBottom: "0.5rem",
            }}
          >
            Your cart is empty
          </p>
          <p style={{ color: "#BDBDBD", marginBottom: "1.5rem" }}>
            Add some snacks before checking out!
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
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFF9F0",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/shop"
            style={{
              color: "#FF6B35",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            ← Back to Shop
          </Link>
          <h1
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: "3rem",
              color: "#2C1810",
              marginTop: "0.5rem",
            }}
          >
            Checkout 🛍️
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 400px",
            gap: "2rem",
            alignItems: "flex-start",
          }}
        >
          {/* LEFT — Form */}
          <form onSubmit={handleSubmit}>
            {/* Contact Info */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                border: "1.5px solid #FFE0B2",
                padding: "1.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "Boogaloo, cursive",
                  fontSize: "1.5rem",
                  color: "#2C1810",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <User size={20} style={{ color: "#FF6B35" }} /> Contact Info
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ position: "relative" }}>
                  <User size={16} style={iconStyle} />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={iconStyle} />
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
                <div style={{ position: "relative" }}>
                  <Phone size={16} style={iconStyle} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                border: "1.5px solid #FFE0B2",
                padding: "1.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "Boogaloo, cursive",
                  fontSize: "1.5rem",
                  color: "#2C1810",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <MapPin size={20} style={{ color: "#FF6B35" }} /> Delivery
                Address
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ position: "relative" }}>
                  <MapPin size={16} style={iconStyle} />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <MapPin size={16} style={iconStyle} />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                    onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                  />
                </div>
                <textarea
                  name="notes"
                  placeholder="Order notes (optional)..."
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "11px",
                    border: "1.5px solid #FFE0B2",
                    borderRadius: "11px",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "0.9rem",
                    outline: "none",
                    backgroundColor: "#FAFAFA",
                    color: "#2C1810",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
                  onBlur={(e) => (e.target.style.borderColor = "#FFE0B2")}
                />
              </div>
            </div>

            {/* Reward claim */}
            {user && rewardInfo?.hasReward && (
              <div style={{ marginBottom: "1.25rem" }}>
                {rewardApplied ? (
                  <div
                    style={{
                      backgroundColor: "#F0FFF4",
                      border: "1.5px solid #C6F6D5",
                      borderRadius: "14px",
                      padding: "1rem 1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Gift size={18} style={{ color: "#22C55E" }} />
                      <div>
                        <p
                          style={{
                            fontWeight: 800,
                            color: "#2C1810",
                            fontSize: "0.9rem",
                          }}
                        >
                          Reward applied! 🎉
                        </p>
                        <p
                          style={{
                            color: "#9E9E9E",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                          }}
                        >
                          ${rewardAmount.toFixed(2)} off this order
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClaimReward}
                      style={{
                        background: "none",
                        border: "1.5px solid #C6F6D5",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        color: "#9E9E9E",
                        fontFamily: "Nunito, sans-serif",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <RewardBanner
                    profile={profile}
                    onClaim={handleClaimReward}
                    compact={true}
                  />
                )}
              </div>
            )}

            {/* Payment Method */}
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                border: "1.5px solid #FFE0B2",
                padding: "1.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "Boogaloo, cursive",
                  fontSize: "1.5rem",
                  color: "#2C1810",
                  marginBottom: "1.25rem",
                }}
              >
                💵 Payment Method
              </h2>
              <div
                style={{
                  backgroundColor: "#FFF3E0",
                  border: "2px solid #FF6B35",
                  borderRadius: "14px",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#FF6B35",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 800,
                      color: "#2C1810",
                      fontSize: "0.95rem",
                    }}
                  >
                    💵 Cash on Delivery
                  </p>
                  <p
                    style={{
                      color: "#9E9E9E",
                      fontSize: "0.8rem",
                      marginTop: "2px",
                    }}
                  >
                    Pay when your order arrives at your door
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px",
                backgroundColor: loading ? "#BDBDBD" : "#FF6B35",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#e55a2b";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#FF6B35";
              }}
            >
              {loading ? (
                "Placing Order..."
              ) : (
                <>
                  <Truck size={20} /> Place Order — $
                  {totalAfterDiscount.toFixed(2)}
                </>
              )}
            </button>
          </form>

          {/* RIGHT — Order Summary */}
          <div style={{ position: "sticky", top: "90px" }}>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                border: "1.5px solid #FFE0B2",
                padding: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "Boogaloo, cursive",
                  fontSize: "1.5rem",
                  color: "#2C1810",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ShoppingBag size={20} style={{ color: "#FF6B35" }} /> Order
                Summary
              </h2>

              {/* Items */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        flexShrink: 0,
                        backgroundColor: "#FFF3E0",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
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
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: 700,
                          color: "#2C1810",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.name}
                      </p>
                      <p style={{ color: "#9E9E9E", fontSize: "0.8rem" }}>
                        x{item.quantity}
                      </p>
                    </div>
                    <p
                      style={{
                        fontWeight: 800,
                        color: "#FF6B35",
                        fontSize: "0.9rem",
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: "#FFE0B2",
                  marginBottom: "1rem",
                }}
              />

              {/* Totals */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      color: "#9E9E9E",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Subtotal
                  </span>
                  <span style={{ fontWeight: 700, color: "#2C1810" }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {rewardApplied && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      style={{
                        color: "#22C55E",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      🎉 Tier reward
                    </span>
                    <span style={{ fontWeight: 700, color: "#22C55E" }}>
                      -${rewardAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      color: "#9E9E9E",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    Delivery
                  </span>
                  <span style={{ fontWeight: 700, color: "#4CAF50" }}>
                    Free
                  </span>
                </div>
              </div>

              <div
                style={{
                  height: "1px",
                  backgroundColor: "#FFE0B2",
                  margin: "1rem 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 800, color: "#2C1810" }}>Total</span>
                <span
                  style={{
                    fontFamily: "Boogaloo, cursive",
                    fontSize: "1.75rem",
                    color: "#FF6B35",
                  }}
                >
                  ${totalAfterDiscount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
