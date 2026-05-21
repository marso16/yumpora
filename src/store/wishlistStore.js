import { create } from "zustand";
import { supabase } from "../lib/supabase";
import api from "../lib/axios";

const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async (userId) => {
    set({ loading: true });
    try {
      const res = await api.get(
        `/rest/v1/wishlist?user_id=eq.${userId}&select=*,products(*)`,
      );
      set({ items: res.data || [] });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      set({ loading: false });
    }
  },

  addToWishlist: async (userId, productId) => {
    try {
      await api.post("/rest/v1/wishlist", {
        user_id: userId,
        product_id: productId,
      });
      await get().fetchWishlist(userId);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  },

  removeFromWishlist: async (userId, productId) => {
    try {
      await api.delete(
        `/rest/v1/wishlist?user_id=eq.${userId}&product_id=eq.${productId}`,
      );
      set({
        items: get().items.filter((i) => i.product_id !== productId),
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  },

  isWishlisted: (productId) => {
    return get().items.some((i) => i.product_id === productId);
  },

  toggleWishlist: async (userId, productId) => {
    const wishlisted = get().isWishlisted(productId);
    if (wishlisted) {
      await get().removeFromWishlist(userId, productId);
    } else {
      await get().addToWishlist(userId, productId);
    }
  },
}));

export default useWishlistStore;
