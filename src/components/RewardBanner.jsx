import { Gift, Star } from "lucide-react";
import { getTierInfo, ORDERS_PER_TIER } from "../lib/rewards";

const RewardBanner = ({ profile, onClaim, compact = false }) => {
  if (!profile) return null;

  const info = getTierInfo(
    profile.completed_orders || 0,
    profile.total_tiers_claimed || 0,
  );

  // COMPACT version — for checkout
  if (compact) {
    if (!info.hasReward) return null;
    return (
      <div
        style={{
          backgroundColor: "#FFFBEB",
          border: "1.5px solid #FDE68A",
          borderRadius: "14px",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Gift size={20} style={{ color: "#FFB800", flexShrink: 0 }} />
          <div>
            <p
              style={{ fontWeight: 800, color: "#2C1810", fontSize: "0.9rem" }}
            >
              🎉 You have a reward available!
            </p>
            <p
              style={{ color: "#9E9E9E", fontSize: "0.78rem", fontWeight: 600 }}
            >
              Tier {info.nextTierNumber} reward — $
              {info.nextRewardAmount.toFixed(2)} off
            </p>
          </div>
        </div>
        <button
          onClick={onClaim}
          style={{
            backgroundColor: "#FFB800",
            color: "#2C1810",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: "Nunito, sans-serif",
            fontWeight: 800,
            fontSize: "0.82rem",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Claim ${info.nextRewardAmount.toFixed(2)} off
        </button>
      </div>
    );
  }

  // FULL version — for orders page
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        border: "1.5px solid #FFE0B2",
        overflow: "hidden",
        marginBottom: "1.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFB800, #FF6B35)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Gift size={22} style={{ color: "#fff" }} />
          <p
            style={{
              fontFamily: "Boogaloo, cursive",
              fontSize: "1.4rem",
              color: "#fff",
            }}
          >
            Your Rewards
          </p>
        </div>
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.82rem",
            fontWeight: 700,
          }}
        >
          {info.completedOrders} orders completed
        </p>
      </div>

      <div style={{ padding: "1.25rem 1.5rem" }}>
        {/* Unclaimed reward */}
        {info.hasReward && (
          <div
            style={{
              backgroundColor: "#FFFBEB",
              border: "1.5px solid #FDE68A",
              borderRadius: "14px",
              padding: "1rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: 800,
                  color: "#2C1810",
                  fontSize: "0.95rem",
                }}
              >
                🎉 Tier {info.nextTierNumber} Reward Unlocked!
              </p>
              <p
                style={{
                  color: "#9E9E9E",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                Apply ${info.nextRewardAmount.toFixed(2)} off on your next order
              </p>
            </div>
            <div
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: "1.75rem",
                color: "#FFB800",
                flexShrink: 0,
              }}
            >
              ${info.nextRewardAmount.toFixed(2)}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div style={{ marginBottom: "0.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}
          >
            <span
              style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2C1810" }}
            >
              Progress to Tier {info.tiersUnlocked + 1}
            </span>
            <span
              style={{ fontSize: "0.8rem", fontWeight: 700, color: "#FF6B35" }}
            >
              {info.ordersIntoCurrentTier}/{ORDERS_PER_TIER} orders
            </span>
          </div>
          <div
            style={{
              height: "10px",
              backgroundColor: "#FFE0B2",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${info.progressPercent}%`,
                background: "linear-gradient(90deg, #FFB800, #FF6B35)",
                borderRadius: "20px",
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        {!info.hasReward && (
          <p style={{ fontSize: "0.78rem", color: "#9E9E9E", fontWeight: 600 }}>
            {info.ordersUntilNextTier} more order
            {info.ordersUntilNextTier !== 1 ? "s" : ""} until you unlock $
            {(2 + info.tiersUnlocked * 0.5).toFixed(2)} off!
          </p>
        )}

        {/* Tier list */}
        <div
          style={{
            marginTop: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <p
            style={{
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "#9E9E9E",
              marginBottom: "4px",
            }}
          >
            TIER REWARDS
          </p>
          {[1, 2, 3, 4, 5].map((tier) => {
            const reward = 2 + (tier - 1) * 0.5;
            const ordersNeeded = tier * ORDERS_PER_TIER;
            const unlocked = info.completedOrders >= ordersNeeded;
            const claimed = info.totalTiersClaimed >= tier;
            return (
              <div
                key={tier}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  backgroundColor: unlocked ? "#FFF3E0" : "#F5F5F5",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Star
                    size={14}
                    style={{
                      color: unlocked ? "#FFB800" : "#BDBDBD",
                      fill: unlocked ? "#FFB800" : "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: unlocked ? "#2C1810" : "#BDBDBD",
                    }}
                  >
                    Tier {tier} — {ordersNeeded} orders
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      color: unlocked ? "#FF6B35" : "#BDBDBD",
                    }}
                  >
                    ${reward.toFixed(2)} off
                  </span>
                  {claimed && (
                    <span
                      style={{
                        backgroundColor: "#E5E5E5",
                        color: "#9E9E9E",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        padding: "2px 7px",
                        borderRadius: "20px",
                      }}
                    >
                      USED
                    </span>
                  )}
                  {unlocked && !claimed && (
                    <span
                      style={{
                        backgroundColor: "#FFB800",
                        color: "#2C1810",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        padding: "2px 7px",
                        borderRadius: "20px",
                      }}
                    >
                      READY
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardBanner;
