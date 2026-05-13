"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo / Description */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <img
                src="/logo.png"
                className="h-12 w-12 rounded-lg bg-white"
                alt="Empowerings Logo"
              />
              <span className="text-2xl font-bold">Empowerings</span>
            </div>
            <p className="text-gray-400">
              The future of learning management. Empowering educators and
              students worldwide.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            {/* Product */}
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/#features" className="hover:text-white">LMS Features</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/#how-to-use" className="hover:text-white">How To Use</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact-us" className="hover:text-white">Contact US</Link></li>
                <li><Link href="/about" className="hover:text-white">About LMS</Link></li>
                <li><Link href="/about#team" className="hover:text-white">The Team</Link></li>
                <li><Link href="/about#mission" className="hover:text-white">Our Mission</Link></li>
                <li><Link href="/about#impact" className="hover:text-white">Impact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Empowerings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// orignal
