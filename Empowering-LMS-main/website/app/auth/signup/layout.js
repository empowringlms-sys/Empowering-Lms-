export const metadata = {
  title: "Sign Up | Empowerings LMS",
  description: "Join Empowerings LMS today. Create an account to access world-class learning management tools and start your educational journey.",
  openGraph: {
    title: "Sign Up | Empowerings LMS",
    description: "Join Empowerings LMS today. Create an account to access world-class learning management tools and start your educational journey.",
    url: "https://empowerings-lms.com/auth/signup",
    images: [
      {
        url: "/images/hero-student1.png",
        width: 1200,
        height: 630,
        alt: "Join Empowerings LMS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | Empowerings LMS",
    description: "Join Empowerings LMS today. Create an account to access world-class learning management tools.",
    images: ["/images/hero-student1.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
