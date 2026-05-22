import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import { generateProductDescription } from "../../lib/gemini";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  origin_country: "",
  stock_quantity: "",
  category_id: "",
  is_featured: false,
  is_available: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function handleGenerateDescription() {
    if (!form.name) {
      toast.error("Please enter a product name first", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
      return;
    }

    setAiLoading(true);
    try {
      const cat = categories.find((c) => c.id === form.category_id);
      const description = await generateProductDescription({
        name: form.name,
        origin_country: form.origin_country,
        category: cat?.name,
      });
      setForm((f) => ({ ...f, description }));
      toast.success("Description generated! ✨", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    } catch (error) {
      console.error("AI error:", error);
      toast.error("Failed to generate description. Check your API key.", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    } finally {
      setAiLoading(false);
    }
  }

  async function fetchData() {
    setLoading(true);
    try {
      const [productsRes, catsRes] = await Promise.all([
        api.get("/rest/v1/products?order=created_at.desc"),
        api.get("/rest/v1/categories"),
      ]);
      setProducts(productsRes.data || []);
      setCategories(catsRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product) {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      origin_country: product.origin_country || "",
      stock_quantity: product.stock_quantity,
      category_id: product.category_id || "",
      is_featured: product.is_featured,
      is_available: product.is_available,
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  function handleNew() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity) || 0,
        category_id: form.category_id || null,
      };

      if (editingId) {
        const res = await api.patch(
          `/rest/v1/products?id=eq.${editingId}`,
          payload,
          {
            headers: { Prefer: "return=representation" },
          },
        );
        console.log("Update response:", res.status, res.data);
        toast.success("Product updated!", {
          style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
        });
      } else {
        const res = await api.post("/rest/v1/products", payload, {
          headers: { Prefer: "return=representation" },
        });
        console.log("Insert response:", res.status, res.data);
        toast.success("Product created!", {
          style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
        });
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchData();
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/rest/v1/products?id=eq.${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted", {
        style: { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #E5E5E5",
    borderRadius: "8px",
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.875rem",
    outline: "none",
    color: "#2C1810",
    backgroundColor: "#FAFAFA",
    boxSizing: "border-box",
  };

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <h1
          style={{
            fontFamily: "Boogaloo, cursive",
            fontSize: "2.5rem",
            color: "#2C1810",
          }}
        >
          Products 🍿
        </h1>
        <button
          onClick={handleNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#FF6B35",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #E5E5E5",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}
          >
            <h2
              style={{
                fontFamily: "Boogaloo, cursive",
                fontSize: "1.5rem",
                color: "#2C1810",
              }}
            >
              {editingId ? "Edit Product" : "New Product"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9E9E9E",
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#9E9E9E",
                }}
              >
                Product Name *
              </label>
              <input
                type="text"
                value={form.name}
                placeholder="e.g. Japanese Kit Kat"
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                style={{ ...inputStyle, marginTop: "4px" }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#9E9E9E",
                }}
              >
                Price ($) *
              </label>
              <input
                type="number"
                value={form.price}
                placeholder="0.00"
                step="0.01"
                min="0"
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                style={{ ...inputStyle, marginTop: "4px" }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#9E9E9E",
                }}
              >
                Origin Country
              </label>
              <input
                type="text"
                value={form.origin_country}
                placeholder="e.g. Japan"
                onChange={(e) =>
                  setForm((f) => ({ ...f, origin_country: e.target.value }))
                }
                style={{ ...inputStyle, marginTop: "4px" }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#9E9E9E",
                }}
              >
                Stock Quantity
              </label>
              <input
                type="number"
                value={form.stock_quantity}
                placeholder="0"
                min="0"
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock_quantity: e.target.value }))
                }
                style={{ ...inputStyle, marginTop: "4px" }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#9E9E9E",
                }}
              >
                Category
              </label>
              <select
                value={form.category_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category_id: e.target.value }))
                }
                style={{ ...inputStyle, marginTop: "4px", cursor: "pointer" }}
              >
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {categoryEmojis[cat.slug] || "🍿"} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "center",
                paddingTop: "1.5rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                  color: "#2C1810",
                  fontSize: "0.875rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_featured: e.target.checked }))
                  }
                />
                ⭐ Featured
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  fontWeight: 700,
                  color: "#2C1810",
                  fontSize: "0.875rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_available: e.target.checked }))
                  }
                />
                ✅ Available
              </label>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#9E9E9E",
                  }}
                >
                  Description
                </label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={aiLoading || !form.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: aiLoading ? "#BDBDBD" : "#6366F1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "5px 12px",
                    cursor: aiLoading || !form.name ? "not-allowed" : "pointer",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    transition: "background 0.2s",
                  }}
                >
                  {aiLoading ? <>⏳ Generating...</> : <>✨ Generate with AI</>}
                </button>
              </div>
              <textarea
                value={form.description}
                rows={3}
                placeholder="Write a description or click ✨ Generate with AI..."
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>

          <div
            style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}
          >
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: saving ? "#BDBDBD" : "#FF6B35",
                color: "#fff",
                padding: "10px 24px",
                borderRadius: "10px",
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              <Check size={16} />
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Create Product"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                border: "1px solid #E5E5E5",
                backgroundColor: "#fff",
                cursor: "pointer",
                fontFamily: "Nunito, sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#9E9E9E",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products table */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          border: "1px solid #E5E5E5",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
            gap: "1rem",
            padding: "0.85rem 1.25rem",
            backgroundColor: "#F5F5F5",
            borderBottom: "1px solid #E5E5E5",
          }}
        >
          {["Product", "Price", "Stock", "Category", "Status", "Actions"].map(
            (h) => (
              <p
                key={h}
                style={{
                  fontWeight: 800,
                  color: "#9E9E9E",
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </p>
            ),
          )}
        </div>

        {loading ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#9E9E9E",
              fontWeight: 600,
            }}
          >
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "#9E9E9E",
              fontWeight: 600,
            }}
          >
            No products yet. Add your first one!
          </div>
        ) : (
          products.map((product, i) => {
            const cat = categories.find((c) => c.id === product.category_id);
            return (
              <div
                key={product.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  alignItems: "center",
                  borderBottom:
                    i < products.length - 1 ? "1px solid #F5F5F5" : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FAFAFA")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {/* Name */}
                <div>
                  <p
                    style={{
                      fontWeight: 800,
                      color: "#2C1810",
                      fontSize: "0.875rem",
                    }}
                  >
                    {product.is_featured && "⭐ "}
                    {product.name}
                  </p>
                  <p style={{ color: "#9E9E9E", fontSize: "0.75rem" }}>
                    🌐 {product.origin_country || "—"}
                  </p>
                </div>

                {/* Price */}
                <p style={{ fontWeight: 800, color: "#FF6B35" }}>
                  ${parseFloat(product.price).toFixed(2)}
                </p>

                {/* Stock */}
                <p
                  style={{
                    fontWeight: 700,
                    color:
                      product.stock_quantity > 10
                        ? "#22C55E"
                        : product.stock_quantity > 0
                          ? "#FFB800"
                          : "#EF4444",
                    fontSize: "0.875rem",
                  }}
                >
                  {product.stock_quantity}
                </p>

                {/* Category */}
                <p
                  style={{
                    color: "#9E9E9E",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                  }}
                >
                  {cat ? `${categoryEmojis[cat.slug] || ""} ${cat.name}` : "—"}
                </p>

                {/* Status */}
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    backgroundColor: product.is_available
                      ? "#F0FFF4"
                      : "#FFF5F5",
                    color: product.is_available ? "#22C55E" : "#EF4444",
                  }}
                >
                  {product.is_available ? "Available" : "Unavailable"}
                </span>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      background: "#EFF6FF",
                      border: "none",
                      borderRadius: "7px",
                      padding: "6px 8px",
                      cursor: "pointer",
                      color: "#3B82F6",
                      display: "flex",
                      alignItems: "center",
                    }}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    style={{
                      background: "#FFF5F5",
                      border: "none",
                      borderRadius: "7px",
                      padding: "6px 8px",
                      cursor: "pointer",
                      color: "#EF4444",
                      display: "flex",
                      alignItems: "center",
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
