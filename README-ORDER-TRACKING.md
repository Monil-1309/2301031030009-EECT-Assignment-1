# Order Tracking System Setup

This document explains how to set up the order tracking system for the Elixlifestyle e-commerce platform.

## Problem Solved

The order tracking system was not working because:

1. Orders table might not exist in the database
2. Admin API endpoints were missing
3. Admin dashboard wasn't properly connected to the backend

## Solution Implemented

### 1. Database Setup

**Location**: `scripts/setup-database.sql`

This SQL script creates:

- `orders` table with all necessary columns
- `products` table for the product catalog
- `contact_submissions` table for contact forms
- Proper indexes for performance
- Storage buckets for images and payment proofs
- Row Level Security (RLS) policies

### 2. Admin API Endpoints

**Created the following API routes:**

- `GET /api/admin/orders` - Fetch all orders
- `PUT /api/admin/orders/[id]` - Update order status
- `PUT /api/admin/orders/[id]/payment` - Update payment status
- `GET /api/admin/stats` - Get dashboard statistics

### 3. Updated Admin Dashboard

**Location**: `app/admin/dashboard/page.tsx`

Updated the admin dashboard to:

- Use the new admin API endpoints instead of direct Supabase calls
- Properly handle errors
- Display orders with parsed JSON items
- Allow order status updates
- Show revenue and statistics

## Setup Instructions

### Step 1: Database Setup

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your Elixlifestyle project
3. Navigate to the SQL Editor
4. Create a new query
5. Copy the contents of `scripts/setup-database.sql`
6. Paste and run the query

### Step 2: Environment Variables

Ensure these environment variables are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Step 3: Test the System

1. Start your development server: `npm run dev`
2. Go to the admin dashboard: `/admin/dashboard`
3. Check if orders are displaying (will be empty initially)
4. Create a test order by purchasing a product
5. Verify the order appears in the admin dashboard
6. Test updating order status

## How It Works

### Order Creation Flow

1. Customer places an order on the frontend
2. Order data is sent to `POST /api/orders`
3. Order is created in the database with a unique ID format: `ELX{timestamp}{random}`
4. Order includes customer info, items, payment details, and status

### Admin Dashboard Flow

1. Admin visits `/admin/dashboard`
2. Dashboard fetches orders from `GET /api/admin/orders`
3. Orders are displayed with customer info, items, and status
4. Admin can update order status via `PUT /api/admin/orders/[id]`
5. Payment status can be updated via `PUT /api/admin/orders/[id]/payment`

### Order States

**Order Status:**

- `pending_payment` - Waiting for payment
- `confirmed` - Payment confirmed, order processing
- `processing` - Order being prepared
- `shipped` - Order shipped to customer
- `delivered` - Order delivered
- `cancelled` - Order cancelled

**Payment Status:**

- `pending` - Payment not made
- `verification_pending` - Payment made, awaiting verification
- `completed` - Payment verified and completed
- `failed` - Payment failed

## API Endpoints Reference

### GET /api/admin/orders

Returns all orders sorted by creation date (newest first).

**Response:**

```json
{
  "orders": [
    {
      "id": "ELX1234567890ABCDE",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "total_amount": 99.99,
      "order_status": "pending_payment",
      "payment_status": "pending",
      "items": [...],
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### PUT /api/admin/orders/[id]

Updates the order status.

**Request Body:**

```json
{
  "status": "confirmed"
}
```

### PUT /api/admin/orders/[id]/payment

Updates the payment status.

**Request Body:**

```json
{
  "payment_status": "completed"
}
```

### GET /api/admin/stats

Returns dashboard statistics.

**Response:**

```json
{
  "stats": {
    "totalOrders": 150,
    "totalRevenue": 15000.00,
    "pendingOrders": 5,
    "totalProducts": 25
  },
  "recentOrders": [...]
}
```

## Troubleshooting

### Orders Not Displaying

1. Check if the database tables exist in Supabase
2. Verify environment variables are correct
3. Check browser console for API errors
4. Ensure RLS policies are properly set

### Database Connection Issues

1. Verify Supabase URL and keys
2. Check if the project is active
3. Ensure RLS policies allow read access

### API Errors

1. Check server logs for detailed error messages
2. Verify database table structure matches the schema
3. Ensure proper environment variables are set

## Features

✅ **Order Creation**: Orders are automatically created when customers make purchases  
✅ **Order Display**: All orders are visible in the admin dashboard  
✅ **Order Updates**: Admin can update order and payment status  
✅ **Revenue Tracking**: Total revenue is calculated from completed orders  
✅ **Order Search**: Search orders by customer name, email, or order ID  
✅ **Status Filtering**: Filter orders by status  
✅ **Real-time Updates**: Order list updates when status changes

## Next Steps

1. Add email notifications for order status changes
2. Implement order tracking for customers
3. Add inventory management
4. Create order reports and analytics
5. Add bulk order operations

## Support

If you encounter any issues, check:

1. Supabase dashboard for database errors
2. Browser console for frontend errors
3. Server logs for API errors
4. Network tab for failed requests
