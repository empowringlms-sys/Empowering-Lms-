"use client";
import React from "react";
import { ArrowRight, Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const FreeTrial = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-xl"
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4 mr-2" />
            Limited Time Offer
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-200">
              Free Trial
            </span>{" "}
            Today
          </h2>

          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Join thousands of educators who are transforming education with our
            platform. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <button className="group bg-gradient-to-r from-white to-gray-100 text-emerald-700 hover:from-gray-100 hover:to-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer">
              Get Started Free
              <ArrowRight className="inline ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="group bg-transparent border-2 border-white/80 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm cursor-pointer">
              <Play className="inline mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Stats with CountUp */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 backdrop-blur-sm bg-white/10 rounded-2xl p-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <CountUp end={500} duration={1.8} />+
              </div>
              <div className="text-emerald-100 text-sm">Institutions</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <CountUp end={50} duration={1.8} />K+
              </div>
              <div className="text-emerald-100 text-sm">Courses</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <CountUp end={1} duration={1.8} />M+
              </div>
              <div className="text-emerald-100 text-sm">Students</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                <CountUp end={99.9} decimals={1} duration={1.8} />%
              </div>
              <div className="text-emerald-100 text-sm">Uptime</div>
            </div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default FreeTrial;
