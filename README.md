# ElixLifestyle - Premium Fashion E-commerce Platform

A modern, full-stack e-commerce website built with Next.js, featuring a comprehensive product catalog, admin panel, and integrated inquiry system for fashion and lifestyle products.

![ElixLifestyle](https://img.shields.io/badge/ElixLifestyle-Fashion%20E--commerce-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## 🌟 Features

### 🛍️ **Customer Features**
- **Modern Product Catalog** - Browse premium fashion items with advanced filtering
- **Detailed Product Pages** - Comprehensive specifications, trade information, and descriptions
- **Advanced Search & Filters** - Filter by category, price, rating, and more
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Product Inquiry System** - Send inquiries via form or WhatsApp integration
- **Multiple View Modes** - Grid and list view for product browsing
- **Product Comparison** - Compare specifications and features
- **Real-time Search** - Instant search results as you type

### 👨‍💼 **Admin Features**
- **Admin Dashboard** - Comprehensive product management system
- **Product Management** - Add, edit, delete products with rich details
- **Image Upload** - Support for both URL and file upload via Supabase Storage
- **Inventory Tracking** - Monitor stock levels and product availability
- **Analytics Dashboard** - View product statistics and performance metrics
- **Bulk Operations** - Manage multiple products efficiently

### 🔧 **Technical Features**
- **Next.js 14** - Latest App Router with Server Components
- **TypeScript** - Full type safety throughout the application
- **Supabase Integration** - Database, storage, and real-time features
- **Google Sheets Integration** - Automatic inquiry data collection
- **WhatsApp Integration** - Direct customer communication
- **SEO Optimized** - Meta tags, sitemap, and robots.txt
- **Performance Optimized** - Image optimization and lazy loading

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database and storage)
- Google Sheets API access (for inquiry forms)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/elixlifestyle-fullstack.git
   cd elixlifestyle-fullstack
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update `.env.local` with your credentials:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

4. **Set up Supabase Database**
   
   Run the SQL scripts in the `scripts/` folder:
   \`\`\`sql
   -- Run in Supabase SQL Editor
   -- 1. Create products table
   \i scripts/create-products-table.sql
   
   -- 2. Set up storage for images
   \i scripts/setup-storage.sql
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
elixlifestyle-fullstack/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel pages
│   │   ├── dashboard/           # Admin dashboard
│   │   └── page.tsx             # Admin login
│   ├── api/                     # API routes
│   ├── products/                # Product pages
│   │   ├── [id]/               # Dynamic product detail pages
│   │   └── page.tsx            # Product listing page
│   ├── contact/                 # Contact page
│   ├── company-profile/         # About page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/                  # Reusable components
│   ├── Header.tsx              # Navigation header
│   ├── Footer.tsx              # Site footer
│   ├── HeroSection.tsx         # Homepage hero
│   ├── FeaturedProducts.tsx    # Product showcase
│   ├── InquiryModal.tsx        # Product inquiry form
│   └── WhatsAppButton.tsx      # WhatsApp integration
├── lib/                        # Utility libraries
│   └── supabase.ts            # Supabase client configuration
├── scripts/                    # Database scripts
│   ├── create-products-table.sql
│   └── setup-storage.sql
├── public/                     # Static assets
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.mjs           # Next.js configuration
└── package.json              # Dependencies and scripts
\`\`\`

## 🗄️ Database Schema

### Products Table
\`\`\`sql
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## 🔧 Configuration

### Admin Access
- **Default Username:** `admin`
- **Default Password:** `elixadmin2024`
- **Admin Panel:** `/admin`

### WhatsApp Integration
- Update the phone number in `components/WhatsAppButton.tsx`
- Current number: `+91 90997 37019`

### Google Sheets Integration
- Update the Google Apps Script URL in `components/InquiryModal.tsx`
- Set up Google Sheets API for form submissions

## 🎨 Customization

### Styling
- **Tailwind CSS** - Modify `tailwind.config.js` for custom themes
- **Global Styles** - Update `app/globals.css` for global styling
- **Component Styles** - Each component uses Tailwind utility classes

### Content
- **Company Information** - Update in `components/Footer.tsx` and `app/company-profile/page.tsx`
- **Contact Details** - Modify phone numbers and addresses throughout the app
- **Product Categories** - Add new categories in the admin panel

### Features
- **Payment Integration** - Add payment gateways in product pages
- **User Authentication** - Implement customer login/registration
- **Order Management** - Add shopping cart and order tracking

## 📱 API Endpoints

### Contact Form
\`\`\`
POST /api/contact
\`\`\`
Handles contact form submissions and integrates with Google Sheets.

### Product Management
All product operations are handled through Supabase client-side integration.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify** - Configure build settings for Next.js
- **Railway** - Add environment variables and deploy
- **DigitalOcean** - Use App Platform for easy deployment

## 🔒 Environment Variables

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URLs (Auto-generated by Supabase)
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_prisma_connection_string
POSTGRES_URL_NON_POOLING=your_non_pooling_connection_string

# Additional Supabase Keys
SUPABASE_JWT_SECRET=your_jwt_secret
SUPABASE_ANON_KEY=your_anon_key

# Database Credentials
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DATABASE=your_db_name
POSTGRES_HOST=your_db_host
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Email:** info@elixlifestyle.com
- **WhatsApp:** +91 90997 37019
- **Phone:** +91 90997 37019

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Supabase** - For the backend-as-a-service platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For hosting and deployment platform

## 📊 Performance

- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals:** Optimized for LCP, FID, and CLS
- **Image Optimization:** Next.js automatic image optimization
- **Code Splitting:** Automatic route-based code splitting

## 🔄 Updates

### Version 1.0.0 (Current)
- ✅ Complete e-commerce platform
- ✅ Admin panel with product management
- ✅ WhatsApp and Google Sheets integration
- ✅ Responsive design
- ✅ SEO optimization

### Planned Features
- 🔄 User authentication system
- 🔄 Shopping cart functionality
- 🔄 Payment gateway integration
- 🔄 Order management system
- 🔄 Email notifications
- 🔄 Advanced analytics dashboard

---

**Built with ❤️ for ElixLifestyle**

*Premium Fashion & Lifestyle Products*
