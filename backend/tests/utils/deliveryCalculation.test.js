/**
 * Delivery Calculation Unit Tests
 * Tests for the Haversine formula and delivery fee calculation logic
 */

describe('Delivery Calculation Logic', () => {
  // Haversine formula implementation for testing
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateDeliveryFee = (distance, baseFee, perKmFee, orderTotal, freeThreshold, maxRadius) => {
    // Free delivery if order exceeds threshold
    if (orderTotal >= freeThreshold) {
      return { fee: 0, freeDelivery: true, withinRadius: distance <= maxRadius };
    }
    
    // Check if within radius
    if (distance > maxRadius) {
      return { fee: null, freeDelivery: false, withinRadius: false };
    }
    
    // Calculate fee
    const fee = baseFee + (distance * perKmFee);
    return { fee: Math.round(fee), freeDelivery: false, withinRadius: true };
  };

  describe('Haversine Distance Calculation', () => {
    it('should return 0 for same location', () => {
      const distance = calculateDistance(28.6139, 77.2090, 28.6139, 77.2090);
      expect(distance).toBe(0);
    });

    it('should calculate distance between two known points', () => {
      // Delhi to Noida - approximately 20-25 km
      const distance = calculateDistance(28.6139, 77.2090, 28.5355, 77.3910);
      expect(distance).toBeGreaterThan(15);
      expect(distance).toBeLessThan(30);
    });

    it('should calculate short distance correctly', () => {
      // Two points ~1km apart
      const distance = calculateDistance(28.6139, 77.2090, 28.6230, 77.2090);
      expect(distance).toBeGreaterThan(0.9);
      expect(distance).toBeLessThan(1.2);
    });

    it('should handle locations across hemispheres', () => {
      // Delhi to Sydney
      const distance = calculateDistance(28.6139, 77.2090, -33.8688, 151.2093);
      expect(distance).toBeGreaterThan(10000);
      expect(distance).toBeLessThan(12000);
    });

    it('should be symmetric', () => {
      const d1 = calculateDistance(28.6139, 77.2090, 28.5355, 77.3910);
      const d2 = calculateDistance(28.5355, 77.3910, 28.6139, 77.2090);
      expect(d1).toBeCloseTo(d2, 10);
    });
  });

  describe('Delivery Fee Calculation', () => {
    const baseFee = 30;
    const perKmFee = 5;
    const freeThreshold = 500;
    const maxRadius = 10;

    it('should calculate fee for nearby location', () => {
      const distance = 3; // 3 km
      const result = calculateDeliveryFee(distance, baseFee, perKmFee, 300, freeThreshold, maxRadius);
      
      expect(result.fee).toBe(45); // 30 + (3 * 5)
      expect(result.freeDelivery).toBe(false);
      expect(result.withinRadius).toBe(true);
    });

    it('should return free delivery when order exceeds threshold', () => {
      const distance = 5;
      const result = calculateDeliveryFee(distance, baseFee, perKmFee, 600, freeThreshold, maxRadius);
      
      expect(result.fee).toBe(0);
      expect(result.freeDelivery).toBe(true);
    });

    it('should handle order exactly at threshold', () => {
      const distance = 5;
      const result = calculateDeliveryFee(distance, baseFee, perKmFee, 500, freeThreshold, maxRadius);
      
      expect(result.fee).toBe(0);
      expect(result.freeDelivery).toBe(true);
    });

    it('should indicate when outside delivery radius', () => {
      const distance = 15; // Beyond 10km max
      const result = calculateDeliveryFee(distance, baseFee, perKmFee, 300, freeThreshold, maxRadius);
      
      expect(result.fee).toBe(null);
      expect(result.withinRadius).toBe(false);
    });

    it('should handle zero distance (pickup from store)', () => {
      const distance = 0;
      const result = calculateDeliveryFee(distance, baseFee, perKmFee, 300, freeThreshold, maxRadius);
      
      expect(result.fee).toBe(30); // Just base fee
      expect(result.withinRadius).toBe(true);
    });

    it('should handle exactly at radius boundary', () => {
      const distance = 10; // Exactly at max radius
      const result = calculateDeliveryFee(distance, baseFee, perKmFee, 300, freeThreshold, maxRadius);
      
      expect(result.fee).toBe(80); // 30 + (10 * 5)
      expect(result.withinRadius).toBe(true);
    });

    it('should handle just beyond radius boundary', () => {
      const distance = 10.1; // Just beyond max radius
      const result = calculateDeliveryFee(distance, baseFee, perKmFee, 300, freeThreshold, maxRadius);
      
      expect(result.withinRadius).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small distances', () => {
      const distance = calculateDistance(28.6139, 77.2090, 28.6140, 77.2091);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(0.1); // Less than 100 meters
    });

    it('should handle negative coordinates', () => {
      // Sydney, Australia
      const distance = calculateDistance(-33.8688, 151.2093, -33.9, 151.2);
      expect(distance).toBeGreaterThan(0);
    });

    it('should handle coordinates near poles', () => {
      const distance = calculateDistance(89.0, 0, 89.0, 180);
      expect(distance).toBeGreaterThan(0);
    });

    it('should handle coordinates crossing date line', () => {
      const distance = calculateDistance(0, 179.9, 0, -179.9);
      expect(distance).toBeLessThan(50); // Should be close
    });
  });
});
