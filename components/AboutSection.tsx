export default function AboutSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">About ElixLifestyle</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            ElixLifestyle is your premier destination for high-quality fashion and lifestyle products. We specialize in
            bringing you the latest trends in women's fashion, from casual wear to elegant dresses, all crafted with
            attention to detail and superior quality materials.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👗</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">Carefully selected materials and superior craftsmanship</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping across the country</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Latest Trends</h3>
              <p className="text-gray-600">Stay ahead with our curated fashion collections</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
