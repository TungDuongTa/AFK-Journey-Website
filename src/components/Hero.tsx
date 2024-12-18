import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);
export default function Hero() {
  const [currentIndex, setcurrentIndex] = useState(1);
  const [hasClicked, sethasClicked] = useState(false);
  const [isClickable, setIsClickable] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [loadedVideos, setloadedVideos] = useState(0);
  const [delayedIndex, setDelayedIndex] = useState(currentIndex);
  const totalVideos = 4;
  const nextVideoRef = useRef<HTMLVideoElement | null>(null);
  function handleMiniVideoClick() {
    if (!isClickable) return; // Prevent click if not clickable

    setIsClickable(false); // Disable clicking
    setTimeout(() => setIsClickable(true), 1500); // Re-enable after 1 second

    sethasClicked(true);
    setcurrentIndex(upcomingVideoIndex);
    // Delay the update for the main video
    setTimeout(() => {
      setDelayedIndex(upcomingVideoIndex);
    }, 1300); // Delay of 0.3 seconds
  }
  function handleVideoLoad() {
    setloadedVideos((prev) => prev + 1);
  }
  function getVideoSrc(index: number) {
    return `videos/afk-hero-${index}.mp4`;
  }
  // 0%4 =0 +1 =1
  // 1%4 = 1+1 =2
  //... 4%4= 0 +1 = 1
  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;
  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setisLoading(false);
    }
  }, [loadedVideos]);
  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1.2,
          ease: "power1.inOut",
          onStart: () => {
            if (nextVideoRef.current) {
              nextVideoRef.current.play();
            }
          },
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(7% 14%, 80% 0%, 90% 90%, 0 82%)",
      borderRadius: "10% 30% 40% 20%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0 100%)",
      borderRadius: "0 0 0 0 ",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);
  //
  const hoverElementRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const element = hoverElementRef.current;

    if (!element) return;

    const handleMouseEnter = () => {
      // Create a GSAP timeline for repeating scale animation

      gsap.fromTo(
        element,
        {
          scale: 0.8,
        },
        {
          scale: 1,
          duration: 1,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        }
      );
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 0, // Reset scale
        duration: 0.5,
        ease: "power1.inOut",
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[-100] h-dvh w-screen overflow-hidden bg-black ">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}
      <div
        id="video-frame"
        className=" relative z-10 h-dvh w-screen overflow-hidden rounded-sm bg-blue-75"
      >
        {/* Black layer with low opacity */}
        <div className="absolute left-0 top-0 z-30 h-full w-full bg-black opacity-30 pointer-events-none"></div>
        <div>
          <div
            className=" absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden"
            ref={hoverElementRef}
          >
            <div
              onClick={handleMiniVideoClick}
              ref={videoContainerRef}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:opacity-100 hover:scale-100  "
            >
              <video
                ref={nextVideoRef}
                src={getVideoSrc(upcomingVideoIndex)}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center "
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>
          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
          <video
            src={getVideoSrc(
              delayedIndex === totalVideos - 1 ? 1 : delayedIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>
        <div className="absolute bottom-10 right-10 z-40 ">
          <img
            src="img/afk-logo.png"
            className=" w-48 sm:w-72 lg:w-96 object-contain"
          />
        </div>
        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-6 sm:px-12">
            <p className="font-robert-regular text-blue-100 md:text-2xl text-base uppercase">
              From the creator of Afk Arena
            </p>
            <h1 className="special-font hero-heading text-blue-100">
              New Journey <br /> is waiting
            </h1>
            <Button
              id="watch-trailer"
              title="Watch Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="bg-yellow-200 flex-center gap-1 text-[#4A403E] button-hover-effect hover:brightness-110 hover:text-black"
              href="https://www.youtube.com/watch?v=OiO6X_zL_w8"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 right-10 invert ">
        <img
          src="img/afk-logo.png"
          className=" w-48 sm:w-72 lg:w-96 object-contain"
        />
      </div>
    </div>
  );
}
