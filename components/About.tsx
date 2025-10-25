"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3695AB]/10 to-[#E3A857]/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-[#E3A857]/20 text-[#E3A857] rounded-full text-sm font-medium">
              About Awat
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#3695AB] to-[#E3A857] bg-clip-text text-transparent">
            Empowering Artisans
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Connecting Ethiopian handcraft artists with digital markets, fair opportunities,
            and nationwide visibility while preserving cultural heritage.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[#E3A857] font-semibold mb-4">
                <div className="w-2 h-2 bg-[#E3A857] rounded-full"></div>
                OUR JOURNEY
              </div>
              <h2 className="text-4xl font-bold text-[#3695AB] mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Awat was founded to connect local Ethiopian artisans — especially women — with
                  digital buyers and local agents. Many talented handcraft creators struggle to
                  sell their products due to limited technology access or visibility.
                </p>
                <p>
                  By bridging this gap, Awat enables them to showcase their unique handmade items,
                  expand their reach, and achieve financial independence while preserving
                  Ethiopia's cultural identity.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#3695AB] to-[#E3A857] rounded-2xl p-8 h-80 flex items-end">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <p className="text-gray-700 italic">
                    "Every stitch tells a story, every pattern carries history. We're here to make sure those stories reach the world."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      Beti B, [25/10/2025 3:25 PM]
      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#3695AB] mb-4">Our Mission & Vision</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Driving sustainable change through technology and tradition
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#E3A857]/20">
              <div className="w-12 h-12 bg-[#E3A857]/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-[#3695AB] mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower Ethiopian artisans by giving them digital access to fair markets,
                agents, and buyers — promoting sustainable economic independence and preserving
                cultural heritage for future generations.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#3695AB]/20">
              <div className="w-12 h-12 bg-[#3695AB]/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-[#3695AB] mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become Ethiopia's leading platform for authentic handmade crafts,
                creating a vibrant digital ecosystem where creativity, culture, and commerce
                thrive together, connecting local artistry with global appreciation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#3695AB] to-[#E3A857] text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-white/80">Artisans Empowered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">80%</div>
              <div className="text-white/80">Women Artisans</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-white/80">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">15</div>
              <div className="text-white/80">Regions Covered</div>
            </div>
          </div>
        </div>
      </section>

      Beti B, [25/10/2025 3:25 PM]
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-[#3695AB] mb-6">Join the Movement</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you're an artist, an agent, or a buyer, Awat is your space to grow,
            connect, and celebrate Ethiopian craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#3695AB] to-[#3695AB] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link
              href="/artisans"
              className="border-2 border-[#3695AB] text-[#3695AB] px-8 py-4 rounded-xl font-semibold hover:bg-[#3695AB] hover:text-white transition-all duration-300"
            >
              Meet Our Artisans
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}