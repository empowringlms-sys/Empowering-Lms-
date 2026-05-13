"use client";
import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  BarChart3,
  Shield,
  Users,
  Rocket,
  Brain,
  Target,
  Clock,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function PlatformFeatures() {
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: false, margin: "-100px" });

  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Setup",
      description:
        "Get started in minutes with our intuitive onboarding process",
      color: "from-emerald-400 to-cyan-500", // STEP 01
      stat: "95%",
      statLabel: "Faster setup",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analytics",
      description: "Smart insights that help optimize your training programs",
      color: "from-blue-400 to-indigo-500", // STEP 02
      stat: "40%",
      statLabel: "Better outcomes",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Scalable For Teams",
      description: "Grow from 10 to 10,000+ users seamlessly",
      color: "from-purple-400 to-pink-500", // STEP 03
      stat: "∞",
      statLabel: "Scalable",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-level security with GDPR & SOC2 compliance",
      color: "from-orange-400 to-amber-500", // STEP 04
      stat: "99.99%",
      statLabel: "Uptime",
    },
  ];

  const highlights = [
    {
      icon: <Target className="w-5 h-5" />,
      text: "Drag-and-drop course builder",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: "Real-time progress tracking",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Performance analytics dashboard",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: "Automated certification",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 px-4 bg-gradient-to-b from-white to-emerald-50/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Platform Excellence
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
              Platform
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A comprehensive solution designed to elevate your training
            experience with cutting-edge technology and unmatched simplicity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Features Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`relative group bg-white rounded-2xl p-6 border-2 cursor-pointer ${
                  hoveredFeature === index
                    ? "border-emerald-200 shadow-2xl"
                    : "border-gray-100 shadow-lg"
                } transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{
                        scale: hoveredFeature === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                    >
                      <div className="text-white">{feature.icon}</div>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: hoveredFeature === index ? 1 : 0.8,
                      opacity: hoveredFeature === index ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 ml-4"
                  >
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {feature.stat}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {feature.statLabel}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Creative Graphics & Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Visual Container */}
            <div className="relative bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 shadow-2xl">
              {/* Floating 3D Elements */}
              <div className="absolute -top-4 -right-4">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-12 h-12 md:w-24 md:h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg md:rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Rocket className="w-6 h-6 md:w-10 md:h-10 text-white" />
                </motion.div>
              </div>

              <div className="absolute -bottom-6 -left-6">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-16 h-16 md:w-32 md:h-32 border-4 border-dashed border-emerald-200 rounded-full flex items-center justify-center"
                >
                  <div className="w-10 h-10 md:w-20 md:h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 md:w-8 md:h-8 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Transform Your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                      Training Experience
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ready to simplify your organization's learning journey?
                    Experience the power of intuitive design and advanced
                    technology.
                  </p>
                </div>

                {/* Interactive Stats Circle */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 border-2 border-dashed border-emerald-200 rounded-full"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        300%
                      </div>
                      <div className="text-sm text-gray-600">
                        Increased Efficiency
                      </div>
                    </div>
                  </div>

                  {/* Animated orbiting dots */}
                  {[0, 90, 180, 270].map((degree, index) => (
                    <motion.div
                      key={index}
                      animate={{
                        rotate: [degree, degree + 360],
                      }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 1,
                      }}
                      className="absolute top-1/2 left-1/2 w-full h-full"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Highlights List */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="text-emerald-600">{highlight.icon}</div>
                      <span className="text-sm font-medium text-gray-700">
                        {highlight.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link href="/about">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-center cursor-pointer"
                  >
                    <button className="group bg-gradient-to-r from-emerald-600 to-green-600 cursor-pointer hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
                      <span>Explore Features</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute -z-10 -inset-4 bg-gradient-to-br from-emerald-100/20 to-blue-100/20 rounded-3xl blur-xl"></div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        {/* <motion.div
          ref={statsRef}
          initial={{ y: 70 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: false }}
          className="mt-20 pt-12 border-t border-gray-200"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: 500,
                suffix: "+",
                label: "Organizations",
                color: "text-emerald-600",
              },
              {
                value: 50,
                suffix: "K+",
                label: "Courses Created",
                color: "text-blue-600",
              },
              {
                value: 1,
                suffix: "M+",
                label: "Learners",
                color: "text-purple-600",
              },
              {
                value: 99.9,
                suffix: "%",
                label: "Satisfaction",
                color: "text-amber-600",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {isInView && (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={1.8}
                      decimals={stat.value % 1 !== 0 ? 1 : 0}
                      suffix={stat.suffix}
                    />
                  )}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
