"use client"

import { MessageCircle } from "lucide-react"

export default function WhatsAppButton() {
  const whatsappNumber = "919876543210"
  const message = "Hi! I'm interested in your products. Can you help me?"

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  )
}
