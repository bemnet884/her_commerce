"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";

interface HeroProps {
  user: {
    name: string;
    roles: string[];
  };
  isArtist: boolean;
  isAgent: boolean;
  isAdmin: boolean;
  signOutAction: () => void;
}

export default function Hero({ user, isArtist, isAgent, isAdmin, signOutAction }: HeroProps) {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Sticky Navbar */}
      <Navbar
        user={user}
        isArtist={isArtist}
        isAgent={isAgent}
        isAdmin={isAdmin}
        signOutAction={signOutAction}
      />

      <section className="min-h-screen relative pt-20 lg:pt-32">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50" />

          {/* Decorative Shapes */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#3695AB]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E3A857]/10 rounded-full blur-3xl" />
        </div>

        {/* Main Content Container */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-1"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#0F545C] leading-tight"
              >
                Awat
                <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-[#3695AB] font-normal mt-2">
                  Empowering Women
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                Empowering Women, Inspiring Change.
                <span className="block font-semibold text-[#E3A857] text-xl sm:text-2xl mt-2">
                  Join the Movement!
                </span>
                We create opportunities for growth and innovation, connecting talent with purpose.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button className="px-8 py-4 bg-[#E3A857] text-white font-semibold rounded-full hover:bg-[#d6993e] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
                <button className="px-8 py-4 bg-white text-[#3695AB] border-2 border-[#3695AB] font-semibold rounded-full hover:bg-[#3695AB] hover:text-white transition-all duration-300 transform hover:scale-105">
                  Learn More
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0F545C]">500+</div>
                  <div className="text-sm text-gray-600">Women Empowered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0F545C]">50+</div>
                  <div className="text-sm text-gray-600">Programs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0F545C]">10+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Image Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative order-1 lg:order-2"
            >
              {/* Main Image Container */}
              <div className="relative">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#E3A857] to-[#3695AB] rounded-3xl transform rotate-3 scale-105 opacity-20" />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="/hero.jpg"
                    alt="Empowered woman leading change"
                    width={600}
                    height={700}
                    className="w-full h-auto object-cover"
                    priority
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute -top-4 -right-4 bg-[#E3A857] text-white p-4 rounded-2xl shadow-lg"
                >
                  <div className="text-sm font-semibold">🌟</div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="absolute -bottom-4 -left-4 bg-[#3695AB] text-white p-4 rounded-2xl shadow-lg"
                >
                  <div className="text-sm font-semibold">💫</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-gray-500">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
            >
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}