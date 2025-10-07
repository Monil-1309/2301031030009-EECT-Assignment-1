"use client";
// Extend window type for Razorpay
declare global {
  interface Window {
    Razorpay?: any;
  }
}

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  QrCode,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import PaymentForm from "../../components/PaymentForm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

type PaymentMethod = "upi" | "qr" | "razorpay";

function CheckoutContent() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  // Load Razorpay script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "completed" | "failed"
  >("pending");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [quantityErrors, setQuantityErrors] = useState<{[key: string]: string}>({});

  async function getProductQuantity(productId: string): Promise<number> {
    const { data, error } = await supabase
      .from("products")
      .select("quantity")
      .eq("id", productId)
      .single();
    if (error || !data) return 0;
    return data.quantity ?? 0;
  }

  const handleQuantityChange = async (
    item: { id: string; size?: string; color?: string; quantity: number },
    delta: number
  ) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    const productQuantity = await getProductQuantity(item.id);
    let errorMsg = "";
    if (newQuantity > productQuantity) {
      errorMsg = `Only ${productQuantity} left in stock.`;
      setQuantityErrors((prev) => ({ ...prev, [item.id]: errorMsg }));
      return;
    }
    // Calculate total quantity in cart
    const totalOther = items.reduce(
      (sum, i) =>
        sum +
        (i.id === item.id && i.size === item.size && i.color === item.color
          ? 0
          : i.quantity),
      0
    );
    if (totalOther + newQuantity > 50) {
      errorMsg = "You can only add up to 50 products in total to the cart.";
      setQuantityErrors((prev) => ({ ...prev, [item.id]: errorMsg }));
      return;
    }
    setQuantityErrors((prev) => ({ ...prev, [item.id]: "" }));
    updateQuantity(item.id, newQuantity, item.size, item.color);
  };

  const handleRemoveItem = (item: {
    id: string;
    size?: string;
    color?: string;
  }) => {
    removeFromCart(item.id, item.size, item.color);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUPIPayment = async () => {
    // Create order record first
    const orderData = {
      items,
      customerInfo,
      totalAmount: calculateTotal(),
      paymentMethod: paymentMethod,
    };

    // Save order to database (you'll need to implement this API)
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      // Order created, do nothing here. Razorpay will handle payment popup.
    } else {
      throw new Error("Failed to create order");
    }
  };

  const handleRazorpayPayment = async () => {
    // Initialize Razorpay payment
    const response = await fetch("/api/payment/razorpay/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: calculateTotal(),
        customerInfo,
        items,
      }),
    });

    const data = await response.json();
    const orderId = data.orderId || (data.order && data.order.id);
    const amount = data.amount || (data.order && data.order.amount);

    if (!orderId || !amount) {
      alert("Failed to create Razorpay order. Please try again.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount,
      currency: "INR",
      order_id: orderId,
      name: "Elixlifestyle",
      description: "Purchase from Elixlifestyle",
      handler: function (response: any) {
        handleRazorpaySuccess(response);
      },
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.phone,
      },
    };

    if (typeof window.Razorpay !== "function") {
      alert(
        "Razorpay script not loaded. Please try again or check your internet connection."
      );
      return;
    }
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleRazorpaySuccess = async (response: any) => {
    try {
      const verifyResponse = await fetch("/api/payment/razorpay/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      if (verifyResponse.ok) {
        setPaymentStatus("completed");
        router.push("/orders/success");
      } else {
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setPaymentStatus("failed");
    }
  };

  const handlePayment = async () => {
    // Validate total quantity before payment
    for (const item of items) {
      const productQuantity = await getProductQuantity(item.id);
      if (item.quantity > productQuantity) {
        alert(`Product '${item.name}' only has ${productQuantity} left in stock.`);
        setPaymentStatus("pending");
        return;
      }
    }
    setPaymentStatus("processing");
    try {
      await handleUPIPayment(); // Always create order first
      if (paymentMethod === "razorpay") {
        await handleRazorpayPayment();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No Items to Checkout
          </h1>
          <p className="text-gray-600 mb-8">Your cart is empty.</p>
          <Link
            href="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Continue Shopping
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
          <span className="text-gray-800 font-medium">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex items-center space-x-4 border-b pb-4"
                >
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    {item.size && (
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-sm text-gray-600">
                        Color: {item.color}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => handleQuantityChange(item, -1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => handleQuantityChange(item, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-4 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        onClick={() => handleRemoveItem(item)}
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                    {quantityErrors[item.id] && (
                      <p className="text-sm text-red-600 mt-1">{quantityErrors[item.id]}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Checkout Details
            </h2>

            {/* Customer Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={customerInfo.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

              <div className="space-y-3">
                {/* <div
                  onClick={() => setPaymentMethod("upi")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">UPI Payment</h4>
                      <p className="text-sm text-gray-600">
                        Pay directly with UPI ID - No charges
                      </p>
                    </div>
                    {paymentMethod === "upi" && (
                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </div>
                </div> */}

                {/* <div
                  onClick={() => setPaymentMethod("qr")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === "qr"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <QrCode className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">QR Code Payment</h4>
                      <p className="text-sm text-gray-600">
                        Scan QR code with any UPI app - No charges
                      </p>
                    </div>
                    {paymentMethod === "qr" && (
                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </div>
                </div> */}

                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">Card/UPI via Razorpay</h4>
                      <p className="text-sm text-gray-600">
                        Pay with cards, UPI, wallets - 2% processing fee
                      </p>
                    </div>
                    {paymentMethod === "razorpay" && (
                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {paymentStatus === "processing" && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-600 mr-3"></div>
                  <span className="text-yellow-800">Processing payment...</span>
                </div>
              </div>
            )}

            {paymentStatus === "failed" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-red-800">
                    Payment failed. Please try again.
                  </span>
                </div>
              </div>
            )}

            {/* Proceed to Payment Button */}
            <button
              onClick={handlePayment}
              disabled={paymentStatus === "processing"}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
            >
              {paymentStatus === "processing"
                ? "Processing..."
                : `Pay ₹${calculateTotal()}`}
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Your order will be processed after successful payment
            </p>

            {/* Razorpay & UPI Payment Form */}
            {/* <div className="mt-8">
              <PaymentForm amount={calculateTotal()} />
            </div> */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
