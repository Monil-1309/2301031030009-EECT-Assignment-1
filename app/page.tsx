import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import FeaturedProducts from "@/components/FeaturedProducts"
import AboutSection from "@/components/AboutSection"
import ContactCTA from "@/components/ContactCTA"
import Footer from "@/components/Footer"
import WhatsAppButton from "@/components/WhatsAppButton"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <ContactCTA />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
