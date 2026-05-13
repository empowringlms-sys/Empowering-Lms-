"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  BarChart3,
  UploadCloud,
  Shield,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import HeroSection from "@/components/HomeComponents/HeroSection";
import HowItWorks from "@/components/HomeComponents/HowItWorks";
import AITraining from "@/components/HomeComponents/AITraining";
// import DashboardShowcase from "@/components/HomeComponents/DashboardShowcase";
import ContactSection from "@/components/HomeComponents/ContactSection";
import Steps from "@/components/HomeComponents/Steps";
import PricingPlans from "@/components/PricingPlans";
import FreeTrial from "@/components/HomeComponents/FreeTrial";
import Testimonials from "@/components/HomeComponents/Testimonials";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Course Creation",
      description:
        "Drag-and-drop course builder with multimedia support, quizzes, and assignments.",
      color: "from-teal-400 to-emerald-500",
      bgColor: "bg-gradient-to-br from-teal-50 to-emerald-50",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Student Management",
      description:
        "Comprehensive student tracking, progress monitoring, and engagement analytics.",
      color: "from-cyan-400 to-blue-500",
      bgColor: "bg-gradient-to-br from-cyan-50 to-blue-50",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description:
        "Real-time insights into student performance and course effectiveness.",
      color: "from-indigo-400 to-violet-500",
      bgColor: "bg-gradient-to-br from-indigo-50 to-violet-50",
    },
    {
      icon: <UploadCloud className="h-8 w-8" />,
      title: "Content Creation",
      description:
        "Create course topics using images, videos, documents, audio files, and rich multimedia content.",
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description:
        "Bank-level security with GDPR compliance and data encryption.",
      color: "from-rose-400 to-pink-500",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Certificates",
      description:
        "Automatic course completion certificates with custom branding and verification.",
      color: "from-yellow-400 to-amber-500",
      bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
    },
  ];

  return (
    <div className="">
      <HeroSection />
      <HowItWorks />
      <AITraining />
      {/* <DashboardShowcase /> */}
      <ContactSection />
      
      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 bg-gradient-to-b from-white to-teal-50/20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                One Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From course creation to student analytics, we provide all the
              tools you need to deliver exceptional learning experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                  hoveredCard === index
                    ? "border-emerald-200 shadow-2xl transform -translate-y-2"
                    : "border-gray-100 hover:border-emerald-100 hover:shadow-xl"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <a
                  href="#"
                  className="inline-flex items-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-medium group"
                >
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Background glow on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl ${feature.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}
                ></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <Steps />

      <PricingPlans />

      <FreeTrial />

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}
