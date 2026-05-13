"use client";
import React from "react";
import { motion } from "framer-motion";
import { Globe, Monitor, Smartphone } from "lucide-react";

const DashboardShowcase = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Learn <span className="text-emerald-600">Anywhere</span>, Anytime
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our platform is fully responsive and works perfectly on all
              devices. Students can learn on their computers, tablets, or
              smartphones.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Monitor className="h-6 w-6 text-emerald-500 mr-3" />
                <span className="text-gray-700">Full desktop experience</span>
              </div>
              <div className="flex items-center">
                <Smartphone className="h-6 w-6 text-emerald-500 mr-3" />
                <span className="text-gray-700">Native-feeling mobile app</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-6 w-6 text-emerald-500 mr-3" />
                <span className="text-gray-700">Works offline with sync</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:translate-x-0"
          >
            <img
              src="/images/dashboard-showcase1.webp"
              alt="Dashboard showcase"
              className="w-full max-w-md h-auto lg:animate-none scale-108"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DashboardShowcase;
