import Hero from "./components/Hero";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import Features from "./components/Features";
import GameFeatures from "./components/GameFeatures";

export default function App() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden  ">
      <Navbar />
      <Hero />
      <About />
      <Map />

      <Features />
      <GameFeatures />
    </main>
  );
}
