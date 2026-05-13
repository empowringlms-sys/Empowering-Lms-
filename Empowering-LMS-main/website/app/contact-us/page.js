"use client";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  Users,
  Shield,
  Zap,
  Sparkles,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    plan: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        "Thank you for your message! We'll get back to you within 24 hours.",
      );
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        plan: "",
        message: "",
      });
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: ["support@empoweringslms.com", "sales@empoweringslms.com"],
      gradient: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      details: ["Available 24/7", "Average response: 2 mins"],
      gradient: "from-purple-500 to-pink-600",
      bg: "bg-purple-50",
      text: "text-purple-700",
    },
  ];

  const supportFeatures = [
    {
      icon: <Clock className="h-5 w-5" />,
      text: "24/7 Support",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Enterprise Security",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      text: "Fast Response",
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: "Dedicated Account Manager",
    },
  ];

  const plans = [
    "Starter",
    "Professional",
    "Enterprise",
    "Custom Solution",
    "Just have questions",
  ];

  return (
    <div className="bg-gradient-to-b from-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4" />
              We're here to help
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Let's Build Something{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Amazing Together
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8"
            >
              Get expert guidance on implementing our LMS platform for your
              organization. Our team is ready to help you succeed.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12"
          >
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-emerald-600">24h</div>
              <div className="text-sm text-gray-600 mt-2">Response Time</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-emerald-600">500+</div>
              <div className="text-sm text-gray-600 mt-2">
                Institutions Helped
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-emerald-600">99%</div>
              <div className="text-sm text-gray-600 mt-2">
                Satisfaction Rate
              </div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-emerald-600">50+</div>
              <div className="text-sm text-gray-600 mt-2">Countries Served</div>
            </div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send us a message
                  </h2>
                  <p className="text-gray-600">
                    We'll get back to you within 24 hours
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company / Institution
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                      placeholder="Your organization"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are you interested in?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {plans.map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, plan }))
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.plan === plan
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all resize-none"
                    placeholder="Tell us about your learning goals and requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Support Features */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-4">
                  {supportFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg"
                    >
                      {feature.icon}
                      <span className="text-sm text-emerald-700">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Methods & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Contact Methods */}
              <div className="grid gap-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-br ${method.gradient} shadow-md`}
                      >
                        <div className="text-white">{method.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold ${method.text} mb-2`}>
                          {method.title}
                        </h3>
                        <div className="space-y-1">
                          {method.details.map((detail, i) => (
                            <p key={i} className="text-gray-600">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 rounded-full bg-emerald-100">
                          <ArrowRight className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Office Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-8 text-white"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Global Headquarters</h3>
                    <p className="text-emerald-100">
                      San Francisco, California
                    </p>
                  </div>
                </div>
                <p className="text-emerald-100 mb-6">
                  Visit our state-of-the-art office for a personalized demo and
                  see our platform in action.
                </p>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">
                    Regional offices in 12 countries worldwide
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Support */}
      <section className="py-16 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="bg-gradient-to-r from-gray-900 to-emerald-900 rounded-3xl p-8 md:p-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Global Support Team Ready to Help
          </h3>
          <p className="text-emerald-100 mb-6">
            Our team of LMS experts across different time zones ensures
            you get support whenever you need it.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-white text-sm">Available 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-white text-sm">Multilingual Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-white text-sm">
                Dedicated Account Managers
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            {/* Main Circle */}
            <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl">
              <Users className="h-16 w-16 text-emerald-700" />
            </div>

            {/* Globe Circle */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg">
              <Globe className="h-10 w-10 text-white" />
            </div>

            {/* Shield Circle */}
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Add to tailwind.config.js for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
