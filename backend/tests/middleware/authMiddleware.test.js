const jwt = require('jsonwebtoken');
const { verifyToken, optionalVerifyToken, isAdmin } = require('../../middleware/authMiddleware');

describe('Auth Middleware Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('verifyToken', () => {
    it('should verify valid token and call next()', () => {
      const token = jwt.sign(
        { userId: 'test123', role: 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      req.header.mockReturnValue(`Bearer ${token}`);

      verifyToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user.userId).toBe('test123');
    });

    it('should return 401 if no token provided', () => {
      req.header.mockReturnValue(null);

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access Denied' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid token', () => {
      req.header.mockReturnValue('Bearer invalid-token');

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle token without Bearer prefix', () => {
      const token = jwt.sign(
        { userId: 'test123', role: 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      req.header.mockReturnValue(token);

      verifyToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });
  });

  describe('optionalVerifyToken', () => {
    it('should verify valid token if provided', () => {
      const token = jwt.sign(
        { userId: 'test123', role: 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      req.header.mockReturnValue(`Bearer ${token}`);

      optionalVerifyToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });

    it('should proceed without user if no token provided', () => {
      req.header.mockReturnValue(null);

      optionalVerifyToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    it('should proceed as guest if token is invalid', () => {
      req.header.mockReturnValue('Bearer invalid-token');

      optionalVerifyToken(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });
  });

  describe('isAdmin', () => {
    it('should call next() if user is admin', () => {
      req.user = { userId: 'admin123', role: 'admin' };

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
      req.user = { userId: 'user123', role: 'customer' };

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if no user is set', () => {
      req.user = null;

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
