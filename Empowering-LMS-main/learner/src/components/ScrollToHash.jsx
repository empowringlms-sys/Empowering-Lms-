import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OFFSET = 80;

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (hash) {
      const id = hash.replace("#", "");

      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const elementPosition =
            element.getBoundingClientRect().top + window.pageYOffset;

          const offsetPosition = elementPosition - OFFSET;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 300); // wait for page render
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;
