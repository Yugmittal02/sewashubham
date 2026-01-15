import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

// Protected Route for Admin
const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return isAdmin ? children : <Navigate to="/admin/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Welcome />} />
                        <Route path="/menu" element={<Home />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/order-success" element={<OrderSuccess />} />
                        <Route path="/dashboard" element={<UserDashboard />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                        
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;
