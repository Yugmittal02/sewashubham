import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Interceptor to add admin token to requests
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Auth
export const registerCustomer = (data) => API.post('/auth/customer', data);
export const adminLogin = (data) => API.post('/auth/admin/login', data);

// Products
export const fetchProducts = (category) => API.get(`/products${category ? `?category=${category}` : ''}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const toggleProductAvailability = (id) => API.patch(`/products/${id}/toggle-availability`);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const fetchMyOrders = () => API.get('/orders/my-orders');
export const fetchAllOrders = () => API.get('/orders/all');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Offers
export const fetchOffers = () => API.get('/offers');
export const fetchAllOffersAdmin = () => API.get('/offers/admin');
export const createOffer = (data) => API.post('/offers', data);
export const updateOffer = (id, data) => API.put(`/offers/${id}`, data);
export const deleteOffer = (id) => API.delete(`/offers/${id}`);
export const validateCoupon = (code, orderTotal) => API.post('/offers/validate', { code, orderTotal });

// Ratings
export const submitRating = (data) => API.post('/ratings', data);
export const fetchProductRatings = (productId) => API.get(`/ratings/product/${productId}`);
export const fetchAllRatings = () => API.get('/ratings/all');

// Upload
export const uploadImage = (formData) => API.post('/upload/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;
