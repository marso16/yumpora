import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const STATUSES = [
  "pending",
  "confirmed",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const STATUS_COLORS = {
  pending: { color: "#FFB800", bg: "#FFFBEB" },
  confirmed: { color: "#3B82F6", bg: "#EFF6FF" },
  out_for_delivery: { color: "#FF6B35", bg: "#FFF3E0" },
  delivered: { color: "#22C55E", bg: "#F0FFF4" },
  cancelled: { color: "#EF4444", bg: "#FFF5F5" },
};

function OrderRow({ order, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState([]);
  const [updating, setUpdating] = useState(false);

  async function fetchItems() {
    if (items.length > 0) {
      setExpanded((e) => !e);
      return;
    }
    try {
      const res = await api.get(`/rest/v1/order_items?order_id=eq.${order.id}`);
      setItems(res.data || []);
      setExpanded(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStatusChange(newStatus) {
    setUpdating(true);
    try {
      const previousStatus = order.status;

      const res = await api.patch(
        `/rest/v1/orders?id=eq.${order.id}`,
        { status: newStatus },
        { headers: { Prefer: "return=representation" } },
      );

      console.log("Patch response:", res.status, res.data);

      // Handle completed_orders count + tier reversal
      if (order.user_id) {
        const profileRes = await api.get(
          `/rest/v1/profiles?id=eq.${order.user_id}&select=completed_orders,total_tiers_claimed`,
        );
        const prof = profileRes.data?.[0];
        if (prof) {
          let newCompleted = prof.completed_orders || 0;
          let newTiersClaimed = prof.total_tiers_claimed || 0;

          // Delivered → increment completed orders
          if (newStatus === "delivered" && previousStatus !== "delivered") {
            newCompleted = newCompleted + 1;
          }

          // Un-delivered → decrement completed orders
          if (previousStatus === "delivered" && newStatus !== "delivered") {
            newCompleted = Math.max(0, newCompleted - 1);
          }

          // Cancelled with reward applied → reverse the claimed tier
          if (newStatus === "cancelled" && previousStatus !== "cancelled") {
            if (order.reward_applied) {
              newTiersClaimed = Math.max(0, newTiersClaimed - 1);
            }
          }

          await api.patch(`/rest/v1/profiles?id=eq.${order.user_id}`, {
            completed_orders: newCompleted,
            total_tiers_claimed: newTiersClaimed,
          });
        }
      }

      onStatusChange(order.id, newStatus);
      toast.success(`Order updated to ${newStatus}`, {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const statusConfig = STATUS_COLORS[order.status] || STATUS_COLORS.pending;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "14px",
        border: "1px solid #E5E5E5",
        overflow: "hidden",
        marginBottom: "0.75rem",
      }}
    >
      {/* Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
          gap: "1rem",
          padding: "1rem 1.25rem",
          alignItems: "center",
        }}
      >
        {/* Order ID + date */}
        <div>
          <p style={{ fontWeight: 800, color: "#2C1810", fontSize: "0.85rem" }}>
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p style={{ color: "#9E9E9E", fontSize: "0.75rem" }}>{date}</p>
        </div>

        {/* Customer */}
        <div>
          <p style={{ fontWeight: 700, color: "#2C1810", fontSize: "0.85rem" }}>
            {order.customer_name}
          </p>
          <p style={{ color: "#9E9E9E", fontSize: "0.75rem" }}>
            {order.customer_phone}
          </p>
          <p style={{ color: "#9E9E9E", fontSize: "0.75rem" }}>
            📍 {order.city}
          </p>
        </div>

        {/* Total */}
        <div>
          <p style={{ fontWeight: 800, color: "#FF6B35", fontSize: "1rem" }}>
            ${parseFloat(order.total_amount).toFixed(2)}
          </p>
          <p style={{ color: "#9E9E9E", fontSize: "0.75rem" }}>💵 COD</p>
        </div>

        {/* Status dropdown */}
        <div>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={
              updating ||
              order.status === "delivered" ||
              order.status === "cancelled"
            }
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: `1.5px solid ${statusConfig.color}`,
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.78rem",
              outline: "none",
              cursor:
                order.status === "delivered" || order.status === "cancelled"
                  ? "not-allowed"
                  : "pointer",
              opacity:
                order.status === "delivered" || order.status === "cancelled"
                  ? 0.6
                  : 1,
            }}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Expand */}
        <button
          onClick={fetchItems}
          style={{
            background: "none",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            padding: "6px 10px",
            cursor: "pointer",
            color: "#9E9E9E",
            display: "flex",
            alignItems: "center",
          }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded items */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid #F5F5F5",
            backgroundColor: "#FAFAFA",
            padding: "1rem 1.25rem",
          }}
        >
          <p
            style={{
              fontWeight: 800,
              color: "#2C1810",
              fontSize: "0.8rem",
              marginBottom: "0.75rem",
            }}
          >
            Order Items
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #E5E5E5",
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#2C1810",
                      fontSize: "0.85rem",
                    }}
                  >
                    {item.product_name}
                  </p>
                  <p style={{ color: "#9E9E9E", fontSize: "0.75rem" }}>
                    ${parseFloat(item.product_price).toFixed(2)} ×{" "}
                    {item.quantity}
                  </p>
                </div>
                <p
                  style={{
                    fontWeight: 800,
                    color: "#FF6B35",
                    fontSize: "0.85rem",
                  }}
                >
                  ${parseFloat(item.subtotal).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #E5E5E5",
            }}
          >
            <p
              style={{ fontSize: "0.8rem", color: "#9E9E9E", fontWeight: 600 }}
            >
              📍 {order.delivery_address}, {order.city}
            </p>
            <p
              style={{ fontSize: "0.8rem", color: "#9E9E9E", fontWeight: 600 }}
            >
              📧 {order.customer_email}
            </p>
            {order.notes && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#9E9E9E",
                  fontWeight: 600,
                }}
              >
                📝 {order.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await api.get("/rest/v1/orders?order=created_at.desc");
      const data = res.data || [];
      setOrders(data);

      // Calculate stats
      const s = {
        total: data.length,
        revenue: data
          .filter((o) => o.status === "delivered")
          .reduce((sum, o) => sum + parseFloat(o.total_amount), 0),
        pending: data.filter((o) => o.status === "pending").length,
        delivered: data.filter((o) => o.status === "delivered").length,
      };
      setStats(s);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleStatusChange(orderId, newStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  }

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const statCards = [
    { label: "Total Orders", value: stats.total || 0, color: "#3B82F6" },
    { label: "Pending", value: stats.pending || 0, color: "#FFB800" },
    { label: "Delivered", value: stats.delivered || 0, color: "#22C55E" },
    {
      label: "Revenue",
      value: `$${(stats.revenue || 0).toFixed(2)}`,
      color: "#FF6B35",
    },
  ];

  return (
    <div>
      <h1
        style={{
          fontFamily: "Boogaloo, cursive",
          fontSize: "2rem",
          color: "#2C1810",
          marginBottom: "1rem",
        }}
      >
        Orders 📦
      </h1>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "0.85rem 1rem",
              border: "1px solid #E5E5E5",
            }}
          >
            <p
              style={{
                color: "#9E9E9E",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginBottom: "2px",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: "1.5rem",
                color: s.color,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: "1px solid",
              borderColor: filter === s ? "#FF6B35" : "#E5E5E5",
              backgroundColor: filter === s ? "#FFF3E0" : "#fff",
              color: filter === s ? "#FF6B35" : "#9E9E9E",
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            {s === "all"
              ? "All"
              : s
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
            (
            {s === "all"
              ? orders.length
              : orders.filter((o) => o.status === s).length}
            )
          </button>
        ))}
      </div>

      {/* Table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
          gap: "1rem",
          padding: "0.5rem 1.25rem",
          backgroundColor: "#F5F5F5",
          borderRadius: "10px",
          marginBottom: "0.5rem",
        }}
      >
        {["Order", "Customer", "Total", "Status", ""].map((h) => (
          <p
            key={h}
            style={{
              fontWeight: 800,
              color: "#9E9E9E",
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            {h}
          </p>
        ))}
      </div>

      {/* Scrollable orders container */}
      <div
        className="orders-scroll"
        style={{
          height: "calc(100vh - 300px)",
          overflowY: "auto",
          paddingRight: "4px",
          paddingBottom: "1rem",
        }}
      >
        {loading ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "14px",
                  height: "72px",
                  opacity: 0.5,
                  border: "1px solid #E5E5E5",
                }}
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <Package
              size={48}
              style={{ color: "#E5E5E5", margin: "0 auto 1rem" }}
            />
            <p style={{ fontWeight: 700, color: "#9E9E9E" }}>No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
