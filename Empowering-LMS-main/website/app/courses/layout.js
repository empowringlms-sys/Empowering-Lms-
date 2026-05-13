export const metadata = {
  title: "Courses | Empowerings LMS",
  description: "Explore our extensive catalog of professional courses. From technology to business, find the perfect course to advance your career.",
  openGraph: {
    title: "Explore Courses | Empowerings LMS",
    description: "Explore our extensive catalog of professional courses. From technology to business, find the perfect course to advance your career.",
    url: "https://empowerings-lms.com/courses",
    images: [
      {
        url: "/images/courses.png",
        width: 1200,
        height: 630,
        alt: "Empowerings LMS Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Courses | Empowerings LMS",
    description: "Explore our extensive catalog of professional courses. Find the perfect course to advance your career.",
    images: ["/images/courses.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
