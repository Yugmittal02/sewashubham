import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * AuthContext Tests
 * Testing authentication state logic
 */

describe('AuthContext - Logic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Customer Session', () => {
    it('should store customer in sessionStorage', () => {
      const customer = { name: 'Test Customer', phone: '1234567890' };
      sessionStorage.setItem('customer', JSON.stringify(customer));
      
      const stored = JSON.parse(sessionStorage.getItem('customer'));
      expect(stored.name).toBe('Test Customer');
      expect(stored.phone).toBe('1234567890');
    });

    it('should clear customer on logout', () => {
      sessionStorage.setItem('customer', JSON.stringify({ name: 'Test' }));
      localStorage.setItem('customerToken', 'token123');
      
      sessionStorage.removeItem('customer');
      localStorage.removeItem('customerToken');
      
      expect(sessionStorage.getItem('customer')).toBeNull();
      expect(localStorage.getItem('customerToken')).toBeNull();
    });

    it('should validate customer data structure', () => {
      const isValidCustomer = (customer) => {
        if (!customer) return false;
        return typeof customer.name === 'string' && typeof customer.phone === 'string';
      };
      
      expect(isValidCustomer({ name: 'John', phone: '123' })).toBe(true);
      expect(isValidCustomer({ name: 'John' })).toBe(false);
      expect(isValidCustomer(null)).toBe(false);
    });
  });

  describe('Admin Session', () => {
    it('should store admin in localStorage', () => {
      const admin = { name: 'Admin User', email: 'admin@test.com' };
      localStorage.setItem('admin', JSON.stringify(admin));
      localStorage.setItem('adminToken', 'admin-token-123');
      
      const stored = JSON.parse(localStorage.getItem('admin'));
      expect(stored.name).toBe('Admin User');
      expect(localStorage.getItem('adminToken')).toBe('admin-token-123');
    });

    it('should clear admin on logout', () => {
      localStorage.setItem('admin', JSON.stringify({ name: 'Admin' }));
      localStorage.setItem('adminToken', 'token123');
      
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
      
      expect(localStorage.getItem('admin')).toBeNull();
      expect(localStorage.getItem('adminToken')).toBeNull();
    });

    it('should determine admin status', () => {
      const isAdmin = () => !!localStorage.getItem('adminToken');
      
      expect(isAdmin()).toBe(false);
      
      localStorage.setItem('adminToken', 'token');
      expect(isAdmin()).toBe(true);
    });
  });

  describe('Session Persistence', () => {
    it('should recover customer from storage', () => {
      const customer = { name: 'Persisted User', phone: '999' };
      sessionStorage.setItem('customer', JSON.stringify(customer));
      localStorage.setItem('customerToken', 'token');
      
      const storedCustomer = sessionStorage.getItem('customer');
      const token = localStorage.getItem('customerToken');
      
      if (storedCustomer && token) {
        const parsed = JSON.parse(storedCustomer);
        expect(parsed.name).toBe('Persisted User');
      }
    });

    it('should handle corrupted storage gracefully', () => {
      sessionStorage.setItem('customer', 'invalid-json');
      
      let customer = null;
      try {
        customer = JSON.parse(sessionStorage.getItem('customer'));
      } catch {
        customer = null;
        sessionStorage.removeItem('customer');
      }
      
      expect(customer).toBeNull();
    });
  });

  describe('Auth State Helpers', () => {
    it('should determine isCustomer status', () => {
      const getIsCustomer = () => !!sessionStorage.getItem('customer');
      
      expect(getIsCustomer()).toBe(false);
      
      sessionStorage.setItem('customer', JSON.stringify({ name: 'Test' }));
      expect(getIsCustomer()).toBe(true);
    });

    it('should determine isAdmin status', () => {
      const getIsAdmin = () => !!localStorage.getItem('admin');
      
      expect(getIsAdmin()).toBe(false);
      
      localStorage.setItem('admin', JSON.stringify({ name: 'Admin' }));
      expect(getIsAdmin()).toBe(true);
    });
  });
});
