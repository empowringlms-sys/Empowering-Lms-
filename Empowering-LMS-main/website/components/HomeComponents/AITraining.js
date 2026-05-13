"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AITraining() {
  return (
    <section className="relative w-full bg-gradient-to-br from-emerald-50 to-white overflow-hidden py-12 md:py-28">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-20">

        {/* ================= LEFT CONTENT ================= */}
        <div className="relative z-10 text-center md:text-left">
          {/* <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 500+ educational institutions
          </div> */}

          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your <span className="text-emerald-600">Learning</span> Experience
          </h1>


          <p className="mt-5 text-gray-600 max-w-lg mx-auto md:mx-0 text-base sm:text-lg">
            The all-in-one LMS platform that simplifies course creation, student engagement, and learning analytics.
            Scale your educational programs with enterprise-grade features.
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto mt-5"
          >
            <Link
              href="/pricing"
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-lg "
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* ================= RIGHT VISUAL ================= */}
        <div className="relative flex justify-center mt-8 md:mt-0 -mb-8 md:-mb-12">

          {/* MAIN IMAGE - Increased size */}
          <motion.img
            src="/images/student.png"
            alt="Student"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 w-[320px] sm:w-[380px] md:w-[500px] lg:w-[550px] h-auto object-contain"
            style={{
              maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)'
            }}
          />

        </div>
      </div>

      {/* Bottom fade to attach to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent -mb-1"></div>

    </section>
  );
}
