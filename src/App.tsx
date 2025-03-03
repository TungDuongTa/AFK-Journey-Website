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
export default function App() {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis();
    setLenis(lenisInstance);
    function raf(time: DOMHighResTimeStamp) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // This will make sure to scroll to top after page reload
    window.scrollTo(0, 0);

    // Handle potential scroll position issues when loading
    window.addEventListener("beforeunload", () => {
      window.scrollTo(0, 0);
    });

    return () => {
      // Cleanup listener on unmount
      window.removeEventListener("beforeunload", () => {
        window.scrollTo(0, 0);
      });
    };
  }, []); // Empty dependency to run on initial mount

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
  const isMobile = useMediaQuery("(max-width: 830px)");
  return (
    <>
      <Navbar lenis={lenis} />
      <Routes>
        <Route
          path="/"
          element={
            <main className="relative min-h-screen w-screen overflow-x-hidden  ">
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
        <Route path="/news" element={<NewsPage />} />
      </Routes>
    </>
  );
}
