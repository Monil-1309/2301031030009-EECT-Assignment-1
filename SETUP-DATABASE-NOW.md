# URGENT: Manual Database Setup Guide

## Problem

Your Supabase database doesn't have the `orders` table, which is why no orders are showing in your admin panel.

## Solution: Create Orders Table Manually

### Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your project: `nuhhuvwhemvaloyxojo`

### Step 2: Create Orders Table

1. Click on **"Table Editor"** in the left sidebar
2. Click **"Create a new table"** button
3. Set table name: `orders`
4. **IMPORTANT**: Uncheck "Enable Row Level Security (RLS)" for now (we'll enable it later)

### Step 3: Add Columns

Click "Add column" for each of these columns:

| Column Name          | Type          | Settings                   |
| -------------------- | ------------- | -------------------------- |
| `id`                 | `text`        | Primary Key, Not Null      |
| `customer_name`      | `text`        | Not Null                   |
| `customer_email`     | `text`        | Not Null                   |
| `customer_phone`     | `text`        | Not Null                   |
| `customer_address`   | `text`        |                            |
| `customer_city`      | `text`        |                            |
| `customer_pincode`   | `text`        |                            |
| `customer_state`     | `text`        |                            |
| `items`              | `jsonb`       | Not Null                   |
| `total_amount`       | `numeric`     | Not Null                   |
| `payment_method`     | `text`        | Not Null                   |
| `payment_status`     | `text`        | Default: 'pending'         |
| `order_status`       | `text`        | Default: 'pending_payment' |
| `transaction_id`     | `text`        |                            |
| `razorpay_order_id`  | `text`        |                            |
| `razorpay_signature` | `text`        |                            |
| `payment_proof_url`  | `text`        |                            |
| `created_at`         | `timestamptz` | Default: now()             |
| `updated_at`         | `timestamptz` | Default: now()             |

### Step 4: Alternative - Use SQL Editor (Recommended)

Instead of creating columns manually, you can use SQL Editor:

1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste this SQL:

```sql
-- Create orders table
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    customer_city TEXT,
    customer_pincode TEXT,
    customer_state TEXT,
    items JSONB NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'pending_payment',
    transaction_id TEXT,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    payment_proof_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Insert a test order to verify everything works
INSERT INTO orders (
    id,
    customer_name,
    customer_email,
    customer_phone,
    items,
    total_amount,
    payment_method
) VALUES (
    'ELX' || EXTRACT(EPOCH FROM NOW()) || 'TEST',
    'Test Customer',
    'test@example.com',
    '+1234567890',
    '[{"id": "test-product", "name": "Test Product", "price": 29.99, "quantity": 1}]',
    29.99,
    'upi'
);
```

4. Click **"Run"** to execute the SQL

### Step 5: Verify Table Creation

1. Go back to **"Table Editor"**
2. You should see the `orders` table in the list
3. Click on it to see the test order data

### Step 6: Test Your Admin Panel

1. Go to your admin dashboard: `http://localhost:3000/admin/dashboard`
2. Click on the "Orders" tab
3. You should now see the test order

### Step 7: Enable RLS (Optional but Recommended)

1. In Table Editor, click on your `orders` table
2. Click the settings gear icon
3. Enable "Row Level Security"
4. Go to SQL Editor and run:

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on orders" ON orders
FOR ALL USING (true) WITH CHECK (true);
```

## Quick Verification Test

After creating the table, test if orders work:

1. Go to your website: `http://localhost:3000`
2. Try to place an order for any product
3. Check your admin panel to see if the new order appears

## If You Still Have Issues

1. **Check your environment variables** in `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://nuhhuvwhemvaloyxojo.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Check browser console** for any JavaScript errors

3. **Check Supabase logs** in the dashboard under "Logs"

## Expected Result

After completing these steps:

- ✅ Orders table exists in Supabase
- ✅ Test order is visible in admin panel
- ✅ New orders will be stored when customers purchase
- ✅ Admin can update order status
- ✅ Revenue tracking will work

This should fix your order tracking completely!
