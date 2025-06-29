"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { Star, Heart, ShoppingBag } from "lucide-react"

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
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .limit(8)
        .order("created_at", { ascending: false })

      if (fetchError) {
        console.error("Supabase error:", fetchError)
        // Fallback to sample data
        const sampleProducts = [
          {
            id: "1",
            name: "Ladies Plain Casual Top",
            description: "Comfortable and stylish casual top for everyday wear. Made from premium cotton blend fabric.",
            price: 899,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Tops",
            created_at: new Date().toISOString(),
            rating: 4.5,
            discount: 10,
          },
          {
            id: "2",
            name: "Ladies Bodycon Printed Dress",
            description:
              "Elegant printed dress perfect for special occasions. Flattering bodycon fit with beautiful prints.",
            price: 1299,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Dresses",
            created_at: new Date().toISOString(),
            rating: 4.8,
            discount: 15,
          },
          {
            id: "3",
            name: "Western One-piece Dress",
            description: "Modern western style dress for contemporary look. Perfect for office or casual outings.",
            price: 1599,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Dresses",
            created_at: new Date().toISOString(),
            rating: 4.6,
          },
          {
            id: "4",
            name: "Ladies Professional Shirt",
            description: "Professional shirt perfect for office wear. Crisp, clean lines with comfortable fit.",
            price: 999,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Shirts",
            created_at: new Date().toISOString(),
            rating: 4.7,
            discount: 20,
          },
          {
            id: "5",
            name: "Cotton Summer Top",
            description: "Soft cotton top perfect for summer days. Breathable fabric with stylish design.",
            price: 799,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Tops",
            created_at: new Date().toISOString(),
            rating: 4.4,
          },
          {
            id: "6",
            name: "Formal Business Blazer",
            description: "Professional blazer for office and formal events. Tailored fit with premium fabric.",
            price: 2499,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Blazers",
            created_at: new Date().toISOString(),
            rating: 4.9,
            discount: 25,
          },
          {
            id: "7",
            name: "Floral Summer Dress",
            description: "Light and breezy floral dress perfect for summer outings. Comfortable and stylish.",
            price: 1199,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Dresses",
            created_at: new Date().toISOString(),
            rating: 4.3,
          },
          {
            id: "8",
            name: "Classic Denim Jacket",
            description: "Timeless denim jacket that complements any outfit. Durable and fashionable.",
            price: 1899,
            image_url: "/placeholder.svg?height=400&width=400",
            category: "Jackets",
            created_at: new Date().toISOString(),
            rating: 4.6,
            discount: 30,
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

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price
    return Math.round(price - (price * discount) / 100)
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Most Popular Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-80 rounded-lg mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-300 h-6 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Most Popular Products</h2>
          <p className="text-gray-600 text-lg">Discover our best-selling fashion items</p>
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mt-4 inline-block">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gray-100 aspect-square">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100">
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                </button>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Link
                    href={`/products/${product.id}`}
                    className="bg-white text-gray-800 px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                  >
                    Quick View
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Category */}
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">{product.category}</span>

                {/* Product Name */}
                <h3 className="font-semibold text-lg mt-2 mb-2 text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
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

                {/* Price */}
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
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors inline-flex items-center"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
