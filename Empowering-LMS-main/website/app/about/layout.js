export const metadata = {
  title: "About Us | Empowerings LMS",
  description: "Discover the story behind Empowerings LMS. Learn about our mission to transform digital learning, our visionary team, and how we help organizations succeed.",
  openGraph: {
    title: "About Us | Empowerings LMS",
    description: "Discover the story behind Empowerings LMS. Learn about our mission to transform digital learning, our visionary team, and how we help organizations succeed.",
    url: "https://empowerings-lms.com/about",
    images: [
      {
        url: "/images/about-main.png",
        width: 1200,
        height: 630,
        alt: "About Empowerings LMS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Empowerings LMS",
    description: "Discover the story behind Empowerings LMS. Learn about our mission to transform digital learning.",
    images: ["/images/about-main.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
