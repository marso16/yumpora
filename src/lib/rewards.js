export const ORDERS_PER_TIER = 10;

export function getTierInfo(completedOrders, totalTiersClaimed) {
  // How many tiers has the customer unlocked in total
  const tiersUnlocked = Math.floor(completedOrders / ORDERS_PER_TIER);

  // How many unclaimed tiers do they have
  const unclaimedTiers = tiersUnlocked - totalTiersClaimed;

  // Current tier number (next one to claim)
  const nextTierNumber = totalTiersClaimed + 1;

  // Reward for next tier
  const nextRewardAmount = getRewardForTier(nextTierNumber);

  // Progress toward next unlock
  const ordersIntoCurrentTier = completedOrders % ORDERS_PER_TIER;
  const progressPercent = (ordersIntoCurrentTier / ORDERS_PER_TIER) * 100;

  return {
    completedOrders,
    tiersUnlocked,
    totalTiersClaimed,
    unclaimedTiers,
    hasReward: unclaimedTiers > 0,
    nextTierNumber,
    nextRewardAmount,
    ordersIntoCurrentTier,
    ordersUntilNextTier: ORDERS_PER_TIER - ordersIntoCurrentTier,
    progressPercent,
  };
}

export function getRewardForTier(tierNumber) {
  // Tier 1 = $2, Tier 2 = $2.50, Tier 3 = $3.00 ...
  return parseFloat((2 + (tierNumber - 1) * 0.5).toFixed(2));
}

export function getTierLabel(tierNumber) {
  return `Tier ${tierNumber}`;
}
