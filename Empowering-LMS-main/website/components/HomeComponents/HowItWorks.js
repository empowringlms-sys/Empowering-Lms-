"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiUserPlus, FiBookOpen, FiCheckCircle, FiBarChart2, FiArrowRight } from "react-icons/fi";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FiUserPlus className="w-6 h-6" />,
      title: "Add Users",
      description: "Add users individually or import them in bulk with our easy-to-use interface"
    },
    {
      icon: <FiBookOpen className="w-6 h-6" />,
      title: "Assign Courses",
      description: "Assign specific courses or allow users to self-enroll based on their needs"
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Track Progress",
      description: "System automatically tracks and records learner progress through all modules"
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "Generate Reports",
      description: "Comprehensive reporting tools for monitoring compliance and audit readiness"
    }
  ];

  return (
    <section id="how-it-works" className="bg-gradient-to-br from-gray-50 to-white py-12 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It <span className="text-emerald-600">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your learning management with our intuitive platform designed for modern organizations
          </p>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Elevate Your Learning with Our Cutting-Edge LMS
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Transform your organization's learning and development process with our powerful 
                Learning Management System designed for efficiency and scalability.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-8"
            >
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-100">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Transform Your Learning Experience?
                </h4>
                <p className="text-gray-600 mb-6">
                  Join thousands of organizations that have revolutionized their training programs 
                  with our comprehensive LMS solution.
                </p>
                <Link
                  href="/pricing"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-full hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  Get Started Free
                  <FiArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
                <p className="mt-4 text-sm text-gray-500">
                  No credit card required • 14-day free trial • Full access included
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative h-full min-h-[500px] lg:min-h-[600px]"
          >
            {/* Image Container */}
            <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/group-of-medical-staff-at-hospital.jpg"
                alt="Healthcare professionals collaborating in modern hospital setting"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              
              {/* Stats Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">99%</div>
                    <div className="text-sm opacity-90">Satisfaction Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm opacity-90">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm opacity-90">Support</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg max-w-xs"
              >
                <div className="text-sm text-gray-600">
                  "This platform transformed our training efficiency by 300%"
                </div>
                <div className="text-xs text-gray-500 mt-2">- Dr. Sarah Miller, Hospital Director</div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-emerald-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-200 rounded-full opacity-20"></div>
          </motion.div>
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-20 pt-12 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Easy Implementation</h4>
              <p className="text-gray-600">Get started in minutes with our simple setup process</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBarChart2 className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Real-time Analytics</h4>
              <p className="text-gray-600">Monitor progress and performance with live dashboards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Scalable Solution</h4>
              <p className="text-gray-600">Grow from 10 to 10,000+ users without missing a beat</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
