import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('amazon_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('amazon_token');
    }
    return Promise.reject(error);
  }
);

// =====================
// PRODUCTS
// =====================
export const getProducts = (params) => api.get('/products', { params });
export const getFeaturedProducts = () => api.get('/products/featured');
export const getProduct = (id) => api.get(`/products/${id}`);

// =====================
// CATEGORIES
// =====================
export const getCategories = () => api.get('/categories');
export const getCategory = (slug) => api.get(`/categories/${slug}`);

// =====================
// CART
// =====================
export const getCart = () => api.get('/cart');
export const addToCart = (product_id, quantity = 1) => api.post('/cart', { product_id, quantity });
export const updateCartItem = (cartId, quantity) => api.put(`/cart/${cartId}`, { quantity });
export const removeCartItem = (cartId) => api.delete(`/cart/${cartId}`);
export const clearCart = () => api.delete('/cart');

// =====================
// ORDERS
// =====================
export const getOrders = (params) => api.get('/orders', { params });
export const getOrder = (orderId) => api.get(`/orders/${orderId}`);
export const placeOrder = (orderData) => api.post('/orders', orderData);
export const cancelOrder = (orderId) => api.put(`/orders/${orderId}/cancel`);

// =====================
// AUTH
// =====================
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// =====================
// WISHLIST
// =====================
export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (product_id) => api.post('/wishlist', { product_id });
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);
export const checkWishlist = (productId) => api.get(`/wishlist/check/${productId}`);

export default api;
