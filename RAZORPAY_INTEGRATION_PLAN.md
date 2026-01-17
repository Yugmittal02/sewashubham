# Razorpay UPI Payment Integration Plan

## ✅ IMPLEMENTATION COMPLETE

## Overview

This plan outlines the complete integration of Razorpay for UPI payment confirmation, replacing the current QR-code-only flow with a proper payment gateway that provides real-time payment verification.

## Current Problem (SOLVED)

- ~~Users can pay via QR code or UPI deep links~~
- ~~Admin has no way to verify if payment was actually completed~~
- ~~Orders are created regardless of payment status~~
- ~~No automated payment confirmation mechanism~~

## Solution Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│   Razorpay      │
│   (React)       │◀────│   (Express)     │◀────│   API           │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       ▼                       │
        │               ┌─────────────────┐             │
        │               │   MongoDB       │             │
        │               │   (Orders)      │             │
        │               └─────────────────┘             │
        │                       ▲                       │
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                          Webhooks
```

## Implementation Steps

---

## Phase 1: Backend Setup

### 1.1 Install Razorpay SDK

```bash
cd backend
npm install razorpay crypto
```

### 1.2 Update Environment Variables

Add to `.env`:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 1.3 Update Order Model

File: `backend/models/Order.js`

Add new fields:

- `razorpayOrderId`: String - Razorpay order ID
- `razorpayPaymentId`: String - Razorpay payment ID
- `razorpaySignature`: String - Payment signature for verification
- `paymentStatus`: Extended enum - 'Pending', 'Initiated', 'Paid', 'Failed', 'Refunded'
- `paymentVerifiedAt`: Date - When payment was verified

### 1.4 Create Payment Controller

File: `backend/controllers/paymentController.js`

Functions:

- `createRazorpayOrder()` - Create Razorpay order and return order_id
- `verifyPayment()` - Verify payment signature after completion
- `handleWebhook()` - Handle Razorpay webhooks for async verification
- `getPaymentStatus()` - Check payment status for an order

### 1.5 Create Payment Routes

File: `backend/routes/payments.js`

Routes:

- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment after completion
- `POST /api/payments/webhook` - Razorpay webhook endpoint
- `GET /api/payments/status/:orderId` - Get payment status

### 1.6 Update Server Configuration

File: `backend/server.js`

- Add raw body parser for webhook verification
- Register payment routes
- Configure webhook endpoint to bypass JSON parsing

---

## Phase 2: Frontend Integration

### 2.1 Install Razorpay Checkout

Add Razorpay script to `frontend/index.html`:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2.2 Update API Service

File: `frontend/src/services/api.js`

Add functions:

- `createPaymentOrder(data)` - Create Razorpay order
- `verifyPayment(data)` - Verify payment completion
- `getPaymentStatus(orderId)` - Check payment status

### 2.3 Create Razorpay Payment Hook

File: `frontend/src/hooks/useRazorpay.js`

Custom hook for:

- Loading Razorpay checkout
- Handling payment flow
- Managing payment state

### 2.4 Update UPIPaymentModal

File: `frontend/src/components/UPIPaymentModal.jsx`

Changes:

- Add Razorpay checkout integration
- Show "Pay with Razorpay" option
- Handle payment success/failure callbacks
- Show payment verification status

### 2.5 Update Cart Page

File: `frontend/src/pages/Cart.jsx`

Changes:

- Integrate Razorpay payment flow
- Handle payment callbacks
- Update order status based on payment result

---

## Phase 3: Admin Dashboard Updates

### 3.1 Update Order Display

File: `frontend/src/pages/AdminDashboard.jsx`

Changes:

- Show payment status badge (Pending/Verified/Failed)
- Add manual payment verification option
- Show Razorpay payment ID for reference
- Filter orders by payment status

### 3.2 Add Payment Actions

- Mark payment as received (for manual verification)
- Initiate refund (future enhancement)
- View payment details

---

## Phase 4: Order Flow Updates

### 4.1 New Order Flow (UPI)

```
1. User adds items to cart
2. User selects UPI payment
3. Frontend calls POST /api/payments/create-order
   - Creates pending order in DB
   - Creates Razorpay order
   - Returns razorpay_order_id
4. Frontend opens Razorpay Checkout
5. User completes payment in Razorpay
6. Razorpay redirects with payment details
7. Frontend calls POST /api/payments/verify
   - Verifies signature
   - Updates order paymentStatus to 'Paid'
8. User sees success page
9. Admin sees order with verified payment status
```

### 4.2 Webhook Flow (Backup Verification)

```
1. Razorpay sends webhook on payment completion
2. Backend receives at POST /api/payments/webhook
3. Verifies webhook signature
4. Updates order paymentStatus
5. Admin dashboard auto-refreshes to show new status
```

---

## Detailed File Changes

### Backend Files to Create:

1. `backend/controllers/paymentController.js` - Payment logic
2. `backend/routes/payments.js` - Payment routes
3. `backend/config/razorpay.js` - Razorpay configuration

### Backend Files to Modify:

1. `backend/models/Order.js` - Add payment fields
2. `backend/server.js` - Add payment routes, webhook config
3. `backend/controllers/orderController.js` - Update order creation
4. `backend/package.json` - Add razorpay dependency

### Frontend Files to Create:

1. `frontend/src/hooks/useRazorpay.js` - Payment hook

### Frontend Files to Modify:

1. `frontend/index.html` - Add Razorpay script
2. `frontend/src/services/api.js` - Add payment APIs
3. `frontend/src/components/UPIPaymentModal.jsx` - Razorpay integration
4. `frontend/src/pages/Cart.jsx` - Update checkout flow
5. `frontend/src/pages/AdminDashboard.jsx` - Show payment status
6. `frontend/package.json` - Add any needed deps

---

## Database Schema Changes

### Order Model Updates:

```javascript
{
    // Existing fields...

    // New payment fields
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Initiated', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    paymentVerifiedAt: { type: Date },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'UPI', 'Razorpay'], // Add Razorpay
        default: 'Cash'
    }
}
```

---

## API Endpoints Summary

### New Endpoints:

| Method | Endpoint                               | Description           | Auth                      |
| ------ | -------------------------------------- | --------------------- | ------------------------- |
| POST   | `/api/payments/create-order`           | Create Razorpay order | Optional                  |
| POST   | `/api/payments/verify`                 | Verify payment        | Optional                  |
| POST   | `/api/payments/webhook`                | Razorpay webhook      | None (signature verified) |
| GET    | `/api/payments/status/:orderId`        | Get payment status    | Optional                  |
| PUT    | `/api/payments/manual-verify/:orderId` | Manual verification   | Admin                     |

---

## Security Considerations

1. **Signature Verification**: Always verify Razorpay signatures
2. **Webhook Security**: Validate webhook signatures before processing
3. **Idempotency**: Handle duplicate webhook calls gracefully
4. **Amount Verification**: Verify payment amount matches order amount
5. **Environment Variables**: Never expose secret keys in frontend

---

## Testing Checklist

### Backend Tests:

- [ ] Create Razorpay order API
- [ ] Payment verification API
- [ ] Webhook handling
- [ ] Signature verification
- [ ] Order status updates

### Frontend Tests:

- [ ] Razorpay checkout opens correctly
- [ ] Payment success flow
- [ ] Payment failure handling
- [ ] Loading states
- [ ] Error handling

### Integration Tests:

- [ ] End-to-end payment flow
- [ ] Webhook processing
- [ ] Admin dashboard updates

---

## Razorpay Test Credentials

For testing, use Razorpay Test Mode:

- Test Key ID: `rzp_test_xxxxx`
- Test cards and UPI available in test mode
- Use test mode until go-live

---

## Rollout Plan

1. **Phase 1**: Backend implementation (Day 1-2)
2. **Phase 2**: Frontend integration (Day 2-3)
3. **Phase 3**: Admin dashboard updates (Day 3)
4. **Phase 4**: Testing in test mode (Day 4)
5. **Phase 5**: Production deployment with live keys (Day 5)

---

## Estimated Timeline: 3-5 Days

Ready to proceed with implementation?

---

## ✅ Implementation Status

### Backend (COMPLETED)

- [x] `backend/config/razorpay.js` - Razorpay configuration
- [x] `backend/controllers/paymentController.js` - Payment logic
- [x] `backend/routes/payments.js` - Payment routes
- [x] `backend/models/Order.js` - Updated with payment fields
- [x] `backend/server.js` - Added payment routes
- [x] `backend/.env.example` - Added Razorpay env vars

### Frontend (COMPLETED)

- [x] `frontend/index.html` - Added Razorpay checkout script
- [x] `frontend/src/hooks/useRazorpay.js` - Payment hook
- [x] `frontend/src/services/api.js` - Added payment APIs
- [x] `frontend/src/components/UPIPaymentModal.jsx` - Razorpay integration
- [x] `frontend/src/pages/Cart.jsx` - Updated checkout flow
- [x] `frontend/src/pages/AdminDashboard.jsx` - Payment status & manual verify
- [x] `frontend/src/pages/OrderSuccess.jsx` - Payment verified badge

---

## 🔧 Setup Instructions

### 1. Get Razorpay API Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Go to Settings → API Keys
4. Generate Test keys for testing, Live keys for production

### 2. Configure Backend Environment

Add these to your `backend/.env` file:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 3. (Optional) Configure Webhooks

1. In Razorpay Dashboard, go to Settings → Webhooks
2. Add webhook URL: `https://your-api-domain.com/api/payments/webhook`
3. Select events: `payment.captured`, `payment.failed`, `order.paid`
4. Copy the webhook secret to `RAZORPAY_WEBHOOK_SECRET`

### 4. Restart Backend Server

```bash
cd backend
npm run dev
```

---

## 📱 User Flow

### Customer Payment Flow:

1. Customer adds items to cart
2. Selects "UPI Payment" at checkout
3. Modal shows two options:
   - **Secure Pay (Razorpay)** - Recommended, instant verification
   - **QR/UPI Apps** - Manual, requires admin verification
4. For Razorpay: Opens Razorpay checkout → Pays → Auto-verified
5. For Manual: Opens UPI app → Pays → Admin verifies

### Admin Verification Flow:

1. Orders show payment status badge:
   - ✓ Payment Verified (green) - Razorpay verified
   - ⏳ Payment Pending (yellow) - Awaiting verification
   - ✗ Payment Failed (red) - Payment failed
2. For manual UPI payments, admin can click "Verify Payment Received"
3. Order updates to verified status

---

## 🧪 Testing

### Test Cards (Razorpay Test Mode):

- **Success**: 4111 1111 1111 1111
- **Failure**: 5267 3181 8797 5449

### Test UPI (Razorpay Test Mode):

- Use any UPI ID like `success@razorpay`

---

## 🚀 Production Checklist

- [ ] Switch to Razorpay Live keys
- [ ] Configure production webhook URL
- [ ] Test end-to-end payment flow
- [ ] Enable webhook signature verification
- [ ] Monitor Razorpay Dashboard for transactions
