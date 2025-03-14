import Hero from "./components/Hero";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import Features from "./components/Features";
import GameFeatures from "./components/GameFeatures";
import { useEffect, useState } from "react";
import News from "./components/News";
import NewsMobile from "./components/NewsMobile";
import GameFeaturesMobile from "./components/GameFeatureMobile";
import Lenis from "lenis";
import UpdateSection from "./components/UpdateSection";
import { Route, Routes } from "react-router";
import NewsPage from "./components/NewsPage";
import NewsPageDetail from "./components/NewsPageDetail";
import ScrollToTop from "./components/ScrollToTop";
export default function App() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenisInstance = new Lenis();

    function raf(time: DOMHighResTimeStamp) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    setLenis(lenisInstance);
    return () => lenisInstance.destroy(); // Clean up on unmount
  }, []);

  useEffect(() => {
    // Ensure scroll position resets on page reload
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  //screen size check to dynamic render
  const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(
      () => window.matchMedia(query).matches
    );

    useEffect(() => {
      const mediaQueryList = window.matchMedia(query);
      const listener = (event: MediaQueryListEvent) =>
        setMatches(event.matches);

      mediaQueryList.addEventListener("change", listener);
      return () => mediaQueryList.removeEventListener("change", listener);
    }, [query]);

    return matches;
  };
  const isMobile = useMediaQuery("(max-width: 1024px)");
  return (
    <>
      <ScrollToTop lenis={lenis} />
      <Routes>
        <Route
          path="/"
          element={
            <main className="relative min-h-screen w-screen overflow-x-hidden noto  ">
              <Navbar lenis={lenis} />
              <Hero />
              <About />
              <Features />
              <Map />
              {isMobile ? <GameFeaturesMobile /> : <GameFeatures />}
              {isMobile ? <NewsMobile /> : <News />}
              <UpdateSection />
            </main>
          }
        />
        <Route path="/news" element={<NewsPage lenis={lenis} />} />
        <Route path="/news/:id" element={<NewsPageDetail />} />
      </Routes>
    </>
  );
}
