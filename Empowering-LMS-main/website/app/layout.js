import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer/Footer";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://empowerings-lms.com"),
  title: {
    default: "Empowerings LMS",
    template: "%s | Empowerings LMS",
  },
  description: "Empowerings LMS is the future of learning management. A comprehensive platform for course creation, student management, and advanced analytics for organizations.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Empowerings LMS - The Future of Learning Management",
    description: "Transform your organization's learning experience with our comprehensive platform for course creation, student management, and advanced analytics.",
    url: "https://empowerings-lms.com",
    siteName: "Empowerings LMS",
    images: [
      {
        url: "/images/full-lms-showcase.png",
        width: 1200,
        height: 630,
        alt: "Empowerings LMS Platform Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Empowerings LMS - The Future of Learning Management",
    description: "Transform your organization's learning experience with our comprehensive platform for course creation, student management, and advanced analytics.",
    images: ["/images/full-lms-showcase.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <div className="pt-20">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
