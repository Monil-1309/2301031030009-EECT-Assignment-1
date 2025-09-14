"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import Link from "next/link";
import { Search, Menu, X, Phone, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 flex justify-end items-center">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>Call us now: +91 9099737019</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-900 text-white px-3 py-2 rounded font-bold text-xl">
              EL
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">ElixLifestyle</h1>
              <p className="text-xs text-gray-500">
                Premium Fashion & Lifestyle
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home Page
            </Link>
            <Link
              href="/company-profile"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Company Profile
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Our Products+
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Contact Us
            </Link>
          </nav>


          {/* Auth Links & Cart (Desktop) */}
          <div className="flex items-center space-x-4">
            <button
              className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition"
              onClick={() => router.push("/checkout")}
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="ml-2 text-sm font-medium text-gray-700">Cart</span>
            </button>
            {user ? (
              <>
                <span className="text-gray-700 text-sm">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home Page
              </Link>
              <Link
                href="/company-profile"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Company Profile
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Our Products+
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Contact Us
              </Link>
            </nav>
            <div className="mt-4 space-y-2">
              <button
                className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full justify-center hover:bg-gray-200 transition"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/checkout");
                }}
                aria-label="View Cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Cart
                </span>
              </button>
              {user ? (
                <>
                  <span className="block text-gray-700 text-sm text-center">{user.email}</span>
                  <button
                    onClick={logout}
                    className="w-full text-blue-600 hover:underline text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setIsMenuOpen(false); router.push("/login"); }}
                    className="w-full text-blue-600 hover:underline text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); router.push("/signup"); }}
                    className="w-full text-blue-600 hover:underline text-sm"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
