"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryModal from "@/components/InquiryModal";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Share2,
  Star,
  Truck,
  Shield,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Globe,
  Send,
  ShoppingBag,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface ProductSpecifications {
  color: string;
  size: string;
  feature: string;
  fabricType: string;
  material: string;
  gender: string;
  season: string;
  design: string;
  skirtStyle: string;
  patternType: string;
  logoPattern: string;
  productType: string;
  style: string;
  skirtType: string;
  pattern: string;
}

interface TradeInformation {
  fobPort: string;
  supplyAbility: string;
  sampleAvailable: string;
  packagingDetails: string;
  mainDomesticMarket: string;
  paymentTerms: string;
  deliveryTime: string;
  samplePolicy: string;
  mainExportMarkets: string;
  certifications: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
  rating?: number;
  discount?: number;
  sizes?: string[];
  colors?: string[];
  quantity?: number; // Add quantity field
  features?: string[];
  specifications?: ProductSpecifications;
  tradeInfo?: TradeInformation;
  images?: string[];
  minimumOrderQuantity?: number;
  pricePerPiece?: number;
  sku?: string;
  fabric?: string;
  specialty?: string;
  availableColors?: number;
  catalogueDetails?: string;
  sizeDetails?: string;
  stitchingType?: string;
  sleeveDetails?: string;
  stockAvailability?: string;
  limitedEdition?: boolean;
  gst?: string;
  shippingExtra?: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("specifications");
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [quantityError, setQuantityError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        // Enhanced sample product data with detailed specifications
        const sampleProduct = {
          id: id,
          name: "Ladies Plain Croptops",
          description:
            "Fabric: Apparel (95% polyester 5% spandex). Specially designed crop top with no-design. Available in 4 colors with premium quality fabric and comfortable fit.",
          price: 199,
          image_url: "/placeholder.svg?height=600&width=600",
          category: "Tops",
          created_at: new Date().toISOString(),
          rating: 4.5,
          discount: 10,
          sizes: ["S", "M", "L", "XL"],
          colors: ["White", "Black", "Navy", "Pink"],
          minimumOrderQuantity: 4,
          pricePerPiece: 199,
          sku: "B101",
          fabric: "Apparel (95% polyester 5% spandex)",
          specialty: "designed crop top with no-design",
          availableColors: 4,
          catalogueDetails: "4 designs (4 different colour, one size)",
          sizeDetails: "S(34), M(36), L(38 & XL(40))",
          stitchingType: "Full Stitched",
          sleeveDetails: "sleeveless",
          stockAvailability: "Single not available",
          limitedEdition: true,
          gst: "5% Extra",
          shippingExtra: true,
          specifications: {
            color: "All",
            size: "S, M, L, XL",
            feature: "Casual Top",
            fabricType: "Other",
            material: "Apparel (95% polyester 5% spandex)",
            gender: "Female",
            season: "Other",
            design: "Plain",
            skirtStyle: "Jeanie",
            patternType: "Western",
            logoPattern: "No",
            productType: "Western Crop Top",
            style: "Trending",
            skirtType: "Casual",
            pattern: "Casual Plain",
          },
          tradeInfo: {
            fobPort: "Mumbai",
            supplyAbility: "1000 Piece Per Day",
            sampleAvailable: "Yes",
            packagingDetails: "Regular Packing",
            mainDomesticMarket: "All India",
            paymentTerms:
              "Cash in Advance (CID) Cheque Telegraphic Transfer (T/T) Cash Advance (CA) Western Union",
            deliveryTime: "5 Days",
            samplePolicy:
              "Sample costs shipping and taxes has to be paid by the buyer",
            mainExportMarkets:
              "Asia Australia Central America North America South America Eastern Europe Western Europe Middle East Africa",
            certifications:
              "Export Licenses & Business Registration Certificate",
          },
          images: [
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
          ],
        };
        setProduct(sampleProduct);
        setSelectedSize(sampleProduct.sizes?.[0] || "");
        setSelectedColor(sampleProduct.colors?.[0] || "");
        fetchRelatedProducts(sampleProduct.category);
      } else {
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || "");
        setSelectedColor(data.colors?.[0] || "");
        fetchRelatedProducts(data.category);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", params.id)
        .limit(4);

      if (!error && data) {
        setRelatedProducts(data);
      } else {
        // Sample related products
        const sampleRelated = [
          {
            id: "2",
            name: "Cotton Summer Top",
            description: "Soft cotton top perfect for summer days",
            price: 799,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Tops",
            created_at: new Date().toISOString(),
            rating: 4.4,
          },
          {
            id: "3",
            name: "Casual Striped Top",
            description: "Trendy striped top for casual wear",
            price: 999,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Tops",
            created_at: new Date().toISOString(),
            rating: 4.6,
            discount: 15,
          },
          {
            id: "4",
            name: "Elegant Blouse",
            description: "Professional blouse for office wear",
            price: 1299,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Tops",
            created_at: new Date().toISOString(),
            rating: 4.7,
          },
        ];
        setRelatedProducts(sampleRelated);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return Math.round(price - (price * discount) / 100);
  };

  const handleWhatsAppInquiry = () => {
    if (product) {
      const message = `Hi! I'm interested in ${product.name} (₹${product.price}). 
Size: ${selectedSize}, Color: ${selectedColor}, Quantity: ${quantity}. 
Can you provide more details?`;
      const url = `https://wa.me/919099737019?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images!.length) % product.images!.length
      );
    }
  };

  const handleBuyNow = () => {
    if (product) {
      if (quantity > (product.quantity ?? 0)) {
        setQuantityError(
          `You can only buy up to ${product.quantity} products.`
        );
        return;
      }
      setQuantityError("");
      // Use the actual selected quantity, but enforce minimum order quantity
      const minQty = product.minimumOrderQuantity || 1;
      const finalQuantity = quantity < minQty ? minQty : quantity;
      if (finalQuantity > 50) {
        alert("You can only add up to 50 products.");
        return;
      }
      const unitPrice = product.discount
        ? calculateDiscountedPrice(product.price, product.discount)
        : product.price;
      const cartItem = {
        id: product.id,
        name: product.name,
        price: unitPrice,
        quantity: finalQuantity,
        size: selectedSize,
        color: selectedColor,
        image_url: product.image_url,
      };
      addToCart(cartItem);
      router.push("/checkout");
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setQuantityError("Please login to add items to cart.");
      router.push("/login");
      return;
    }
    if (product) {
      if (quantity > (product.quantity ?? 0)) {
        setQuantityError(
          `You can only add up to ${product.quantity} products.`
        );
        return;
      }
      setQuantityError("");
      const minQty = product.minimumOrderQuantity || 1;
      const finalQuantity = quantity < minQty ? minQty : quantity;
      if (finalQuantity > 50) {
        alert("You can only add up to 50 products.");
        return;
      }
      const unitPrice = product.discount
        ? calculateDiscountedPrice(product.price, product.discount)
        : product.price;
      const cartItem = {
        id: product.id,
        name: product.name,
        price: unitPrice,
        quantity: finalQuantity,
        size: selectedSize,
        color: selectedColor,
        image_url: product.image_url,
      };
      addToCart(cartItem);
      alert("Added to cart!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8">
          <Link
            href="/products"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.category}</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative aspect-square">
                <Image
                  src={
                    product.images &&
                    Array.isArray(product.images) &&
                    product.images.length > 0
                      ? product.images[currentImageIndex] ||
                        product.image_url ||
                        "/placeholder.svg"
                      : product.image_url || "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}% OFF
                  </div>
                )}

                <button
                  onClick={handleShare}
                  className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>

                {/* Image Navigation */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
              {product.sku && (
                <span className="ml-2 text-gray-500 text-sm">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating!)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg text-gray-600 ml-2">
                  ({product.rating})
                </span>
                <span className="text-gray-400 ml-2">• 127 reviews</span>
              </div>
            )}

            {/* Price and Quantity Info */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Price</span>
                  {product.discount ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-blue-600">
                        ₹
                        {calculateDiscountedPrice(
                          product.price,
                          product.discount
                        )}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.price}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-blue-600">
                      ₹{product.pricePerPiece || product.price} INR/Piece
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {product.sizeDetails && (
                  <p className="text-sm text-gray-600 mt-2">
                    {product.sizeDetails}
                  </p>
                )}
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">
                  Color: {selectedColor}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                        selectedColor === color
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {product.availableColors && (
                  <p className="text-sm text-gray-600 mt-2">
                    Available in {product.availableColors} colors
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() =>
                    setQuantity(
                      Math.max(product.minimumOrderQuantity || 1, quantity - 1)
                    )
                  }
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => {
                    if (quantity >= (product?.quantity ?? 0)) {
                      setQuantityError(
                        `You can only add up to ${
                          product?.quantity ?? 0
                        } products.`
                      );
                      return;
                    }
                    setQuantityError("");
                    setQuantity(quantity + 1);
                  }}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {quantityError && (
                <p className="text-sm text-red-600 mt-1">{quantityError}</p>
              )}
              {product.minimumOrderQuantity && (
                <p className="text-sm text-gray-600 mt-2">
                  Minimum order: {product.minimumOrderQuantity} pieces
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={handleBuyNow}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
              >
                <ShoppingBag className="w-6 h-6 mr-3" />
                Buy Now - ₹{/* Show total price for minimum order quantity */}
                {(() => {
                  const unitPrice = product.discount
                    ? calculateDiscountedPrice(product.price, product.discount)
                    : product.price;
                  const minQty = product.minimumOrderQuantity || 1;
                  return unitPrice * Math.max(minQty, quantity);
                })()}
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              {/* DEBUG INFO: Remove after troubleshooting */}
              {/* <div style={{ color: "red", marginTop: 8 }}>
                <strong>DEBUG:</strong> Price: ₹{product.price}, Discount:{" "}
                {product.discount || 0}%, Min Qty:{" "}
                {product.minimumOrderQuantity || 1}, Final Unit Price: ₹
                {product.discount
                  ? calculateDiscountedPrice(product.price, product.discount)
                  : product.price}
              </div> */}

              {/* <button
                onClick={() => setShowInquiryModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
              >
                <Send className="w-6 h-6 mr-3" />
                Send Inquiry
              </button> */}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp
                </button>
                <a
                  href="tel:+919099737019"
                  className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Truck className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Fast Delivery</span>
                  <span className="text-xs text-gray-500">
                    {product.tradeInfo?.deliveryTime || "5 Days"}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Quality Assured</span>
                  <span className="text-xs text-gray-500">Premium</span>
                </div>
                <div className="flex flex-col items-center">
                  <Globe className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Export Quality</span>
                  <span className="text-xs text-gray-500">Worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-16">
          <div className="border-b">
            <div className="flex space-x-8 px-8 overflow-x-auto">
              {["specifications", "trade-info", "description"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium capitalize transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "specifications" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  Product Specifications
                </h3>
                {product.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-3 border-b border-gray-200"
                        >
                          <span className="font-medium text-gray-800 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Specifications will be updated soon.
                  </p>
                )}
              </div>
            )}

            {activeTab === "trade-info" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  Trade Information
                </h3>
                {product.tradeInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.tradeInfo).map(([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-4">
                        <span className="font-medium text-gray-800 capitalize block mb-2">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Trade information will be updated soon.
                  </p>
                )}
              </div>
            )}

            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Product Description
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {product.description}
                  </p>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.fabric && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Fabric
                      </h4>
                      <p className="text-gray-600">{product.fabric}</p>
                    </div>
                  )}
                  {product.specialty && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Specialty
                      </h4>
                      <p className="text-gray-600">{product.specialty}</p>
                    </div>
                  )}
                  {product.stitchingType && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Stitching Type
                      </h4>
                      <p className="text-gray-600">{product.stitchingType}</p>
                    </div>
                  )}
                  {product.sleeveDetails && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Sleeve Details
                      </h4>
                      <p className="text-gray-600">{product.sleeveDetails}</p>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Additional Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {product.stockAvailability && (
                      <div>
                        <span className="font-medium">Stock:</span>{" "}
                        {product.stockAvailability}
                      </div>
                    )}
                    {product.gst && (
                      <div>
                        <span className="font-medium">GST:</span> {product.gst}
                      </div>
                    )}
                    {product.shippingExtra && (
                      <div>
                        <span className="font-medium">Shipping:</span> Extra
                        charges apply
                      </div>
                    )}
                    {product.limitedEdition && (
                      <div>
                        <span className="font-medium">Edition:</span> Limited
                        Edition
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <Image
                      src={relatedProduct.image_url || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {relatedProduct.discount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{relatedProduct.discount}%
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <Link
                        href={`/products/${relatedProduct.id}`}
                        className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-100"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                      {relatedProduct.category}
                    </span>
                    <h3 className="font-semibold text-lg mt-2 mb-2 text-gray-800 line-clamp-2">
                      {relatedProduct.name}
                    </h3>

                    {relatedProduct.rating && (
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(relatedProduct.rating!)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          ({relatedProduct.rating})
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {relatedProduct.discount ? (
                          <>
                            <span className="text-xl font-bold text-blue-600">
                              ₹
                              {calculateDiscountedPrice(
                                relatedProduct.price,
                                relatedProduct.discount
                              )}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{relatedProduct.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-blue-600">
                            ₹{relatedProduct.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <InquiryModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={quantity}
        />
      )}
    </div>
  );
}
