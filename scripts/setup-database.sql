
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table (new)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default categories (optional)
INSERT INTO categories (name) VALUES ('Tops'), ('Dresses'), ('Shirts') ON CONFLICT DO NOTHING;

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

-- Create contact_submissions table (if not exists)
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment proofs
CREATE POLICY "Public read access for payment proofs" ON storage.objects
FOR SELECT USING (bucket_id = 'payment-proofs');

CREATE POLICY "Allow upload of payment proofs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

-- Storage policies for product images
CREATE POLICY "Public read access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow upload of product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow delete of product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');

-- Enable RLS for all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for orders table
CREATE POLICY "Allow reading orders" ON orders
FOR SELECT USING (true);

CREATE POLICY "Allow creating orders" ON orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow updating orders" ON orders
FOR UPDATE USING (true);

-- RLS policies for products table
CREATE POLICY "Allow reading products" ON products
FOR SELECT USING (true);

CREATE POLICY "Allow creating products" ON products
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow updating products" ON products
FOR UPDATE USING (true);

CREATE POLICY "Allow deleting products" ON products
FOR DELETE USING (true);

-- RLS policies for contact submissions
CREATE POLICY "Allow reading contact submissions" ON contact_submissions
FOR SELECT USING (true);

CREATE POLICY "Allow creating contact submissions" ON contact_submissions
FOR INSERT WITH CHECK (true);

-- Add helpful comments
COMMENT ON TABLE orders IS 'Table to store customer orders and payment information';
COMMENT ON COLUMN orders.id IS 'Unique order identifier (format: ELX{timestamp}{random})';
COMMENT ON COLUMN orders.items IS 'JSON array of ordered items with details';
COMMENT ON COLUMN orders.payment_method IS 'Payment method used: upi, qr, razorpay';
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, verification_pending, completed, failed';
COMMENT ON COLUMN orders.order_status IS 'Order status: pending_payment, confirmed, processing, shipped, delivered, cancelled';

COMMENT ON TABLE products IS 'Table to store product catalog';
COMMENT ON TABLE contact_submissions IS 'Table to store contact form submissions';

-- Insert some sample data (optional)
INSERT INTO products (name, description, price, category, image_url) VALUES
('Sample Product 1', 'This is a sample product description', 29.99, 'Electronics', 'https://via.placeholder.com/400x400'),
('Sample Product 2', 'Another sample product', 49.99, 'Clothing', 'https://via.placeholder.com/400x400')
ON CONFLICT (id) DO NOTHING;