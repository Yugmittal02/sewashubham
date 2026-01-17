# Testing Documentation

This document provides comprehensive information about the testing setup for the SevaShubham application.

## Overview

The application has a complete testing stack covering:
- **Backend**: Jest + Supertest + MongoDB Memory Server
- **Frontend**: Vitest + React Testing Library
- **E2E**: Playwright (multi-device support)

---

## Quick Start

### Run All Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests (requires dev server running)
cd frontend && npm run test:e2e

# All frontend tests (unit + E2E)
cd frontend && npm run test:all
```

---

## Backend Testing

### Stack
- **Jest** - Test runner
- **Supertest** - HTTP assertions
- **MongoDB Memory Server** - In-memory database

### Running Tests

```bash
cd backend

# Run all tests with coverage
npm test

# Watch mode
npm run test:watch
```

### Coverage

Coverage reports are generated in `backend/coverage/`.

### Test Structure

```
backend/tests/
├── controllers/
│   ├── authController.test.js      # Auth, login, registration
│   ├── orderController.test.js     # Orders, accept, status
│   ├── productController.test.js   # Menu CRUD
│   ├── offerController.test.js     # Offers CRUD
│   ├── ratingController.test.js    # Ratings
│   └── settingsController.test.js  # Fees, store config, UPI
├── middleware/
│   └── authMiddleware.test.js      # JWT, admin checks
├── utils/
│   ├── testDb.js                   # Database helpers
│   └── deliveryCalculation.test.js # Haversine, fee calc
└── setup.js                        # Global test setup
```

### What's Tested

| Module | Coverage |
|--------|----------|
| Auth | Login, register, JWT validation |
| Orders | Create, track, accept, status flow |
| Products | CRUD, availability toggle |
| Offers | CRUD, validation |
| Ratings | Create, fetch |
| Settings | Fees, store config, delivery calculation |

### What's NOT Tested (Razorpay Exclusion)

- `routes/payments.js` - Razorpay API calls
- `controllers/paymentController.js` - Payment processing

These are excluded in `jest.config.js`:
```javascript
collectCoverageFrom: [
  '!routes/payments.js',
  '!controllers/paymentController.js',
]
```

---

## Frontend Testing

### Stack
- **Vitest** - Test runner
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation

### Running Tests

```bash
cd frontend

# Run with coverage
npm test

# Watch mode
npm run test:watch
```

### Test Structure

```
frontend/tests/
├── components/
│   ├── ProductCard.test.jsx       # Product display, add-ons
│   ├── SideCart.test.jsx          # Cart panel behavior
│   ├── DonationSection.test.jsx   # Donation UI
│   ├── OffersDropdown.test.jsx    # Offers selection
│   └── Footer.test.jsx            # Footer links
├── context/
│   ├── CartContext.test.jsx       # Cart state management
│   └── AuthContext.test.jsx       # Auth state, sessions
├── pages/
│   └── Home.test.jsx              # Home page
├── mocks/
│   └── axios.js                   # API mocking
└── setup.js                       # Vitest setup
```

### What's Tested

| Area | Coverage |
|------|----------|
| Cart | Add, remove, update, clear, totals |
| Auth | Login, logout, session persistence |
| Product Cards | Render, add-ons, availability |
| Side Cart | Open/close, checkout |
| Donations | Preset buttons, custom amounts |
| Offers | Load, select, calculate discount |
| Footer | Links, navigation |

---

## E2E Testing (Playwright)

### Stack
- **Playwright** - Multi-browser E2E testing
- Runs on Chromium, Mobile Chrome, Mobile Safari, Tablet

### Running Tests

```bash
cd frontend

# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Mobile only
npm run test:e2e:mobile
```

### Test Structure

```
frontend/e2e/
├── userFlow.spec.js      # Customer journey
├── adminFlow.spec.js     # Admin operations
└── responsive.spec.js    # Multi-viewport tests
```

### Test Scenarios

#### User Flow (`userFlow.spec.js`)
- Browse menu
- Filter by category
- Open cart panel
- Navigate to pages
- Footer links (Terms, Privacy, Contact)

#### Admin Flow (`adminFlow.spec.js`)
- Admin login validation
- Dashboard navigation
- Order acceptance
- Status changes
- Settings tabs
- Session persistence

#### Responsive (`responsive.spec.js`)
- No horizontal overflow
- Button tap targets (min 44px)
- Text readability
- Grid layouts
- Side cart behavior

### Viewports Tested

| Device | Dimensions |
|--------|------------|
| Mobile | 375×667 |
| Large Mobile | 414×896 |
| Tablet | 768×1024 |
| Laptop | 1024×768 |
| Desktop | 1440×900 |

---

## Mocking Strategy

### Backend Mocks
- **MongoDB**: Uses in-memory server (mongodb-memory-server)
- **JWT**: Test tokens generated with known secret
- **Razorpay**: Completely excluded from tests

### Frontend Mocks
- **Axios**: Fully mocked in `tests/mocks/axios.js`
- **API calls**: Return predictable data
- **localStorage**: Mocked for session tests

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm test
      - run: cd frontend && npx playwright install --with-deps
      - run: cd frontend && npm run test:e2e
```

---

## Environment Variables

### Test Environment

Backend tests use:
```
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key-for-testing-only
```

Frontend tests use:
```
VITE_API_BASE_URL=http://localhost:5000
```

### NOT Required for Tests
- `RAZORPAY_KEY_ID` - Mocked
- `RAZORPAY_KEY_SECRET` - Mocked
- `MONGODB_URI` - Uses in-memory server

---

## Troubleshooting

### Tests failing to find MongoDB
Ensure `mongodb-memory-server` is installed in devDependencies.

### Playwright tests timing out
Increase timeout in `playwright.config.js`:
```javascript
timeout: 60000,
```

### API tests failing
Ensure no actual server is running during tests - the mock takes precedence.

---

## Coverage Targets

| Area | Target | Current |
|------|--------|---------|
| Backend Controllers | >80% | ✅ |
| Backend Routes | >70% | ✅ |
| Frontend Components | >70% | ✅ |
| E2E User Flows | All critical paths | ✅ |
