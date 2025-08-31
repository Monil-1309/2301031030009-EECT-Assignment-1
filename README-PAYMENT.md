# Elixlifestyle Ecommerce - Payment Integration

This is a complete ecommerce solution with integrated payment methods including **FREE UPI payments** and optional Razorpay integration.

## 🌟 Features

- ✅ **Free UPI Payments** - No transaction fees, direct UPI ID and QR code support
- ✅ **Razorpay Integration** - Card/UPI/Wallet payments (2% fee)
- ✅ **Order Management** - Complete order tracking system
- ✅ **Admin Dashboard** - Manage products and orders
- ✅ **Customer Portal** - Order tracking and history
- ✅ **Real-time Updates** - Order status notifications
- ✅ **Mobile Responsive** - Works on all devices

## 💳 Payment Methods

### 1. UPI QR Code (FREE ⭐)

- Customers scan QR code with any UPI app
- No transaction fees
- Instant payments
- Manual verification system

### 2. Direct UPI ID (FREE ⭐)

- Customers pay using your UPI ID
- No transaction fees
- One-click payment from UPI apps
- Manual verification system

### 3. Razorpay (2% fee)

- Credit/Debit cards
- UPI via Razorpay
- Wallets (Paytm, PhonePe, etc.)
- Automatic verification
- **Note**: 2% transaction fee applies

## 🚀 Quick Setup

### 1. Clone and Install

```bash
cd your-project-folder
npm install --legacy-peer-deps
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your details
```

### 3. Configure Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Get your project URL and API keys from Settings > API
3. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Run the database setup:
   - Go to Supabase Dashboard > SQL Editor
   - Copy and run the SQL from `scripts/create-orders-table.sql`
   - This creates the orders table and storage bucket

### 4. Configure UPI Payment (Free Method)

1. **Get your UPI ID** (e.g., yourname@paytm, yourname@gpay)
2. **Generate QR Code**:
   - Open any UPI app (Google Pay, PhonePe, Paytm)
   - Go to "Receive Money" or "QR Code"
   - Save the QR code image
3. **Update Configuration**:
   ```env
   UPI_ID=your-upi-id@paytm
   BUSINESS_NAME=Elixlifestyle
   ```
4. **Add QR Code**:
   - Save your QR code as `public/upi-qr-code.png`

### 5. Configure Razorpay (Optional)

1. Sign up at [Razorpay](https://razorpay.com)
2. Get your API keys from Dashboard
3. Update `.env.local`:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

### 6. Start Development Server

```bash
npm run dev
```

Visit:

- **Store**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin (admin/password123)

## 📱 How It Works

### For Customers:

1. **Browse Products** - View product catalog
2. **Select Items** - Choose size, color, quantity
3. **Checkout** - Enter shipping details
4. **Choose Payment**:
   - **UPI QR**: Scan code with any UPI app
   - **UPI ID**: Pay directly using UPI ID
   - **Razorpay**: Use cards/wallets
5. **Payment Verification** - Upload transaction screenshot
6. **Order Tracking** - Track order status

### For Admin:

1. **Dashboard Access** - http://localhost:3000/admin
2. **Order Management** - View and update orders
3. **Payment Verification** - Approve UPI payments
4. **Product Management** - Add/edit products
5. **Customer Communication** - WhatsApp integration

## 🛠️ Admin Functions

### Order Management

- View all orders with filters
- Update payment status
- Update order status (confirmed → processing → shipped → delivered)
- Customer contact information
- Order details and items

### Payment Verification

- Manual verification for UPI payments
- Transaction ID tracking
- Payment proof uploads
- Status updates (pending → verified → completed)

## 📦 Order Statuses

### Payment Status:

- `pending` - Payment not yet made
- `verification_pending` - UPI payment submitted, awaiting verification
- `completed` - Payment verified and confirmed
- `failed` - Payment failed or rejected

### Order Status:

- `pending_payment` - Awaiting payment
- `confirmed` - Payment confirmed, order accepted
- `processing` - Order being prepared
- `shipped` - Order dispatched
- `delivered` - Order delivered
- `cancelled` - Order cancelled

## 🔒 Security Features

- Row Level Security (RLS) enabled
- Secure API endpoints
- Payment verification system
- Admin authentication
- Input validation and sanitization

## 📞 Customer Support Integration

- WhatsApp integration
- Phone call functionality
- Email notifications (configurable)
- Order inquiry system

## 🎨 Customization

### Brand Colors

Edit `tailwind.config.js` to change colors:

```js
colors: {
  primary: '#your-color',
  secondary: '#your-color'
}
```

### Business Information

Update in `.env.local`:

```env
BUSINESS_NAME=Your Business Name
BUSINESS_PHONE=+91xxxxxxxxxx
BUSINESS_EMAIL=support@yourbusiness.com
```

### Payment Configuration

```env
# UPI Configuration (Free)
UPI_ID=yourbusiness@paytm
UPI_QR_IMAGE_PATH=/your-qr-code.png

# Razorpay Configuration (2% fee)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxx
RAZORPAY_KEY_SECRET=xxxxxx
```

## 🚦 Going Live

### 1. Production Setup

- Use production Supabase instance
- Update environment variables for production
- Configure domain and SSL
- Set up email service (optional)

### 2. Payment Method Recommendations

**For Small Business (Recommended):**

- Use UPI QR Code + UPI ID (FREE)
- Manual verification process
- No transaction fees
- Direct bank transfers

**For Scaling Business:**

- Add Razorpay for automation
- Keep UPI as free option
- Automated payment verification
- Better customer experience

## 📁 Project Structure

```
├── app/
│   ├── checkout/          # Checkout page
│   ├── payment/
│   │   └── upi/          # UPI payment interface
│   ├── orders/
│   │   ├── success/      # Success page
│   │   └── [id]/         # Order tracking
│   ├── admin/
│   │   └── dashboard/    # Admin panel
│   └── api/
│       ├── orders/       # Order management API
│       └── payment/      # Payment processing API
├── components/           # Reusable components
├── scripts/             # Database setup scripts
└── public/              # Static assets (QR codes, images)
```

## 🤝 Support

For setup assistance or customization:

- **WhatsApp**: +91 90997 37019
- **Email**: support@elixlifestyle.com

## 📝 License

This project is for commercial use. Feel free to modify and customize for your business needs.

---

**Happy Selling! 🛍️**

Built with ❤️ for Indian businesses - supporting FREE UPI payments to keep transaction costs at zero!
