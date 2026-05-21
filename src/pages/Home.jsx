import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Globe, Package } from "lucide-react";
import api from "../lib/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get(
          "/rest/v1/products?is_featured=eq.true&is_available=eq.true&limit=4",
        ),
        api.get("/rest/v1/categories?limit=6"),
      ]);
      setFeaturedProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const categoryEmojis = {
    chocolate: "🍫",
    "chips-crisps": "🍟",
    "candy-gummies": "🍬",
    "cookies-biscuits": "🍪",
    drinks: "🧃",
    "mixed-snacks": "🎁",
  };

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-secondary text-dark text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              🌍 Snacks from 30+ Countries
            </span>
            <h1 className="font-display text-5xl md:text-7xl text-dark leading-tight mb-4">
              Snacks From
              <span className="text-primary"> Around</span>
              <br />
              the World
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              Discover exotic chocolates, chips, candies and more — delivered
              straight to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-colors"
              >
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link
                to="/categories"
                className="flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-2 gap-4 max-w-xs">
              {["🍫", "🍟", "🍬", "🍪"].map((emoji, i) => (
                <div
                  key={i}
                  className="bg-white w-32 h-32 rounded-3xl flex items-center justify-center text-5xl shadow-sm border border-orange-100"
                  style={{
                    transform: i % 2 === 0 ? "rotate(-3deg)" : "rotate(3deg)",
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="py-10 bg-primary">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-white text-center">
          {[
            {
              icon: <Globe size={28} />,
              title: "30+ Countries",
              desc: "Sourced from around the world",
            },
            {
              icon: <Zap size={28} />,
              title: "Fast Delivery",
              desc: "Quick delivery to your door",
            },
            {
              icon: <Package size={28} />,
              title: "Cash on Delivery",
              desc: "Pay when you receive",
            },
          ].map((perk, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {perk.icon}
              <p className="font-bold text-lg">{perk.title}</p>
              <p className="text-orange-100 text-sm">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-4xl text-dark">
              Shop by Category
            </h2>
            <Link
              to="/categories"
              className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="bg-white border border-orange-100 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary hover:shadow-sm transition-all group"
              >
                <span className="text-4xl">
                  {categoryEmojis[cat.slug] || "🍿"}
                </span>
                <span className="font-bold text-sm text-center text-dark group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-4xl text-dark">Featured Snacks</h2>
            <Link
              to="/shop"
              className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all"
            >
              View all <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-72 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white py-10 px-4 text-center">
        <p className="font-display text-2xl mb-2">
          Yum<span className="text-secondary">pora</span>
        </p>
        <p className="text-gray-400 text-sm">
          © 2026 Yumpora. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
