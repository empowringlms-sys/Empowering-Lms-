"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Globe,
  Rocket,
  Users,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up in minutes with our simple onboarding process.",
    icon: <Rocket className="h-6 w-6" />,
    gradient: "from-emerald-400 to-cyan-500",
    accentColor: "text-emerald-600",
  },
  {
    number: "02",
    title: "Build Your Course",
    description: "Use our intuitive course builder to create engaging content.",
    icon: <BookOpen className="h-6 w-6" />,
    gradient: "from-blue-400 to-indigo-500",
    accentColor: "text-blue-600",
  },
  {
    number: "03",
    title: "Invite Students",
    description: "Share enrollment links or import your student roster.",
    icon: <Users className="h-6 w-6" />,
    gradient: "from-purple-400 to-pink-500",
    accentColor: "text-purple-600",
  },
  {
    number: "04",
    title: "Launch & Grow",
    description: "Go live and use analytics to continuously improve.",
    icon: <Globe className="h-6 w-6" />,
    gradient: "from-orange-400 to-amber-500",
    accentColor: "text-orange-600",
  },
];

const Steps = () => {
  return (
    <section id="how-to-use" className="py-20 bg-gradient-to-b from-emerald-50/30 via-white to-emerald-50/30 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span className="text-emerald-700 font-semibold">
              Simple & Powerful
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Launch Your Academy in{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform from idea to fully functional learning platform in
            minutes, not weeks.
          </p>
        </motion.div>

        <div className="relative">
          {/* Decorative background lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-100 via-blue-100 to-emerald-100 -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
  {steps.map((step, index) => {
    const isFirst = index === 0;
    const isLast = index === steps.length - 1;

    const gradient = isFirst
      ? "from-yellow-400 to-amber-500"
      : isLast
      ? "from-emerald-400 to-green-500"
      : step.gradient;

    const accentColor = isFirst
      ? "text-amber-600"
      : isLast
      ? "text-emerald-600"
      : step.accentColor;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="relative"
      >
        <div className="group relative bg-white rounded-2xl p-8 border-2 border-gray-100 h-full overflow-hidden hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300">
          
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {/* Number */}
          <div className="absolute top-0 right-0">
            <div
              className={`text-7xl font-black text-gray-50 opacity-10 bg-gradient-to-br ${gradient} bg-clip-text`}
            >
              {step.number}
            </div>
          </div>

          {/* Icon */}
          <div className="relative mb-8">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-md opacity-20 group-hover:opacity-30 transition-opacity`}
            ></div>
            <div
              className={`relative w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
            >
              <div className="text-white">{step.icon}</div>
            </div>
          </div>

          <div className="relative">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-br ${gradient}`}
              ></div>
              <span
                className={`text-sm font-semibold ${accentColor} uppercase tracking-wider`}
              >
                Step {step.number}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
              {step.title}
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>

            {/* Check */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-emerald-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Arrows */}
        {index < steps.length - 1 && (
          <>
            <div className="md:hidden absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-emerald-500 rotate-90" />
              </div>
            </div>

            <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-white rounded-full border-2 border-emerald-50 flex items-center justify-center shadow-md">
                <ArrowRight className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  })}
</div>

        </div>

        {/* Completion badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-200 rounded-xl">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="text-emerald-700 font-semibold">
              Complete all steps and launch your academy successfully!
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="/pricing">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-white font-semibold text-lg flex items-center justify-center gap-3">
                Start Your Journey
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Steps;
