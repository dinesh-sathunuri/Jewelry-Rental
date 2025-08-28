import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { productApi, orderApi } from "../api";
import Sidebar from "../Components/Sidebar";
import "../styles/AddOrder.css";

export default function AddOrder() {
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    productIds: [],
    totalPrice: 0,
    discount: 0,
    startDate: "",
    endDate: "",
    paymentMethod: "",
    customer: { fullName: "", email: "", phoneNumber: "" },
  });
  const [searchId, setSearchId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const searchRef = useRef(null);
const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Handle clicks outside search bars to hide suggestions
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
useEffect(() => {
  const total = calculateTotalPrice(
    order.productIds,
    order.startDate,
    order.endDate,
    order.discount,
    products
  );
  setOrder((prev) => ({ ...prev, totalPrice: total }));
}, [order.productIds, order.startDate, order.endDate, order.discount, products]);
  const fetchProducts = async () => {
    try {
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      alert("Failed to fetch products: " + error.message);
    }
  };

const calculateTotalPrice = (productIds, startDate, endDate, discount, products) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0;

  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const total = productIds.reduce((sum, id) => {
    const product = products.find((p) => p.id.toString() === id);
    return sum + (product?.pricePerDay || 0) * days;
  }, 0);

  const validDiscount = discount >= 0 && discount <= 100 ? discount : 0;
  return total * (1 - validDiscount / 100);
};

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);
    setShowSuggestions(value.length > 0);

    if (value.length > 0) {
    const filteredSuggestions = products
      .filter(
        (p) =>
          p.id.toString().startsWith(value) &&
          !order.productIds.includes(p.id.toString()) &&
          p.status === "AVAILABLE"
      )
      .map((p) => p.id.toString())
      .slice(0, 5);

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (id) => {
    const product = products.find((p) => p.id.toString() === id);
    if (!product || product.status !== "AVAILABLE") {
      alert("This product is not available.");
      return;
    }

    setOrder((prev) => ({
      ...prev,
      productIds: [...prev.productIds, id],
    }));
    setSearchId("");
    setShowSuggestions(false);
  };


  const removeProduct = (id) => {
    setOrder((prev) => ({
      ...prev,
      productIds: prev.productIds.filter((pid) => pid !== id),
      totalPrice: calculateTotalPrice(),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (order.productIds.length === 0) {
      alert("Please select at least one product.");
      return;
    }
    if (!order.customer.fullName || !order.customer.email || !order.customer.phoneNumber) {
      alert("Please fill out all customer details.");
      return;
    }
    if (!order.startDate || !order.endDate || !order.paymentMethod) {
      alert("Please fill out all order details.");
      return;
    }
    if (new Date(order.endDate) < new Date(order.startDate)) {
      alert("End date must be after start date.");
      return;
    }
    if (isNaN(order.totalPrice)) {
      alert("Total price is invalid.");
      return;
    }
    try {
      const orderData = {
        ...order,
        totalPrice: Number(calculateTotalPrice(order.productIds, order.startDate, order.endDate, order.discount, products)),
        startDate: new Date(order.startDate).toISOString(),
        endDate: new Date(order.endDate).toISOString(),
      };
      setLoading(true);
      await orderApi.create(orderData);
      alert("Order created successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      alert("Failed to create order: " + error.message);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-order-page">
      <div className="dashboard-container">
        <Sidebar />
        <div className="order-form">
          <h2>Create New Order</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Customer Details</h3>
              <div className="form-row">
                <label>
                  Full Name:
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={order.customer.fullName}
                    onChange={(e) =>
                      setOrder((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, fullName: e.target.value },
                      }))
                    }
                    required
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={order.customer.email}
                    onChange={(e) =>
                      setOrder((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, email: e.target.value },
                      }))
                    }
                    required
                  />
                </label>
                <label>
                  Phone Number:
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={order.customer.phoneNumber}
                    onChange={(e) =>
                      setOrder((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, phoneNumber: e.target.value },
                      }))
                    }
                    required
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Order Details</h3>
              <div className="form-row">
                <label>
                  Start Date:
                  <input
                    type="date"
                    value={order.startDate}
                    onChange={(e) => setOrder((prev) => ({ ...prev, startDate: e.target.value, totalPrice: calculateTotalPrice() }))}
                    required
                  />
                </label>
                <label>
                  End Date:
                  <input
                    type="date"
                    value={order.endDate}
                    onChange={(e) => setOrder((prev) => ({ ...prev, endDate: e.target.value, totalPrice: calculateTotalPrice() }))}
                    required
                  />
                </label>
                <label>
                  Payment Method:
                  <select
                    value={order.paymentMethod}
                    onChange={(e) => setOrder((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                    required
                  >
                    <option value="">Select payment method</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="CASH">Cash</option>
                  </select>
                </label>
                <label>
                  Discount (%):
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    placeholder="Enter discount (0-100)"
                    value={order.discount}
                    onChange={(e) => setOrder((prev) => ({ ...prev, discount: Number(e.target.value), totalPrice: calculateTotalPrice() }))}
                  />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Products</h3>
              <div className="form-row">
                <div className="search-container" ref={searchRef}>
                  <input
                    type="text"
                    placeholder="Search by Product ID"
                    value={searchId}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {suggestions.map((id) => (
                  <li key={id} className="suggestion-item" onClick={() => handleSuggestionClick(id)}>
                    ID: {id} | Tag: {products.find(p => p.id.toString() === id)?.tag}
                  </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {order.productIds.length > 0 && (
                <div className="selected-products">
                  <h4>Selected Products:</h4>
                  <ul>
                    {order.productIds.map((id) => {
                      const product = products.find((p) => p.id.toString() === id);
                      return (
                        <li key={id} className="product-item">
                          {product?.productImages?.length > 0 && (
                            <img
                              src={`${product.productImages[0].imageUrl}`}
                              alt={`Product ${id}`}
                              className="product-image"
                            />
                          )}
                          <span className="product-info">
                            ID: {id} | Tag: {product?.tag || "N/A"}
                          </span>
                          <button
                            type="button"
                            className="remove-product"
                            onClick={() => removeProduct(id)}
                          >
                            ×
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <p><strong>Total Price (after {order.discount}% discount):</strong> ${order.totalPrice.toFixed(2)}</p>
                </div>
              )}
            </div>

            <button type="submit">Create Order</button>
          </form>
          {loading && (
            <div className="loading-overlay">
              <div className="spinner" />
              <p>Creating order, please wait...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}