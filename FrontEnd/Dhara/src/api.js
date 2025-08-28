// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});
  
api.interceptors.request.use((config) => {
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
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
update: (id, request, imageFiles, existingImages = []) => {
  const formData = new FormData();

  // Merge existing productImages (filenames or IDs)
  const updatedRequest = {
    ...request,
    productImages: existingImages, // ensure this is passed correctly
  };

  formData.append(
    "request",
    new Blob([JSON.stringify(updatedRequest)], { type: "application/json" })
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
  login: (request) => api.post("/admin/login", request),
};

export const orderApi = {
  create: (orderData) => {
    return api.post("/orders", orderData, {
      headers: { "Content-Type": "application/json" },
    });
  },
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  getByProductId: (productId) => api.get(`/orders/product/${productId}`),
};
export const customerApi = {
  getByEmail: (email) => api.get(`/customers/email/${email}`),
};

export default api;