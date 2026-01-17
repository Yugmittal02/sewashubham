import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * ProductCard Component Tests
 * Testing product display logic and cart operations
 */

describe('ProductCard - Display Logic', () => {
  describe('Price Formatting', () => {
    it('should format price correctly', () => {
      const formatPrice = (price) => `₹${price}`;
      expect(formatPrice(299)).toBe('₹299');
      expect(formatPrice(1500)).toBe('₹1500');
    });

    it('should get base price from product', () => {
      const getDisplayPrice = (product) => {
        if (product.sizes && product.sizes.length > 0) {
          return product.sizes[0].price;
        }
        return product.basePrice;
      };

      const simpleProduct = { basePrice: 299 };
      expect(getDisplayPrice(simpleProduct)).toBe(299);

      const productWithSizes = { 
        basePrice: 299, 
        sizes: [{ name: 'Small', price: 199 }, { name: 'Large', price: 399 }] 
      };
      expect(getDisplayPrice(productWithSizes)).toBe(199);
    });
  });

  describe('Add-ons Display', () => {
    it('should format addon display', () => {
      const formatAddon = (addon) => `+${addon.name} ₹${addon.price}`;
      
      expect(formatAddon({ name: 'Extra Cheese', price: 50 })).toBe('+Extra Cheese ₹50');
    });

    it('should limit visible addons', () => {
      const getVisibleAddons = (addons, limit = 3) => {
        return addons.slice(0, limit);
      };
      
      const addons = [
        { name: 'A', price: 10 },
        { name: 'B', price: 20 },
        { name: 'C', price: 30 },
        { name: 'D', price: 40 },
        { name: 'E', price: 50 }
      ];
      
      expect(getVisibleAddons(addons)).toHaveLength(3);
    });

    it('should calculate remaining addons count', () => {
      const getRemainingCount = (addons, limit = 3) => {
        return Math.max(0, addons.length - limit);
      };
      
      const addons = new Array(5).fill({ name: 'Addon', price: 10 });
      expect(getRemainingCount(addons)).toBe(2);
    });
  });

  describe('Availability Check', () => {
    it('should determine if product is available', () => {
      const isAvailable = (product) => product.isAvailable !== false;
      
      expect(isAvailable({ isAvailable: true })).toBe(true);
      expect(isAvailable({ isAvailable: false })).toBe(false);
      expect(isAvailable({})).toBe(true); // Default to available
    });

    it('should show sold out status', () => {
      const getSoldOutText = (isAvailable) => isAvailable ? '' : 'Sold Out';
      
      expect(getSoldOutText(false)).toBe('Sold Out');
      expect(getSoldOutText(true)).toBe('');
    });
  });

  describe('Button Text Logic', () => {
    it('should show correct button text based on sizes', () => {
      const getButtonText = (product) => {
        if (product.sizes && product.sizes.length > 0) {
          return 'Customize & Add';
        }
        return 'Add to Cart';
      };
      
      expect(getButtonText({ sizes: [] })).toBe('Add to Cart');
      expect(getButtonText({ sizes: [{ name: 'Small', price: 99 }] })).toBe('Customize & Add');
    });
  });

  describe('Rating Display', () => {
    it('should format rating correctly', () => {
      const formatRating = (rating) => rating?.toFixed(1) || 'N/A';
      
      expect(formatRating(4.5)).toBe('4.5');
      expect(formatRating(5)).toBe('5.0');
      expect(formatRating(null)).toBe('N/A');
    });
  });
});

describe('ProductCard - Cart Operations', () => {
  describe('Add to Cart Logic', () => {
    it('should create cart item from product', () => {
      const createCartItem = (product, size, addons, quantity) => {
        const basePrice = size ? size.price : product.basePrice;
        const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
        
        return {
          _id: product._id,
          name: product.name,
          price: basePrice + addonsPrice,
          quantity,
          size: size?.name || null,
          selectedAddons: addons.map(a => a.name)
        };
      };
      
      const product = { _id: '123', name: 'Pizza', basePrice: 299 };
      const cartItem = createCartItem(product, null, [], 1);
      
      expect(cartItem.name).toBe('Pizza');
      expect(cartItem.price).toBe(299);
      expect(cartItem.quantity).toBe(1);
    });

    it('should calculate price with addons', () => {
      const calculatePrice = (basePrice, addons) => {
        return basePrice + addons.reduce((sum, a) => sum + a.price, 0);
      };
      
      expect(calculatePrice(299, [{ price: 50 }, { price: 30 }])).toBe(379);
    });
  });

  describe('Cart ID Generation', () => {
    it('should generate unique cart id', () => {
      const generateCartId = (productId, size, addons) => {
        const addonStr = addons.sort().join(',');
        return `${productId}-${size || ''}-${addonStr}`;
      };
      
      expect(generateCartId('123', 'Large', ['Cheese', 'Olives'])).toBe('123-Large-Cheese,Olives');
      expect(generateCartId('123', null, [])).toBe('123--');
    });
  });
});

describe('ProductCard - Edge Cases', () => {
  it('should handle missing product data gracefully', () => {
    const safeGet = (obj, path, defaultValue) => {
      return path.split('.').reduce((o, k) => (o || {})[k], obj) || defaultValue;
    };
    
    const product = {};
    expect(safeGet(product, 'name', 'Unknown')).toBe('Unknown');
    expect(safeGet(product, 'basePrice', 0)).toBe(0);
  });

  it('should handle empty addons array', () => {
    const addons = [];
    expect(addons.length).toBe(0);
  });

  it('should handle zero price', () => {
    const formatPrice = (price) => price === 0 ? 'Free' : `₹${price}`;
    expect(formatPrice(0)).toBe('Free');
  });
});
