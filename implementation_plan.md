# Implementation Plan - SewaShubhamBackery MERN Transformation

## Goal
Convert the existing static site into a high-performance, reliable MERN stack (MongoDB, Express, React, Node.js) Progressive Web App (PWA) for SewaShubhamBackery.

## User Requirements
- **Stack**: React.js, MongoDB, Node.js.
- **Features**:
    - Order management.
    - Menu management (Sizes: Small, Medium, Large; Add-ons).
    - Payment integration.
    - Offer cards & coupons.
    - Customer ratings.
    - PWA capabilities (Service Worker, Manifest).
- **Performance**: Fast and reliable.
- **Roles**: Customer, Admin (includes Kitchen management).

## Proposed Architecture
- **Root**: `x:\SevaShubham\wow`
    - **Backend**: `backend/` (Node.js/Express API)
    - **Frontend**: `frontend/` (React + Vite + TailwindCSS)

## 1. Project Initialization [COMPLETED]
- [x] Create `backend` directory and initialize `package.json`.
- [x] Create `frontend` directory.
- [x] Setup Git structure.

## 2. Backend Development (Node.js + MongoDB) [COMPLETED]
### Dependencies
- `express`, `mongoose`, `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`.

### Structure
- `models/`: User, Product, Order.
- `routes/`: Auth, Products, Orders.
- `controllers/`: Auth, Products, Orders.

## 3. Frontend Development (React + Vite) [COMPLETED]
### Setup
- Vite + React + TailwindCSS.
- `react-router-dom`.
- `framer-motion` (for replicating existing animations).
- `vite-plugin-pwa`.

### Components
- **Layouts**: MainLayout, AdminLayout.
- **Pages**:
  - Customer: Home, Cart, Login.
  - Admin: Dashboard.
- **Features**:
  - Replicate "WowCafe" UI (branding updated to SewaShubhamBackery).
  - Implement Menu filtering.
  - Cart logic.
  - Payment Placeholder.

## 4. PWA Integration [COMPLETED]
- [x] Configure `vite-plugin-pwa`.
- [x] Setup Header/Manifest Config.

## 5. Verification
- Manual testing of flows.
