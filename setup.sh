#!/bin/bash

# Elixlifestyle Ecommerce Setup Script
# This script helps set up the database and environment

echo "🚀 Setting up Elixlifestyle Ecommerce..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please edit it with your actual values."
    echo ""
    echo "⚠️  Important: You need to:"
    echo "   1. Set up a Supabase project and add the URL and keys"
    echo "   2. Add your UPI ID and business details"
    echo "   3. (Optional) Add Razorpay credentials for card payments"
    echo ""
    echo "📚 For Supabase setup:"
    echo "   1. Go to https://supabase.com"
    echo "   2. Create a new project"
    echo "   3. Go to Settings > API"
    echo "   4. Copy the URL and anon key to .env.local"
    echo ""
    echo "💳 For UPI QR Code:"
    echo "   1. Generate your UPI QR code using any UPI app"
    echo "   2. Save it as 'upi-qr-code.png' in the public folder"
    echo "   3. Update UPI_ID in .env.local with your UPI ID"
    echo ""
else
    echo "✅ .env.local already exists"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
    echo "✅ Dependencies installed"
fi

echo ""
echo "🗄️  Database Setup:"
echo "   1. Go to your Supabase project dashboard"
echo "   2. Navigate to SQL Editor"
echo "   3. Run the SQL script from scripts/create-orders-table.sql"
echo "   4. This will create the orders table and set up storage"
echo ""

echo "🎯 Next Steps:"
echo "   1. Configure your .env.local file"
echo "   2. Set up the database using Supabase SQL Editor"
echo "   3. Add your UPI QR code to the public folder"
echo "   4. Run 'npm run dev' to start the development server"
echo "   5. Visit http://localhost:3000 to see your store"
echo "   6. Visit http://localhost:3000/admin to access admin panel"
echo ""

echo "🔑 Admin Access:"
echo "   Default admin login: admin / password123"
echo "   (You can change this in app/admin/page.tsx)"
echo ""

echo "🌟 Payment Methods Available:"
echo "   ✅ UPI QR Code (Free - no transaction fees)"
echo "   ✅ Direct UPI ID (Free - no transaction fees)"  
echo "   ⚡ Razorpay (2% transaction fee - optional)"
echo ""

echo "✨ Setup complete! Edit .env.local and run the database setup scripts."
