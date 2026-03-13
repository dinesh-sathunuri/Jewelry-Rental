// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Attach Basic Auth header on every request if credentials are stored
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("adminCredentials");
  if (stored) {
    const { username, password } = JSON.parse(stored);
    const token = btoa(`${username}:${password}`);
    config.headers["Authorization"] = `Basic ${token}`;
  }
  return config;
});

export const productApi = {
  getAll: () => api.get("/products/all"),
  getById: (id) => api.get(`/products/${id}`),
  create: (request, imageFiles) => {
    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
    imageFiles.forEach(file => {
      formData.append("images", file);
    });
    return api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, request, imageFiles) => {
    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );
    imageFiles.forEach(file => {
      formData.append("images", file);
    });
    return api.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => api.delete(`/products/${id}`),
};

export const adminApi = {
  register: (request) => api.post("/admin/register", request),
  // Login uses explicit Basic Auth — credentials not yet stored at call time
  login: (username, password) =>
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/login`,
      {},
      {
        headers: {
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
      }
    ),
};

export const orderApi = {
  create: (orderData) =>
    api.post("/orders", orderData, {
      headers: { "Content-Type": "application/json" },
    }),
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  getByProductId: (productId) => api.get(`/orders/product/${productId}`),
};

export const customerApi = {
  getByEmail: (email) => api.get(`/customers/email/${email}`),
};

export default api;