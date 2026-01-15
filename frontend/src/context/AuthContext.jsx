import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for customer in sessionStorage
        const storedCustomer = sessionStorage.getItem('customer');
        const customerToken = localStorage.getItem('customerToken');
        
        if (storedCustomer && customerToken) {
            setCustomer(JSON.parse(storedCustomer));
        } else {
            // Invalid state: Clear potential leftovers
            sessionStorage.removeItem('customer');
            localStorage.removeItem('customerToken');
        }

        // Check for admin in localStorage
        const storedAdmin = localStorage.getItem('admin');
        const token = localStorage.getItem('adminToken');
        if (storedAdmin && token) {
            setAdmin(JSON.parse(storedAdmin));
        }
        
        setLoading(false);
    }, []);

    // Customer entry (API-based with token)
    const enterAsCustomer = async (name, phone) => {
        try {
            const { data } = await API.post('/auth/customer', { name, phone });
            
            // Store token and user data
            localStorage.setItem('customerToken', data.token);
            sessionStorage.setItem('customer', JSON.stringify(data.user));
            
            // Clear potential admin session to avoid conflicts
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            setAdmin(null);

            setCustomer(data.user);
            return { success: true };
        } catch (error) {
            console.error('Customer login failed:', error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    // Admin login (JWT-based)
    const adminLogin = async (email, password) => {
        try {
            const { data } = await API.post('/auth/admin/login', { email, password });
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('admin', JSON.stringify(data.user));
            setAdmin(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        // Clear customer session
        sessionStorage.removeItem('customer');
        setCustomer(null);
        
        // Clear admin session
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        setAdmin(null);
    };

    const logoutCustomer = () => {
        sessionStorage.removeItem('customer');
        localStorage.removeItem('customerToken');
        setCustomer(null);
    };

    const logoutAdmin = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ 
            customer, 
            admin, 
            loading, 
            enterAsCustomer, 
            adminLogin, 
            logout,
            logoutCustomer,
            logoutAdmin,
            isCustomer: !!customer,
            isAdmin: !!admin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
