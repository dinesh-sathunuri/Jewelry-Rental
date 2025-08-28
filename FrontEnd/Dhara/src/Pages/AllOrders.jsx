import React, { useEffect, useState } from "react";
import { orderApi } from "../api";
import Sidebar from "../Components/Sidebar";
import "../styles/AllOrders.css";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderIds, setExpandedOrderIds] = useState(new Set());
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getAll();
        setOrders(res.data);
      } catch (err) {
        alert("Failed to fetch orders: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredOrders = orders
    .filter((order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (!valA || !valB) return 0;

      if (sortBy === "totalPrice") {
        return sortOrder === "asc"
          ? parseFloat(valA) - parseFloat(valB)
          : parseFloat(valB) - parseFloat(valA);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="all-orders-page">
      <Sidebar />
      <div className="orders-table-container">
        <h2>All Orders</h2>

        <div className="controls">
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th></th>
              <th onClick={() => handleSort("id")}>
                Order ID {sortBy === "id" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("customerName")}>
                Customer
              </th>
              <th onClick={() => handleSort("totalPrice")}>
                Total Price {sortBy === "totalPrice" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("startDate")}>
                Start Date {sortBy === "startDate" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("endDate")}>
                End Date {sortBy === "endDate" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
              <th>Payment Method</th>
              <th onClick={() => handleSort("createdAt")}>
                Created At {sortBy === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8">No orders found.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isExpanded = expandedOrderIds.has(order.id);
                return (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td>
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="expand-btn"
                        >
                          {isExpanded ? "−" : "+"}
                        </button>
                      </td>
                      <td>{order.id}</td>
                      <td>{order.customer?.fullName || "N/A"}</td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>{new Date(order.startDate).toLocaleDateString()}</td>
                      <td>{new Date(order.endDate).toLocaleDateString()}</td>
                      <td>{order.paymentMethod}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="expanded-row">
                        <td colSpan="8">
                          <div className="expanded-content">
                            <div>
                              <strong>Customer Details:</strong>
                              <p>Email: {order.customer?.email || "N/A"}</p>
                              <p>Phone: {order.customer?.phoneNumber || "N/A"}</p>
                            </div>
                            <div>
                              <strong>Product IDs:</strong>
                              {order.productIds?.length > 0 ? (
                                <ul>
                                  {order.productIds.map((pid) => (
                                    <li key={pid}>{pid}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No products found.</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
