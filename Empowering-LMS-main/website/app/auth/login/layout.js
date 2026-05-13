export const metadata = {
  title: "Login | Empowerings LMS",
  description: "Securely sign in to your Empowerings LMS account. Access your learning content, manage your profile, and track your progress.",
  openGraph: {
    title: "Login | Empowerings LMS",
    description: "Securely sign in to your Empowerings LMS account. Access your learning content, manage your profile, and track your progress.",
    url: "https://empowerings-lms.com/auth/login",
    images: [
      {
        url: "/images/shield.png",
        width: 800,
        height: 600,
        alt: "Empowerings LMS Login",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Login | Empowerings LMS",
    description: "Securely sign in to your Empowerings LMS account.",
    images: ["/images/shield.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
