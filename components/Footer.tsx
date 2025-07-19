import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white px-3 py-2 rounded font-bold text-xl">
                EL
              </div>
              <div>
                <h3 className="font-bold text-xl">ElixLifestyle</h3>
                <p className="text-sm text-gray-400">
                  Premium Fashion & Lifestyle
                </p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for premium fashion and lifestyle products.
              Quality, style, and comfort in every piece.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/company-profile"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=tops"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tops
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=dresses"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Dresses
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=shirts"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=casual"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Casual Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-400" />
                <span className="text-gray-400">+91 9099737019</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-400" />
                <span className="text-gray-400">monildesai005@gmail.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-blue-400 mt-1" />
                <span className="text-gray-400">
                  123 Fashion Street,
                  <br />
                  Mumbai, Maharashtra 400001
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 ElixLifestyle. All rights reserved. |
            <Link href="/privacy" className="hover:text-white ml-1">
              Privacy Policy
            </Link>{" "}
            |
            <Link href="/terms" className="hover:text-white ml-1">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
