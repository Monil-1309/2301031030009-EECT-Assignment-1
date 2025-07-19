import Link from "next/link";
import { MessageCircle, Phone, Mail } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Contact us today for inquiries or to place your order
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors flex items-center"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Us
          </Link>
          <a
            href="https://wa.me/919099737019"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </a>
          <a
            href="tel:+919099737019"
            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
