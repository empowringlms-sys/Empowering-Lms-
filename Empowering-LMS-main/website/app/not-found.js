"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, MoveLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background Shapes */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl mix-blend-multiply" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1 
        }}
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl mix-blend-multiply" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2 
        }}
        className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl mix-blend-multiply" 
      />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Icon Animation */}
        {/* <motion.div
           initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ duration: 0.6, type: "spring" }}
           className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-xl shadow-emerald-100 text-emerald-600"
        >
            <FileQuestion size={48} />
        </motion.div> */}

        {/* 404 Heading */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-7xl md:text-9xl font-black text-gray-900 mb-2 tracking-tighter"
        >
          4<span className="text-emerald-500">0</span>4
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold text-gray-800 mb-6"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
        >
          We searched everywhere but couldn't find the page you're looking for. 
          It might have been removed or the link may be broken.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
           <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-gray-200 bg-white text-gray-700 font-semibold hover:border-emerald-200 hover:text-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MoveLeft size={20} />
            Go Back
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}