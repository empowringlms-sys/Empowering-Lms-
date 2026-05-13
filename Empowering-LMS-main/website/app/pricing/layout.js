export const metadata = {
  title: "Pricing Plans | Empowerings LMS",
  description: "Flexible pricing plans tailored for every organization. Choose from our Starter, Professional, or Enterprise plans to power your learning management.",
  openGraph: {
    title: "Pricing Plans | Empowerings LMS",
    description: "Flexible pricing plans tailored for every organization. Choose from our Starter, Professional, or Enterprise plans to power your learning management.",
    url: "https://empowerings-lms.com/pricing",
    images: [
      {
        url: "/images/pricing.jpg",
        width: 1200,
        height: 630,
        alt: "Empowerings LMS Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans | Empowerings LMS",
    description: "Flexible pricing plans tailored for every organization. Choose the perfect plan for you.",
    images: ["/images/pricing.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
