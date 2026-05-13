export const metadata = {
  title: "Contact Us | Empowerings LMS",
  description: "Get in touch with the Empowerings LMS team. We are here to answer your questions about our platform, pricing, and enterprise solutions.",
  openGraph: {
    title: "Contact Us | Empowerings LMS",
    description: "Get in touch with the Empowerings LMS team. We are here to answer your questions about our platform, pricing, and enterprise solutions.",
    url: "https://empowerings-lms.com/contact-us",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Empowerings LMS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Empowerings LMS",
    description: "Get in touch with the Empowerings LMS team. We are here to answer your questions.",
    images: ["/images/hero.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
