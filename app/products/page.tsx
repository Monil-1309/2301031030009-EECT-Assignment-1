"use client"

import { useState, useEffect, useMemo } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { Search, Grid, List, Star, Heart, ShoppingBag, SlidersHorizontal, ChevronDown } from "lucide-react"

const supabase = createClient(
  "https://nuhhuvwhemvaloyxojo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGhudndoZW12YWxveWR4b2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExODE3MTIsImV4cCI6MjA2Njc1NzcxMn0.wZqWS7SGoiEkdRoGQXDxFfotqG-QCCP89S7RA7ytwHY",
)

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  created_at: string
  rating?: number
  discount?: number
  sizes?: string[]
  colors?: string[]
}

type ViewMode = "grid" | "list"
type SortOption = "newest" | "price-low" | "price-high" | "name" | "rating"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 })
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Supabase error:", fetchError)
        // Enhanced sample data with more details
        const sampleProducts = [
          {
            id: "1",
            name: "Ladies Plain Casual Top",
            description:
              "Comfortable and stylish casual top for everyday wear. Made from premium cotton blend fabric that ensures comfort throughout the day.",
            price: 899,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Tops",
            created_at: new Date().toISOString(),
            rating: 4.5,
            discount: 10,
            sizes: ["S", "M", "L", "XL"],
            colors: ["White", "Black", "Navy", "Pink"],
          },
          {
            id: "2",
            name: "Ladies Bodycon Printed Dress",
            description:
              "Elegant printed dress perfect for special occasions. Flattering bodycon fit with beautiful floral prints.",
            price: 1299,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Dresses",
            created_at: new Date().toISOString(),
            rating: 4.8,
            discount: 15,
            sizes: ["XS", "S", "M", "L"],
            colors: ["Floral Blue", "Floral Pink", "Black Print"],
          },
          {
            id: "3",
            name: "Western One-piece Dress",
            description:
              "Modern western style dress for contemporary look. Perfect for office wear or casual outings with friends.",
            price: 1599,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Dresses",
            created_at: new Date().toISOString(),
            rating: 4.6,
            sizes: ["S", "M", "L", "XL"],
            colors: ["Navy", "Maroon", "Olive Green"],
          },
          {
            id: "4",
            name: "Ladies Professional Shirt",
            description:
              "Professional shirt perfect for office wear. Crisp, clean lines with comfortable fit and wrinkle-resistant fabric.",
            price: 999,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Shirts",
            created_at: new Date().toISOString(),
            rating: 4.7,
            discount: 20,
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["White", "Light Blue", "Pink", "Cream"],
          },
          {
            id: "5",
            name: "Cotton Summer Top",
            description:
              "Soft cotton top perfect for summer days. Breathable fabric with stylish design and comfortable fit.",
            price: 799,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Tops",
            created_at: new Date().toISOString(),
            rating: 4.4,
            sizes: ["S", "M", "L"],
            colors: ["Yellow", "Coral", "Mint Green", "White"],
          },
          {
            id: "6",
            name: "Formal Business Blazer",
            description:
              "Professional blazer for office and formal events. Tailored fit with premium fabric and elegant design.",
            price: 2499,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Blazers",
            created_at: new Date().toISOString(),
            rating: 4.9,
            discount: 25,
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "Navy", "Charcoal", "Burgundy"],
          },
          {
            id: "7",
            name: "Floral Summer Dress",
            description:
              "Light and breezy floral dress perfect for summer outings. Comfortable fabric with beautiful print patterns.",
            price: 1199,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Dresses",
            created_at: new Date().toISOString(),
            rating: 4.3,
            sizes: ["XS", "S", "M", "L"],
            colors: ["Floral Multi", "Floral Blue", "Floral Pink"],
          },
          {
            id: "8",
            name: "Classic Denim Jacket",
            description:
              "Timeless denim jacket that complements any outfit. Durable construction with classic styling.",
            price: 1899,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Jackets",
            created_at: new Date().toISOString(),
            rating: 4.6,
            discount: 30,
            sizes: ["S", "M", "L", "XL"],
            colors: ["Light Blue", "Dark Blue", "Black", "White"],
          },
          {
            id: "9",
            name: "Elegant Evening Gown",
            description: "Stunning evening gown perfect for special occasions. Luxurious fabric with elegant draping.",
            price: 3499,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Dresses",
            created_at: new Date().toISOString(),
            rating: 4.9,
            sizes: ["XS", "S", "M", "L"],
            colors: ["Black", "Navy", "Burgundy", "Emerald"],
          },
          {
            id: "10",
            name: "Casual Hoodie",
            description: "Comfortable hoodie perfect for casual wear. Soft fabric with modern fit and stylish design.",
            price: 1299,
            image_url: "/placeholder.svg?height=500&width=500",
            category: "Hoodies",
            created_at: new Date().toISOString(),
            rating: 4.2,
            discount: 15,
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Grey", "Black", "Navy", "Pink", "White"],
          },
        ]
        setProducts(sampleProducts)
        setError("Using sample data - database connection issue")
      } else {
        setProducts(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))]
  }, [products])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Price range filter
    filtered = filtered.filter((product) => {
      const price = product.discount ? product.price - (product.price * product.discount) / 100 : product.price
      return price >= priceRange.min && price <= priceRange.max
    })

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter((product) => (product.rating || 0) >= selectedRating)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [products, searchQuery, selectedCategory, priceRange, selectedRating, sortBy])

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price
    return Math.round(price - (price * discount) / 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
          <p className="text-gray-600 text-lg">
            Discover our complete collection of premium fashion and lifestyle products
          </p>
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">{error}</div>
          )}
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4}>4+ Stars</option>
                    <option value={3}>3+ Stars</option>
                    <option value={2}>2+ Stars</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedCategory("all")
                      setPriceRange({ min: 0, max: 5000 })
                      setSelectedRating(0)
                      setSearchQuery("")
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-6"
            }
          >
            {filteredAndSortedProducts.map((product) =>
              viewMode === "grid" ? (
                // Grid View
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {product.discount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{product.discount}%
                      </div>
                    )}

                    <button className="absolute top-3 right-3 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100">
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                    </button>

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <Link
                        href={`/products/${product.id}`}
                        className="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                      >
                        Quick View
                      </Link>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                      {product.category}
                    </span>

                    <h3 className="font-semibold text-lg mt-2 mb-2 text-gray-800 line-clamp-2">{product.name}</h3>

                    {product.rating && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {product.discount ? (
                          <>
                            <span className="text-xl font-bold text-blue-600">
                              ₹{calculateDiscountedPrice(product.price, product.discount)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
                        )}
                      </div>

                      <Link
                        href={`/products/${product.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-64 h-64 bg-gray-100">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.discount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                            {product.category}
                          </span>
                          <h3 className="font-semibold text-xl mt-1 text-gray-800">{product.name}</h3>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>

                      {product.rating && (
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                        </div>
                      )}

                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {product.discount ? (
                            <>
                              <span className="text-2xl font-bold text-blue-600">
                                ₹{calculateDiscountedPrice(product.price, product.discount)}
                              </span>
                              <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                          )}
                        </div>

                        <Link
                          href={`/products/${product.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-colors flex items-center"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
