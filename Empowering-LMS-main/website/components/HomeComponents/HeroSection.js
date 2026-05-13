"use client";
import React from "react";
import { _motion } from "framer-motion"; // Will use "framer-motion" but renamed import if needed to avoid conflict... wait, standart import is fine.
import { motion } from "framer-motion";
import Link from "next/link";
import { AreaChart, Area, XAxis, Tooltip, RadialBarChart, RadialBar } from "recharts";
import { ArrowRight, Play, Sparkles, CheckCircle } from "lucide-react";

export default function HeroSection() {
  const chartData = [
    { v: 20 },
    { v: 35 },
    { v: 25 },
    { v: 45 },
    { v: 30 },
    { v: 50 },
    { v: 40 },
  ];

  const radialData = [
    { name: "Passed", value: 67, fill: "#10B981" },
    { name: "Failed", value: 4, fill: "#EF4444" },
    { name: "Paused", value: 4, fill: "#F59E0B" },
    { name: "Overdue", value: 3, fill: "#3B82F6" },
    { name: "Not started", value: 21, fill: "#CBD5E1" },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white py-12 md:py-14 px-4">

      {/* Trusted by badge - Mobile optimized */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center mb-6 md:mb-8"
      >
        <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
          <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
          Trusted by 500+ educational institutions
        </div>
      </motion.div> */}

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto text-center px-4 mb-6 md:mb-12">

        {/* TEXT with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Smart, Seamless, Powerful,
            <br className="hidden sm:block" />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-emerald-600 block mt-2 sm:mt-0 sm:inline"
            >
              Your Training Platform
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-gray-600 mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl"
          >
            A smart, seamless, and powerful platform designed to deliver
            high-value training with ease and scalability.
          </motion.p>
        </motion.div>

        {/* BUTTONS with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/pricing"
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 duration-200 ease-out shadow-lg "
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* LEFT CHART - TOTAL LEARNERS - Responsive positioning */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: [0, -4, 0] }}
        transition={{
          duration: 1,
          delay: 0.8,
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        className="hidden md:block absolute left-2 sm:left-4 md:left-8 top-1/4 bg-white shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 w-[160px] sm:w-[180px] md:w-[200px] z-30"
      >
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs sm:text-sm font-semibold text-gray-700">Total learners</p>
          <span className="text-xs text-gray-400">48</span>
        </div>

        <AreaChart
          width={130}
          height={60}
          data={chartData}
          margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
        >
          <XAxis hide />
          <Tooltip />
          <Area
            dataKey="v"
            stroke="#10B981"
            fill="#A7F3D0"
            strokeWidth={2}
          />
        </AreaChart>
      </motion.div>

      {/* RIGHT CHART - ACTIVE COURSES - Responsive positioning */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1, y: [0, 4, 0] }}
        transition={{
          duration: 1,
          delay: 1,
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        className="hidden md:block absolute right-2 sm:right-4 md:right-8 top-1/4 bg-white shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 w-[180px] sm:w-[200px] md:w-[220px] z-30"
      >
        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">
          Active Courses
        </p>

        <div className="flex justify-center">
          <RadialBarChart
            width={140}
            height={90}
            cx={70}
            cy={70}
            innerRadius={40}
            outerRadius={55}
            startAngle={180}
            endAngle={0}
            data={radialData}
          >
            <RadialBar dataKey="value" cornerRadius={4} />
          </RadialBarChart>
        </div>

        <p className="text-center font-bold text-base sm:text-lg -mt-8">120</p>
        <p className="text-center text-xs text-gray-500">Contents</p>

        <div className="mt-2 space-y-1 text-xs">
          <div className="flex justify-between"><span>Passed</span><span className="font-medium">67%</span></div>
          <div className="flex justify-between"><span>Failed</span><span className="font-medium">4%</span></div>
          <div className="flex justify-between"><span>Paused</span><span className="font-medium">4%</span></div>
        </div>
      </motion.div>

      {/* HERO IMAGE - Responsive */}
      <div className="relative w-full overflow-hidden mt-8 sm:mt-12 md:mt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-emerald-50/30 to-transparent h-1/2"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-transparent to-transparent h-1/2"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent w-1/3"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent w-1/3 right-0"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: 0.4
          }}
          className="relative z-10 w-full flex justify-center"
        >
          {/* Main Image Container */}
          <div className="relative w-full max-w-[900px] mx-auto px-4">
            {/* Glow effect */}
            <motion.div
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full"
            />

            {/* Main Image */}
            <img
              src="/images/student webp.jpg.jpeg"
              alt="Student"
              className="relative z-10 w-full max-w-[700px] mx-auto drop-shadow-xl"
              style={{
                maskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)'
              }}
            />

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 left-1/4 w-8 h-8 sm:w-10 sm:h-10 bg-emerald-300/20 rounded-full blur-md"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-1/4 right-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-green-300/20 rounded-full blur-md"
            />
          </div>
        </motion.div>

        {/* Fade edges for mobile */}
        <div className="absolute top-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-white to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-4 sm:w-8 bg-gradient-to-r from-white to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-4 sm:w-8 bg-gradient-to-l from-white to-transparent"></div>
      </div>

    </section>
  );
}
