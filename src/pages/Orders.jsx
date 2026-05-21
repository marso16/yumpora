import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import api from "../lib/axios";
import useAuthStore from "../store/authStore";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "#FFB800",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: <Clock size={14} />,
  },
  confirmed: {
    label: "Confirmed",
    color: "#3B82F6",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    icon: <CheckCircle size={14} />,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "#FF6B35",
    bg: "#FFF3E0",
    border: "#FFE0B2",
    icon: <Truck size={14} />,
  },
  delivered: {
    label: "Delivered",
    color: "#22C55E",
    bg: "#F0FFF4",
    border: "#C6F6D5",
    icon: <CheckCircle size={14} />,
  },
  cancelled: {
    label: "Cancelled",
    color: "#EF4444",
    bg: "#FFF5F5",
    border: "#FED7D7",
    icon: <XCircle size={14} />,
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        backgroundColor: config.bg,
        color: config.color,
        border: `1.5px solid ${config.border}`,
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: 700,
      }}
    >
      {config.icon} {config.label}
    </span>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  async function fetchItems() {
    if (items.length > 0) {
      setExpanded((e) => !e);
      return;
    }
    setLoadingItems(true);
    try {
      const res = await api.get(`/rest/v1/order_items?order_id=eq.${order.id}`);
      setItems(res.data || []);
      setExpanded(true);
    } catch (error) {
      console.error("Error fetching order items:", error);
    } finally {
      setLoadingItems(false);
    }
  }

  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = new Date(order.created_at).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "1.5px solid #FFE0B2",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Order Header */}
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          {/* Left */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <Package size={16} style={{ color: "#FF6B35" }} />
              <span
                style={{
                  fontWeight: 800,
                  color: "#2C1810",
                  fontSize: "0.9rem",
                }}
              >
                Order
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#9E9E9E",
                  backgroundColor: "#F5F5F5",
                  padding: "2px 8px",
                  borderRadius: "6px",
                }}
              >
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <p
              style={{ color: "#9E9E9E", fontSize: "0.82rem", fontWeight: 600 }}
            >
              {date} at {time}
            </p>
            <p
              style={{
                color: "#9E9E9E",
                fontSize: "0.82rem",
                marginTop: "2px",
              }}
            >
              📍 {order.delivery_address}, {order.city}
            </p>
          </div>

          {/* Right */}
          <div style={{ textAlign: "right" }}>
            <StatusBadge status={order.status} />
            <p
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: "1.5rem",
                color: "#FF6B35",
                marginTop: "6px",
              }}
            >
              ${parseFloat(order.total_amount).toFixed(2)}
            </p>
            <p
              style={{ fontSize: "0.75rem", color: "#9E9E9E", fontWeight: 600 }}
            >
              💵 Cash on Delivery
            </p>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={fetchItems}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "8px",
            borderRadius: "10px",
            border: "1.5px solid #FFE0B2",
            backgroundColor: expanded ? "#FFF3E0" : "transparent",
            color: "#FF6B35",
            cursor: "pointer",
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "all 0.2s",
          }}
        >
          {loadingItems ? (
            "Loading..."
          ) : expanded ? (
            <>
              <ChevronUp size={16} /> Hide Items
            </>
          ) : (
            <>
              <ChevronDown size={16} /> View Items
            </>
          )}
        </button>
      </div>

      {/* Order Items — expanded */}
      {expanded && items.length > 0 && (
        <div
          style={{
            borderTop: "1.5px solid #FFE0B2",
            backgroundColor: "#FFF9F0",
            padding: "1.25rem 1.5rem",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      flexShrink: 0,
                      backgroundColor: "#FFF3E0",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                    }}
                  >
                    🍫
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#2C1810",
                        fontSize: "0.88rem",
                      }}
                    >
                      {item.product_name}
                    </p>
                    <p style={{ color: "#9E9E9E", fontSize: "0.78rem" }}>
                      ${parseFloat(item.product_price).toFixed(2)} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 800,
                    color: "#FF6B35",
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  ${parseFloat(item.subtotal).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Order notes */}
          {order.notes && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "1.5px solid #FFE0B2",
              }}
            >
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#9E9E9E",
                  fontWeight: 600,
                }}
              >
                📝 Note: {order.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchOrders();
  }, [user]);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await api.get(
        `/rest/v1/orders?user_id=eq.${user.id}&order=created_at.desc`,
      );
      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF9F0" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFF9C4 100%)",
          padding: "2.5rem 2rem 2rem",
          borderBottom: "2px solid #FFE0B2",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: "3rem",
              color: "#2C1810",
              marginBottom: "0.25rem",
            }}
          >
            My Orders 📦
          </h1>
          <p style={{ color: "#9E9E9E", fontWeight: 600 }}>
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>

          {/* Loyalty points banner */}
          {profile?.loyalty_points > 0 && (
            <div
              style={{
                marginTop: "1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#FFFBEB",
                border: "1.5px solid #FDE68A",
                padding: "8px 16px",
                borderRadius: "20px",
              }}
            >
              <span>⭐</span>
              <span
                style={{
                  fontWeight: 800,
                  color: "#2C1810",
                  fontSize: "0.9rem",
                }}
              >
                {profile.loyalty_points} loyalty points earned
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {/* Filter tabs */}
        {orders.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            {[
              "all",
              "pending",
              "confirmed",
              "out_for_delivery",
              "delivered",
              "cancelled",
            ].map((s) => {
              const count = s === "all" ? orders.length : statusCounts[s] || 0;
              if (s !== "all" && count === 0) return null;
              const config = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: "20px",
                    border: "1.5px solid",
                    borderColor:
                      filter === s ? config?.color || "#FF6B35" : "#FFE0B2",
                    backgroundColor:
                      filter === s ? config?.bg || "#FFF3E0" : "#fff",
                    color:
                      filter === s ? config?.color || "#FF6B35" : "#9E9E9E",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {s === "all" ? "All" : STATUS_CONFIG[s]?.label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Orders list */}
        {loading ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  height: "140px",
                  opacity: 0.5,
                  border: "1.5px solid #FFE0B2",
                }}
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 0",
            }}
          >
            <p style={{ fontSize: "4rem", marginBottom: "1rem" }}>📦</p>
            <p
              style={{
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#2C1810",
                marginBottom: "0.5rem",
              }}
            >
              {filter === "all"
                ? "No orders yet"
                : `No ${STATUS_CONFIG[filter]?.label} orders`}
            </p>
            <p style={{ color: "#BDBDBD", marginBottom: "1.5rem" }}>
              {filter === "all"
                ? "Time to treat yourself to some exotic snacks!"
                : "Try a different filter"}
            </p>
            {filter === "all" ? (
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
            ) : (
              <button
                onClick={() => setFilter("all")}
                style={{
                  backgroundColor: "#FF6B35",
                  color: "#fff",
                  padding: "12px 28px",
                  borderRadius: "12px",
                  border: "none",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: "0.95rem",
                }}
              >
                Show All Orders
              </button>
            )}
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
