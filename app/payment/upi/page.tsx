"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Smartphone,
  QrCode,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  totalAmount: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  status: string;
}

export default function UPIPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "qr">("qr");
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // UPI Configuration - Replace these with your actual UPI details
  const UPI_ID = "monildesai580@oksbi"; // Replace with your UPI ID
  const BUSINESS_NAME = "Elixlifestyle";
  const UPI_QR_IMAGE = "/QR.jpg"; // Replace with your QR code image path

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else {
        console.error("Failed to fetch order");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopiedUPI(true);
      setTimeout(() => setCopiedUPI(false), 2000);
    } catch (error) {
      console.error("Failed to copy UPI ID:", error);
    }
  };

  const generateUPILink = () => {
    if (!order) return "";

    const amount = order.totalAmount;
    const note = `Payment for Order ${order.id}`;

    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
      BUSINESS_NAME
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const submitPaymentProof = async () => {
    if (!order || !transactionId.trim()) {
      alert("Please enter transaction ID");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("orderId", order.id);
      formData.append("transactionId", transactionId);
      if (paymentProof) {
        formData.append("paymentProof", paymentProof);
      }

      const response = await fetch("/api/payment/verify-upi", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push(`/orders/success?orderId=${order.id}`);
      } else {
        alert("Failed to submit payment proof. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting payment proof:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The order you're looking for doesn't exist.
          </p>
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
            href="/checkout"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Checkout
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">UPI Payment</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Payment Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              UPI Payment Instructions
            </h2>
            <ol className="list-decimal list-inside text-blue-700 space-y-1">
              <li>
                Choose your preferred payment method below (QR Code or UPI ID)
              </li>
              <li>
                Complete the payment using any UPI app (Google Pay, PhonePe,
                Paytm, etc.)
              </li>
              <li>Enter the transaction ID and upload payment screenshot</li>
              <li>Your order will be confirmed after payment verification</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Choose Payment Method
              </h3>

              {/* Payment Method Toggle */}
              <div className="flex space-x-2 mb-6">
                <button
                  onClick={() => setPaymentMethod("qr")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    paymentMethod === "qr"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <QrCode className="w-5 h-5 inline mr-2" />
                  QR Code
                </button>
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    paymentMethod === "upi"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Smartphone className="w-5 h-5 inline mr-2" />
                  UPI ID
                </button>
              </div>

              {paymentMethod === "qr" ? (
                /* QR Code Payment */
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-4">
                    Scan QR Code to Pay
                  </h4>
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 mb-4 inline-block">
                    <Image
                      src={UPI_QR_IMAGE}
                      alt="UPI QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                      onError={(e) => {
                        // Fallback to generated QR code if image not found
                        const target = e.target as HTMLImageElement;
                        target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          generateUPILink()
                        )}`;
                      }}
                    />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Open any UPI app and scan this QR code to pay ₹
                    {order.totalAmount}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <strong>Amount:</strong> ₹{order.totalAmount}
                      <br />
                      <strong>Merchant:</strong> {BUSINESS_NAME}
                      <br />
                      <strong>Order ID:</strong> {order.id}
                    </p>
                  </div>
                </div>
              ) : (
                /* UPI ID Payment */
                <div>
                  <h4 className="font-semibold text-lg mb-4">
                    Pay using UPI ID
                  </h4>
                  <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={UPI_ID}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      />
                      <button
                        onClick={copyUPIId}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        {copiedUPI ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {copiedUPI && (
                      <p className="text-green-600 text-sm mt-1">
                        UPI ID copied!
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount to Pay:</span>
                      <span className="font-semibold">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merchant:</span>
                      <span className="font-semibold">{BUSINESS_NAME}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-semibold">{order.id}</span>
                    </div>
                  </div>

                  <a
                    href={generateUPILink()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    Open UPI App to Pay
                  </a>
                </div>
              )}
            </div>

            {/* Payment Verification */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Payment Verification
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID / UTR Number *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID from your payment app"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    You can find this in your UPI app after completing the
                    payment
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Screenshot (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Upload a screenshot of successful payment for faster
                    verification
                  </p>
                </div>

                <button
                  onClick={submitPaymentProof}
                  disabled={!transactionId.trim() || submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Verify Payment"
                  )}
                </button>
              </div>

              {/* Order Summary */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-semibold text-lg mb-4">Order Summary</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Need Help?
                </h4>
                <p className="text-yellow-700 text-sm mb-3">
                  If you face any issues with payment or verification, please
                  contact us:
                </p>
                <div className="space-y-1 text-sm text-yellow-700">
                  <p>
                    <strong>WhatsApp:</strong> +91 90997 37019
                  </p>
                  <p>
                    <strong>Email:</strong> support@elixlifestyle.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 90997 37019
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
