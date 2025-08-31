-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT,
    customer_city VARCHAR(100),
    customer_pincode VARCHAR(10),
    customer_state VARCHAR(100),
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'pending_payment',
    transaction_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    payment_proof_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id);

-- Create storage bucket for payment proofs (run this in Supabase SQL editor)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to payment proofs
CREATE POLICY "Public read access for payment proofs" ON storage.objects
FOR SELECT USING (bucket_id = 'payment-proofs');

-- Allow authenticated users to upload payment proofs
CREATE POLICY "Allow upload of payment proofs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

-- Add RLS policies for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow users to read orders (you might want to restrict this based on customer_email)
CREATE POLICY "Allow reading orders" ON orders
FOR SELECT USING (true);

-- Allow creating orders
CREATE POLICY "Allow creating orders" ON orders
FOR INSERT WITH CHECK (true);

-- Allow updating orders (you might want to restrict this to admin users)
CREATE POLICY "Allow updating orders" ON orders
FOR UPDATE USING (true);

COMMENT ON TABLE orders IS 'Table to store customer orders and payment information';
COMMENT ON COLUMN orders.id IS 'Unique order identifier (format: ELX{timestamp}{random})';
COMMENT ON COLUMN orders.items IS 'JSON array of ordered items with details';
COMMENT ON COLUMN orders.payment_method IS 'Payment method used: upi, qr, razorpay';
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, verification_pending, completed, failed';
COMMENT ON COLUMN orders.order_status IS 'Order status: pending_payment, confirmed, processing, shipped, delivered, cancelled';
