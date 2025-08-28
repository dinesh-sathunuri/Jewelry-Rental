import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { productApi } from "../api";
import ProductCardSkeleton from "../Components/ProductCardSkeleton";
import {
  TAG_OPTIONS,
  LENGTH_OPTIONS,
  DESIGN_OPTIONS,
  MATERIAL_OPTIONS,
  COLOR_OPTIONS,
} from "../Constants/productOptions";
import Select from "react-select";
import "../styles/Dashboard.css";
import Sidebar from "../Components/Sidebar";
const ITEMS_PER_PAGE = 6;

export default function Dashboard() {
  const { admin } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    tag: [],
    design: [],
    color: [],
    material: "",
    length: "",
    minPrice: "",
    maxPrice: "",
    searchId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [products, filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      alert("Failed to fetch products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.searchId) {
      filtered = filtered.filter((p) => p.id.toString().includes(filters.searchId));
    }
    if (filters.tag.length) {
      filtered = filtered.filter((p) =>
        p.tag && filters.tag.some((tag) => p.tag.includes(tag))
      );
    }
    if (filters.design.length) {
      filtered = filtered.filter((p) =>
        p.design && filters.design.some((d) => p.design.includes(d))
      );
    }
    if (filters.color.length) {
      filtered = filtered.filter((p) =>
        p.color && filters.color.some((c) => p.color.includes(c))
      );
    }
    if (filters.material) {
      filtered = filtered.filter(
        (p) => p.material && p.material.toLowerCase() === filters.material.toLowerCase()
      );
    }
    if (filters.length) {
      filtered = filtered.filter(
        (p) => p.length && p.length.toLowerCase() === filters.length.toLowerCase()
      );
    }
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.pricePerDay >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.pricePerDay <= parseFloat(filters.maxPrice));
    }

    setFilteredProducts(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, searchId: value });
    setShowSuggestions(value.length > 0);

    if (value.length > 0) {
      const filteredSuggestions = products
        .filter((p) => p.id.toString().startsWith(value))
        .map((p) => p.id.toString())
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (id) => {
    setFilters({ ...filters, searchId: id });
    setShowSuggestions(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productApi.delete(id);
      fetchProducts();
    } catch (error) {
      alert("Failed to delete product: " + error.message);
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  if (!admin) return <p>Please log in</p>;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <h3>Manage Products</h3>

        <div className="search-container" ref={searchRef}>
          <input
            type="text"
            placeholder="Search by Product ID"
            value={filters.searchId}
            onChange={handleSearchChange}
            className="search-input"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((id) => (
                <li
                  key={id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(id)}
                >
                  ID: {id}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="filters">
          <Select
            isMulti
            options={TAG_OPTIONS.map((t) => ({ value: t, label: t }))}
            placeholder="Filter Tags"
            value={filters.tag.map((t) => ({ value: t, label: t }))}
            onChange={(selected) =>
              setFilters({ ...filters, tag: selected.map((s) => s.value) })
            }
          />

          <Select
            isMulti
            options={DESIGN_OPTIONS.map((d) => ({ value: d, label: d }))}
            placeholder="Filter Designs"
            value={filters.design.map((d) => ({ value: d, label: d }))}
            onChange={(selected) =>
              setFilters({ ...filters, design: selected.map((s) => s.value) })
            }
          />

          <Select
            isMulti
            options={COLOR_OPTIONS.map((c) => ({ value: c, label: c }))}
            placeholder="Filter Colors"
            value={filters.color.map((c) => ({ value: c, label: c }))}
            onChange={(selected) =>
              setFilters({ ...filters, color: selected.map((s) => s.value) })
            }
          />

          <select
            value={filters.material}
            onChange={(e) => setFilters({ ...filters, material: e.target.value })}
          >
            <option value="">All Materials</option>
            {MATERIAL_OPTIONS.map((mat) => (
              <option key={mat} value={mat}>
                {mat}
              </option>
            ))}
          </select>

          <select
            value={filters.length}
            onChange={(e) => setFilters({ ...filters, length: e.target.value })}
          >
            <option value="">All Lengths</option>
            {LENGTH_OPTIONS.map((len) => (
              <option key={len} value={len}>
                {len}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            min="0"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Price"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>

<div className="Dashboard-product-grid">
  {loading ? (
    // Show skeleton loaders while loading
    [...Array(ITEMS_PER_PAGE)].map((_, idx) => <ProductCardSkeleton key={idx} />)
  ) : paginatedProducts.length === 0 ? (
    <p style={{ textAlign: "center", color: "#4b5563" }}>No products found.</p>
  ) : (
    paginatedProducts.map((product) => (
      <div key={product.id} className="Dashboard-product-card">
        {product.productImages && product.productImages.length > 0 && (
          <div className="Dashboard-product-image-wrapper">
            <img
              src={product.productImages[0].imageUrl}
              alt={`Product ${product.id}`}
              className={`Dashboard-product-image ${loaded ? "loaded" : ""}`}
              onLoad={() => setLoaded(true)}
            />
          </div>
        )}

        <h4 className="Dashboard-product-id">ID: {product.id}</h4>
        <h4 className="Dashboard-product-title">{product.title}</h4>
        <div className="Dashboard-product-info">
          <p><strong>Price/Day:</strong> ${product.pricePerDay || 0}</p>
          <p><strong>Status:</strong> {product.status || "N/A"}</p>
          <p><strong>Last Modified By:</strong> {product.lastModifiedBy?.username || "N/A"}</p>
          <p><strong>Updated:</strong> {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "N/A"}</p>
        </div>

        <div className="actions">
          <button
            className="edit-btn"
            onClick={() => navigate(`/edit-product/${product.id}`)}
          >
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={() => handleDelete(product.id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}
</div>


        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  className={pageNum === currentPage ? "active-page" : ""}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
