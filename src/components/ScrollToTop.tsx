import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

interface ScrollToTopProps {
  lenis: Lenis | null;
}

const ScrollToTop = ({ lenis }: ScrollToTopProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true }); // Scroll to top immediately
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
