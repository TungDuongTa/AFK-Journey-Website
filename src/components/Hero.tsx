import { useEffect, useRef, useState } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import FullScreenVideo from "./FullScreenVideo";
import FullScreenLoader from "./FullScreenLoader";

gsap.registerPlugin(ScrollTrigger);
export default function Hero() {
  const [currentIndex, setcurrentIndex] = useState(1);
  const [hasClicked, sethasClicked] = useState(false);
  const [isClickable, setIsClickable] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [isIntroVideoPlaying, setisIntroVideoPlaying] = useState(false);
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
      setisIntroVideoPlaying(true); // Play the intro video
    }
  }, [loadedVideos]);
  function handleIntroVideoEnd() {
    setisIntroVideoPlaying(false); // Hide the intro after animation
  }

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", {
          visibility: "visible",
          immediateRender: true,
        });
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

  const [isMouseOver, setIsMouseOver] = useState(false); // Track whether mouse is over the video
  const hoverElementRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // This will track mouse on the container
  const [transformStyle, setTransformStyle] = useState<string>("");
  const [transformStyle1, setTransformStyle1] = useState<string>("");
  const [isMouseStopped, setIsMouseStopped] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  // Tilt effect logic

  const element = hoverElementRef.current;
  const container = containerRef.current;

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!element || !container) return;

    // Clear previous timeout and reset scaling when mouse moves
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set the state to false when the mouse is moving
    if (isMouseStopped) {
      setIsMouseStopped(false); // Mouse has started moving again
    }

    // Set a timeout to detect when the mouse stops
    timeoutRef.current = setTimeout(() => {
      setIsMouseStopped(true);
    }, 500); // 500ms delay to consider the mouse stopped
    const { clientX, clientY } = event;
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = container;
    const x = clientX - offsetLeft - offsetWidth / 2;
    const y = clientY - offsetTop - offsetHeight / 2;
    const tiltX = (y / offsetHeight) * 70; // Adjust the tilt factor as needed
    const tiltY = (x / offsetWidth) * -70; // Adjust the tilt factor as needed
    // Add scale factor to the transform

    const newTransform = `translate(-50%, -50%) perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)  `; // Add scale for depth effect
    const newTransform1 = `scale(1) `; // Add scale for depth effect
    setTransformStyle1(newTransform1);
    setTransformStyle(newTransform);
  };
  function handleMouseLeave() {
    setIsMouseOver(false);
    const newTransform1 = `translate(-50%, -50%) perspective(700px) `; // Add scale for depth effect
    setTransformStyle1("scale(0.001) ");
    setTransformStyle(newTransform1);
  }
  function handleMouseEnter() {
    setIsMouseOver(true); // Mark mouse as over the video
  }
  function handleMouseLeaveCenter() {
    setIsMouseOver(false); // Mark mouse as over the video
  }
  useEffect(() => {
    console.log("isMouseStopped:", isMouseStopped); // This will log the updated value
    if (isMouseStopped && !isMouseOver) {
      const newTransform = `translate(-50%, -50%) perspective(700px) `; // Add scale for depth effect
      setTransformStyle(newTransform);
      setTransformStyle1(" scale(0.001)");
    }
    console.log("isMouseOver:", isMouseOver); // This will log the updated value
  }, [isMouseStopped, isMouseOver]);
  return (
    <div
      className="relative h-dvh w-screen overflow-x-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <FullScreenLoader isLoading={isLoading} />
      <FullScreenVideo
        isPlaying={isIntroVideoPlaying}
        onEnded={handleIntroVideoEnd}
      />

      <section
        id="videoframe-section"
        className="overflow-hidden relative z-10 w-full h-full"
      >
        <div
          id="video-frame"
          className=" relative z-10 h-dvh w-screen overflow-hidden rounded-sm bg-blue-75"
        >
          {/* Black layer with low opacity */}
          <div className="absolute left-0 top-0 z-30 h-full w-full bg-black opacity-30 pointer-events-none"></div>
          {/* Preload other unrendered  videos */}
          {/* <div className="invisible">
            <video
              src={getVideoSrc(3)}
              muted
              preload="auto"
              onLoadedData={handleVideoLoad}
            />
            <video
              src={getVideoSrc(4)}
              muted
              preload="auto"
              onLoadedData={handleVideoLoad}
            />
          </div> */}
          <div>
            {/* mivi video */}
            <div
              className={`absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-xl scale-100  `}
              ref={hoverElementRef}
              onMouseMove={handleMouseEnter}
              onMouseLeave={handleMouseLeaveCenter}
              style={{
                transform: transformStyle,
                transition: "transform 0.1s linear",
              }}
            >
              <div
                onClick={handleMiniVideoClick}
                ref={videoContainerRef}
                className="origin-center!  transition-all duration-500 ease-in scale-[0.001]   "
                style={{
                  transform: transformStyle1,
                  transition: "transform 1s linear",
                }}
              >
                <video
                  ref={nextVideoRef}
                  src={getVideoSrc(upcomingVideoIndex)}
                  loop
                  muted
                  id="current-video"
                  className="size-64 origin-center object-cover object-center border rounded-xl border-slate-700 "
                  onLoadedData={handleVideoLoad}
                  preload="auto"
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
              preload="auto"
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
              preload="auto"
            />
          </div>
          <div className="absolute bottom-10 right-10 z-40 ">
            <img
              src="img/afk-logo.png"
              className=" w-24 sm:w-40 md:w-64 lg:w-96 object-contain"
            />
          </div>
          <div className="dow-content z-50 bottom-10 md:bottom-16 left-10 absolute  ">
            <a href="https://vda.afkjourney.com/pc_dl/com.farlightgames.igame.pc/a0f2a6caf27db1e96b33411c52f11817">
              <img src="/img/dow_windows.png" className="imga dow-btn" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.farlightgames.igame.gp">
              <img src="/img/dow_googleplay.png" className="imga dow-btn" />
            </a>
            <a href="https://apps.apple.com/app/afk-journey/id1628970855">
              <img src="/img/dow_appstore.png" className="imga dow-btn" />
            </a>
          </div>
          <div className="absolute left-0 top-0 z-40 size-full">
            <div className="mt-24 px-6 sm:px-12">
              <p className="font-robert-regular text-blue-100 md:text-2xl text-base uppercase">
                From the creator of Afk Arena
              </p>
              <h1 className="special-font hero-heading text-blue-100">
                New Journey <br /> is waiting
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="absolute bottom-10 right-10 invert ">
        <img
          src="img/afk-logo.png"
          className=" w-24 sm:w-40 md:w-64 lg:w-96 object-contain cursor-pointer"
        />
      </div>
    </div>
  );
}
