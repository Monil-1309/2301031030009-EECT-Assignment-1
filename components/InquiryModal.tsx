"use client";

import type React from "react";

import { useState } from "react";
import {
  X,
  Send,
  MessageCircle,
  Phone,
  Mail,
  User,
  Package,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sku?: string;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export default function InquiryModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColor,
  quantity,
}: InquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const inquiryData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        productName: product.name,
        productId: product.id,
        productPrice: product.price,
        productCategory: product.category,
        productSku: product.sku || "",
        selectedSize,
        selectedColor,
        quantity,
        inquiryType: "Product Inquiry",
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbyS9obrHA4B3nUdb_YrxSODPI_vuk5fUd8IFHPOujhjKftz_3to4OZ0CQiR9zIzEH4j/exec`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inquiryData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          setSubmitStatus("success");
          // Reset form and close after delay
          setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
          });
          setTimeout(() => {
            onClose();
            setSubmitStatus("idle");
          }, 2000);
        } else {
          setSubmitStatus("error");
        }
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const message = `Hi! I'm interested in ${product.name} (₹${product.price}).
    
Product Details:
- Size: ${selectedSize}
- Color: ${selectedColor}
- Quantity: ${quantity}
- SKU: ${product.sku || "N/A"}

Customer Details:
- Name: ${formData.name}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Company: ${formData.company || "Individual"}

Message: ${
      formData.message || "Please provide more details about this product."
    }

Looking forward to your response!`;

    const url = `https://wa.me/919099737019?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Send Product Inquiry
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Summary */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {product.name}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  Price: ₹{product.price} | Category: {product.category}
                </p>
                <p>
                  Size: {selectedSize} | Color: {selectedColor} | Quantity:{" "}
                  {quantity}
                </p>
                {product.sku && <p>SKU: {product.sku}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {submitStatus === "success" && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Inquiry sent successfully! We'll contact you soon.
              </div>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Sorry, there was an error sending your inquiry. Please try again
              or contact us directly.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your company name (optional)"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide any additional details about your inquiry..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting || submitStatus === "success"}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Sending...
                </>
              ) : submitStatus === "success" ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sent Successfully!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-3" />
                  Send Inquiry
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppInquiry}
              disabled={!formData.name || !formData.phone}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Send via WhatsApp
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Or call us directly at{" "}
              <a
                href="tel:+919099737019"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                +91 90997 37019
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
