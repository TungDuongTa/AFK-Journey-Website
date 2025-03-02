import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { useWindowScroll } from "react-use";
import gsap from "gsap";
import Button from "./Button";
import Lenis from "lenis";
const navItems = [
  { label: "Heros", id: "hero" },
  { label: "Maps", id: "map" },
  { label: "Features", id: "features" },
  { label: "News", id: "News" },
];

interface NavbarProps {
  lenis: Lenis | null;
}
export default function Navbar({ lenis }: NavbarProps) {
  const [isAudioPlaying, setisAudioPlaying] = useState(false);
  const [isIndicatorActive, setisIndicatorActive] = useState(false);
  const [lastScrollY, setlastScrollY] = useState(0);
  const [isNavVisible, setisNavVisible] = useState(true);
  const [showButton, setShowButton] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const { y: currentScrollY } = useWindowScroll();

  function toggleAudioIndicator() {
    setisAudioPlaying((prev) => !prev);
    setisIndicatorActive((prev) => !prev);
  }
  useEffect(() => {
    if (currentScrollY === 0) {
      setisNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
      setShowButton(false);
    } else if (currentScrollY > lastScrollY) {
      setisNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
      setShowButton(false);
    } else if (currentScrollY < lastScrollY) {
      setisNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
      setShowButton(true);
    }
    setlastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useGSAP(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current!.play(); // "!" asserts it's not null
    } else {
      audioElementRef.current!.pause();
    }
  }, [isAudioPlaying]);

  //handle scroll to section
  const handleNavClick = (id: string) => {
    if (lenis) {
      lenis.scrollTo(`#${id}`, {
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    }
  };
  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-20 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <img src="/img/afk-logo.png" alt="logo " className="w-20" />
            {showButton && (
              <Button
                id="product-button"
                title="Google Play"
                leftIcon={<img src="google-play.png" width={18} />}
                containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1 rounded-full"
              />
            )}
          </div>
          <div className="flex h-full items-center">
            <div className="hidden md:block ">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-hover-btn duration-500 transition-colors 
                   `}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5 "
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/mainMusic.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`indicator-line ${
                    isIndicatorActive ? "active" : ""
                  }`}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
}
