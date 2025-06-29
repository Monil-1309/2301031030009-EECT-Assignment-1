-- Create products table
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

-- Create an index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Insert sample data
INSERT INTO products (name, description, price, image_url, category) VALUES
('Ladies Plain Casual Top', 'Comfortable and stylish casual top for everyday wear. Made from premium cotton blend fabric.', 899.00, '/placeholder.svg?height=300&width=300', 'Tops'),
('Ladies Bodycon Printed Dress', 'Elegant printed dress perfect for special occasions. Flattering bodycon fit with beautiful prints.', 1299.00, '/placeholder.svg?height=300&width=300', 'Dresses'),
('Western One-piece Dress', 'Modern western style dress for contemporary look. Perfect for office or casual outings.', 1599.00, '/placeholder.svg?height=300&width=300', 'Dresses'),
('Ladies Shirt', 'Professional shirt perfect for office wear. Crisp, clean lines with comfortable fit.', 999.00, '/placeholder.svg?height=300&width=300', 'Shirts'),
('Cotton Casual Top', 'Soft cotton top perfect for daily wear. Breathable fabric with stylish design.', 799.00, '/placeholder.svg?height=300&width=300', 'Tops'),
('Formal Blazer', 'Professional blazer for office and formal events. Tailored fit with premium fabric.', 2499.00, '/placeholder.svg?height=300&width=300', 'Blazers'),
('Summer Floral Dress', 'Light and breezy floral dress perfect for summer. Comfortable and stylish.', 1199.00, '/placeholder.svg?height=300&width=300', 'Dresses'),
('Denim Jacket', 'Classic denim jacket that goes with everything. Durable and fashionable.', 1899.00, '/placeholder.svg?height=300&width=300', 'Jackets');
