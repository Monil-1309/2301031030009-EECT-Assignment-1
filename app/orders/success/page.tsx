"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Clock,
  Phone,
  MessageCircle,
} from "lucide-react";

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
  paymentStatus: string;
  status: string;
  transactionId?: string;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = () => {
    if (!order) return "";

    switch (order.paymentStatus) {
      case "completed":
        return "Your payment has been confirmed and your order is being processed.";
      case "verification_pending":
        return "Your payment is under verification. We will confirm your order once the payment is verified.";
      case "pending":
        return "Your order has been created. Please complete the payment to confirm your order.";
      default:
        return "Your order has been received.";
    }
  };

  const getStatusColor = () => {
    if (!order) return "text-gray-600";

    switch (order.paymentStatus) {
      case "completed":
        return "text-green-600";
      case "verification_pending":
        return "text-yellow-600";
      case "pending":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {order?.paymentStatus === "completed"
                ? "Order Confirmed!"
                : "Order Received!"}
            </h1>
            <p className={`text-lg ${getStatusColor()}`}>
              {getStatusMessage()}
            </p>
          </div>

          {order && (
            <>
              {/* Order Details */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">
                      Order Information
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-600">Order ID:</span>{" "}
                        <span className="font-medium">{order.id}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Order Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="text-gray-600">Total Amount:</span>{" "}
                        <span className="font-medium">
                          ₹{order.totalAmount}
                        </span>
                      </p>
                      {order.transactionId && (
                        <p>
                          <span className="text-gray-600">Transaction ID:</span>{" "}
                          <span className="font-medium">
                            {order.transactionId}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">
                      Customer Information
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-600">Name:</span>{" "}
                        {order.customerInfo.name}
                      </p>
                      <p>
                        <span className="text-gray-600">Email:</span>{" "}
                        {order.customerInfo.email}
                      </p>
                      <p>
                        <span className="text-gray-600">Phone:</span>{" "}
                        {order.customerInfo.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order Items
                  </h2>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{item.price * item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              What happens next?
            </h3>
            <div className="space-y-3 text-blue-700">
              {order?.paymentStatus === "completed" ? (
                <>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <p>
                      Your order is confirmed and will be processed within 1-2
                      business days.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <p>
                      You will receive a shipping confirmation with tracking
                      details.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <p>
                      Your order will be delivered within 5-7 business days.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      1
                    </div>
                    <p>We are verifying your payment details.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      2
                    </div>
                    <p>
                      Once verified, your order will be confirmed and processed.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                      3
                    </div>
                    <p>You will receive updates via email and SMS.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, feel free to contact
              us:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://wa.me/919099737019"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Support
              </a>

              <a
                href="tel:+919099737019"
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center"
            >
              Continue Shopping
            </Link>

            {order && (
              <Link
                href={`/orders/${order.id}`}
                className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center"
              >
                <Package className="w-5 h-5 inline mr-2" />
                Track Order
              </Link>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
