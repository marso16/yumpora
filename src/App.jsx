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
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import useAuthStore from "./store/authStore";
import useWishlistStore from "./store/wishlistStore";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const init = useAuthStore((state) => state.init);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    if (user) fetchWishlist(user.id);
  }, [user]);

  return (
    <div className="min-h-screen bg-cream">
      <Routes>
        {/* Admin routes — no Navbar */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Public routes — with Navbar */}
        <Route
          path="/*"
          element={
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
          }
        />
      </Routes>
    </div>
  );
}

export default App;
