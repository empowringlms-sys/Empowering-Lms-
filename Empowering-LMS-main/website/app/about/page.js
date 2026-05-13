"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  Sparkles,
  Award,
  Globe,
  Heart,
  TrendingUp,
  Shield,
  Zap,
  BookOpen,
  Brain,
  Rocket,
  BarChart,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Lightbulb,
  GraduationCap,
  Layers,
  Monitor,
  BarChart2,
  Scale,
  TargetIcon,
  Eye,
  TrendingUp as TrendingUpIcon,
  RefreshCw,
  Book,
  FileText,
  ChartBar,
  Cloud,
  Cpu,
  Users as UsersIcon,
  Award as AwardIcon,
  LineChart,
} from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
  const lmsFeatures = [
    {
      icon: <Layers className="w-7 h-7" />,
      title: "Centralized Platform",
      description:
        "One platform to manage all training, onboarding, and development programs",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: <Eye className="w-7 h-7" />,
      title: "Real-time Monitoring",
      description:
        "Track learner progress and compliance with live insights and analytics",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Scale className="w-7 h-7" />,
      title: "Scalable Architecture",
      description:
        "Grow from 10 to 10,000+ users with consistent performance and outcomes",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: <ChartBar className="w-7 h-7" />,
      title: "Performance Analytics",
      description:
        "Measure learning impact with detailed reports and performance tracking",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const team = [
    {
      name: "Alex Morgan",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
      expertise: "EdTech Visionary",
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
      expertise: "Technology Innovation",
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      expertise: "User Experience",
    },
    {
      name: "Emma Wilson",
      role: "Head of Learning",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
      expertise: "Educational Psychology",
    },
  ];

  const simplifiedLearning = [
    {
      icon: <Book className="w-6 h-6" />,
      title: "Course Creation",
      description:
        "Create and assign learning programs without complex processes",
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: "Team Management",
      description: "Manage learners, groups, and permissions effortlessly",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Certification Tracking",
      description: "Automate certification and compliance requirements",
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Progress Reports",
      description: "Generate clear, actionable reports in minutes",
    },
  ];

  const smartMonitoring = [
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Live Dashboards",
      description: "Real-time insights into learner engagement and progress",
    },
    {
      icon: <TargetIcon className="w-6 h-6" />,
      title: "Goal Tracking",
      description: "Set and monitor learning objectives and KPIs",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Analytics",
      description: "Track time spent and learning efficiency",
    },
    {
      icon: <AwardIcon className="w-6 h-6" />,
      title: "Achievement Recognition",
      description: "Automated badges and certification awards",
    },
  ];

  const impactStats = [
    {
      value: "85%",
      label: "Faster Onboarding",
      description: "Reduced training time",
    },
    {
      value: "3x",
      label: "Engagement Increase",
      description: "Higher learner participation",
    },
    {
      value: "99%",
      label: "Compliance Rate",
      description: "Improved regulatory adherence",
    },
    {
      value: "40%",
      label: "Cost Reduction",
      description: "Lower training expenses",
    },
  ];

  const values = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Simplicity First",
      description:
        "We eliminate complexity, making learning management intuitive and accessible",
    },
    {
      icon: <TrendingUpIcon className="w-8 h-8" />,
      title: "Measurable Growth",
      description:
        "Every feature is designed to track and demonstrate real learning impact",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Reliability",
      description: "Enterprise-grade security and 99.9% uptime guarantee",
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Continuous Improvement",
      description:
        "We evolve with your needs, constantly enhancing our platform",
    },
  ];

  const journey = [
    {
      year: "2020",
      milestone: "Founded with a vision to transform digital learning",
    },
    {
      year: "2021",
      milestone: "Launched first version with 50+ organizations",
    },
    {
      year: "2022",
      milestone: "Introduced AI-powered analytics and mobile learning",
    },
    { year: "2023", milestone: "Expanded to serve global enterprise clients" },
    {
      year: "2024",
      milestone: "500+ organizations trust our platform worldwide",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section - About Our LMS */}
      <section className="relative overflow-hidden py-8 px-4 pb-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
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
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-emerald-700 rounded-full text-sm font-medium mb-4 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Transforming Learning Management
            </div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              About Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600">
                Learning Platform
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-10 font-light leading-relaxed"
            >
              Our LMS is built to help organizations manage training,
              onboarding, and professional development in a smarter and more
              efficient way. We simplify learning while keeping performance,
              compliance, and growth at the center.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/pricing"
                className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl inline-flex items-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/#features"
                className="group bg-white/90 backdrop-blur-sm border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-xl transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>Explore Features</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* LMS Overview Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
              <Monitor className="w-4 h-4" />
              Smart Learning Management
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              A Smarter Way to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Manage Learning
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our Learning Management System brings all your training,
              onboarding, and development programs into one centralized
              platform. Designed for ease of use, it helps organizations deliver
              learning efficiently without complexity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                Who We Are & What We Do
              </div>

              <h3 className="text-3xl font-bold text-gray-900">
                Simplified Learning Management
              </h3>

              <p className="text-lg text-gray-600">
                From assigning courses to tracking performance and
                certifications, our LMS ensures transparency, accountability,
                and measurable growth for teams of all sizes.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {simplifiedLearning.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-emerald-600">{item.icon}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {lmsFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                      >
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Floating element */}
                <div className="absolute -top-6 -right-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl"
                  >
                    <Rocket className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                <Target className="w-4 h-4" />
                Our Mission
              </div>

              <h2 className="text-4xl font-bold text-gray-900">
                Transforming Education Through{" "}
                <span className="text-emerald-600">Technology</span>
              </h2>

              <p className="text-lg text-gray-600">
                At Empowering Services Solution, we believe that technology
                should enhance, not replace, the human element of learning. Our
                platform bridges the gap between traditional education and
                digital innovation.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Make learning accessible to everyone
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Empower educators with powerful tools
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Drive measurable learning outcomes
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Our Vision
                    </h3>
                    <p className="text-emerald-600">The Future of Learning</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700">
                    We envision a world where every organization has access to
                    powerful learning tools that adapt to individual needs,
                    measure real impact, and scale effortlessly.
                  </p>

                  <div className="bg-white/50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-sm text-gray-600 italic">
                      "By 2030, we aim to empower 10 million learners worldwide
                      with accessible, effective, and engaging learning
                      experiences."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section 2 */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Target className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-sm text-emerald-300 font-medium">
                      Our Mission
                    </div>
                    <h3 className="text-2xl font-bold">
                      Empower Through Learning
                    </h3>
                  </div>
                </div>

                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Our mission is to empower organizations and learners by
                  delivering a modern learning platform that improves skills,
                  confidence, and productivity.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">
                      Enhance professional skills through accessible learning
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">
                      Build confidence through measurable progress tracking
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">
                      Increase productivity with efficient training delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-3xl p-10 shadow-2xl border border-emerald-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-600 font-medium">
                      Our Vision
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      The Future of Digital Learning
                    </h3>
                  </div>
                </div>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We envision a future where learning is continuous, measurable,
                  and accessible to everyone through smart digital solutions.
                </p>

                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-100">
                  <p className="text-gray-700 italic">
                    "By making learning intuitive, measurable, and scalable,
                    we're building a foundation for continuous growth and
                    innovation in organizations worldwide."
                  </p>
                </div>

                <div className="mt-10">
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 group"
                  >
                    <span>Discuss Your Learning Goals</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact & Results Section */}
      <section id="impact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              <TrendingUpIcon className="w-4 h-4" />
              Proven Results
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Impact,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                Measurable Results
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Smart Monitoring Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-10 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
                  <BarChart2 className="w-4 h-4" />
                  Smart Monitoring & Analytics
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Track Progress with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    Real-time Insights
                  </span>
                </h3>

                <p className="text-lg text-gray-600 mb-8">
                  Our advanced monitoring tools provide clear visibility into
                  learner progress, certifications, and compliance requirements
                  with actionable insights.
                </p>

                <div className="space-y-4">
                  {smartMonitoring.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <div className="text-emerald-600">{item.icon}</div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <div className="text-center mb-8">
                    <div className="text-5xl font-bold text-emerald-600 mb-2">
                      360°
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      Learning Visibility
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Course Completion</span>
                        <span className="font-semibold text-emerald-600">
                          94%
                        </span>
                      </div>
                      <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "94%" }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Assessment Scores</span>
                        <span className="font-semibold text-emerald-600">
                          88%
                        </span>
                      </div>
                      <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "88%" }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Engagement Rate</span>
                        <span className="font-semibold text-emerald-600">
                          92%
                        </span>
                      </div>
                      <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "92%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Journey Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-8">
                <Heart className="w-4 h-4" />
                Our Core Values
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                What Guides{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                  Everything We Do
                </span>
              </h3>

              <div className="space-y-6">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-emerald-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-emerald-600">{value.icon}</div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {value.title}
                      </h4>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Our Journey So Far</h3>
                    <p className="text-gray-300">Milestones and achievements</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {journey.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="font-bold">{item.year}</span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-gray-300">{item.milestone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="team" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Meet Our Leaders
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Minds Behind Our Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A team of passionate innovators dedicated to transforming
              education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className="mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-emerald-100">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 text-center font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    {member.expertise}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              Ready to Transform?
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Start Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-200">
                Learning Transformation
              </span>{" "}
              Today
            </h2>

            <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
              Join organizations worldwide that have revolutionized their
              training and development programs with our intelligent learning
              platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/pricing"
                className="group bg-gradient-to-r from-white to-gray-100 text-emerald-700 hover:from-gray-100 hover:to-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact-us"
                className="group bg-transparent border-2 border-white/80 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm inline-flex items-center gap-2"
              >
                <span>Request a Demo</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
