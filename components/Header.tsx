"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Menu, X, Phone } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 flex justify-end items-center">
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>Call us now: +91 9876543210</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-900 text-white px-3 py-2 rounded font-bold text-xl">EL</div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">ElixLifestyle</h1>
              <p className="text-xs text-gray-500">Premium Fashion & Lifestyle</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home Page
            </Link>
            <Link href="/company-profile" className="text-gray-700 hover:text-blue-600 font-medium">
              Company Profile
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
              Our Products+
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
              Contact Us
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
            <input
              type="text"
              placeholder="Search Products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm"
            />
            <Search className="w-4 h-4 text-gray-500" />
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home Page
              </Link>
              <Link href="/company-profile" className="text-gray-700 hover:text-blue-600 font-medium">
                Company Profile
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                Our Products+
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact Us
              </Link>
            </nav>
            <div className="mt-4">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm"
                />
                <Search className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
