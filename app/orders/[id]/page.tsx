"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
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
    address: string;
    city: string;
    pincode: string;
    state: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    image_url: string;
  }>;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
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

  const getStatusSteps = () => {
    if (!order) return [];

    const steps = [
      { id: "placed", label: "Order Placed", icon: Package, completed: true },
      {
        id: "payment",
        label: "Payment",
        icon: CheckCircle,
        completed: order.paymentStatus === "completed",
      },
      {
        id: "processing",
        label: "Processing",
        icon: Clock,
        completed: ["confirmed", "processing", "shipped", "delivered"].includes(
          order.status
        ),
      },
      {
        id: "shipped",
        label: "Shipped",
        icon: Truck,
        completed: ["shipped", "delivered"].includes(order.status),
      },
      {
        id: "delivered",
        label: "Delivered",
        icon: MapPin,
        completed: order.status === "delivered",
      },
    ];

    return steps;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "confirmed":
      case "delivered":
        return "text-green-600 bg-green-100";
      case "processing":
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "verification_pending":
      case "pending_payment":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending_payment":
        return "Pending Payment";
      case "verification_pending":
        return "Payment Verification Pending";
      case "confirmed":
        return "Confirmed";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
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

  const statusSteps = getStatusSteps();

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
          <span className="text-gray-800 font-medium">Order #{order.id}</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Order #{order.id}
                </h1>
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {formatStatus(order.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Status
            </h2>

            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === statusSteps.length - 1;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <p
                        className={`text-sm mt-2 text-center ${
                          step.completed
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>

                    {!isLast && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          step.completed ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
                  >
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-sm text-gray-600">
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-600">
                          Color: {item.color}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
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

            {/* Order & Payment Details */}
            <div className="space-y-6">
              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Information
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {formatStatus(order.paymentStatus)}
                    </span>
                  </div>
                  {order.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">{order.transactionId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Shipping Information
                </h2>

                <div className="space-y-2">
                  <p className="font-medium">{order.customerInfo.name}</p>
                  <p className="text-gray-600">{order.customerInfo.phone}</p>
                  <p className="text-gray-600">{order.customerInfo.email}</p>
                  {order.customerInfo.address && (
                    <div className="text-gray-600">
                      <p>{order.customerInfo.address}</p>
                      <p>
                        {order.customerInfo.city}, {order.customerInfo.state} -{" "}
                        {order.customerInfo.pincode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">Need Help?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Contact us for any questions about your order
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://wa.me/919099737019"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </a>

                  <a
                    href="tel:+919099737019"
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </a>
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
