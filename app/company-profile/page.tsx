import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Image from "next/image";
import { Award, Users, Globe, Heart } from "lucide-react";

export default function CompanyProfilePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About ElixLifestyle
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your trusted partner in premium fashion and lifestyle products
              since 2020
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Our Story
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  ElixLifestyle was founded with a simple vision: to bring
                  premium quality fashion and lifestyle products to modern
                  consumers who value both style and substance. What started as
                  a small venture has grown into a trusted brand known for
                  quality, reliability, and exceptional customer service.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Our journey began when our founder recognized a gap in the
                  market for affordable yet premium fashion products. Today, we
                  serve thousands of satisfied customers across India,
                  maintaining our commitment to excellence in every piece we
                  offer.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  At ElixLifestyle, we believe that fashion should be
                  accessible, sustainable, and empowering. Every product in our
                  collection is carefully curated to meet our high standards of
                  quality and style.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/elixlifestyle.png"
                  alt="ElixLifestyle Story"
                  width={600}
                  height={500}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Quality First</h3>
                <p className="text-gray-600">
                  We never compromise on quality. Every product undergoes
                  rigorous quality checks.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Customer Centric</h3>
                <p className="text-gray-600">
                  Our customers are at the heart of everything we do. Your
                  satisfaction is our priority.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Sustainability</h3>
                <p className="text-gray-600">
                  We're committed to sustainable practices and ethical sourcing
                  in all our operations.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Passion</h3>
                <p className="text-gray-600">
                  We're passionate about fashion and dedicated to bringing you
                  the latest trends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">5000+</div>
                <div className="text-blue-100">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-100">Products</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4+</div>
                <div className="text-blue-100">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Cities Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To democratize fashion by making premium quality clothing and
                  lifestyle products accessible to everyone, while maintaining
                  the highest standards of quality, service, and customer
                  satisfaction.
                </p>
              </div>
              <div className="bg-blue-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To become India's most trusted and loved fashion and lifestyle
                  brand, known for our commitment to quality, innovation, and
                  customer-centric approach in everything we do.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The passionate people behind ElixLifestyle
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Founder"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="font-semibold text-xl mb-2">Monil Desai</h3>
                <p className="text-blue-600 mb-2">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  Fashion industry veteran with 10+ years of experience in
                  retail and design.
                </p>
              </div>
              <div className="text-center">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Design Head"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="font-semibold text-xl mb-2">Monil Desai</h3>
                <p className="text-blue-600 mb-2">Head of Design</p>
                <p className="text-gray-600 text-sm">
                  Creative director with expertise in contemporary fashion and
                  trend forecasting.
                </p>
              </div>
              <div className="text-center">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Operations Head"
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="font-semibold text-xl mb-2">Monil Desai</h3>
                <p className="text-blue-600 mb-2">Head of Operations</p>
                <p className="text-gray-600 text-sm">
                  Operations expert ensuring smooth supply chain and customer
                  satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Know More?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Get in touch with us for partnerships, collaborations, or any
              questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Contact Us
              </a>
              <a
                href="https://wa.me/919099737019"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
