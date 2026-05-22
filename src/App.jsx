import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import useAuthStore from "./store/authStore";
import useWishlistStore from "./store/wishlistStore";
import AdminRedirect from "./components/AdminRedirect";

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const init = useAuthStore((state) => state.init);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const user = useAuthStore((state) => state.user);

  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    if (user) fetchWishlist(user.id);
  }, [user]);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#FFF9F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Boogaloo, cursive",
            fontSize: "2.5rem",
            color: "#FF6B35",
          }}
        >
          Yum<span style={{ color: "#FFB800" }}>pora</span>
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-cream">
      <Routes>
        {/* Admin routes — no Navbar */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Public routes — with Navbar */}
        <Route
          path="/*"
          element={
            <AdminRedirect>
              <>
                <Navbar onCartClick={() => setCartOpen(true)} />
                <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Routes>
              </>
            </AdminRedirect>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
