import { useRef, useState } from "react";
import ParticleSystem from "./ParticleSystem";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
export default function Map() {
  type ImageSource = {
    src: string;
    text: string;
    detailImg: string;
  };
  const imageSources = [
    {
      src: "/img/place1.png",
      text: "Exploring Lucent",
      detailImg: "/img/map-img1.jpg",
    },
    {
      src: "/img/place2.png",
      text: "Discovering Horizons",
      detailImg: "/img/map-img2.jpg",
    },
    {
      src: "/img/place3.png",
      text: "Adventure Awaits",
      detailImg: "/img/map-img3.jpg",
    },
    {
      src: "/img/place4.png",
      text: "Journey to Serenity",
      detailImg: "/img/map-img4.jpg",
    },
  ];
  const [selected, setSelected] = useState(imageSources[0]); // Default to the first item
  const [bannerActive, setBannerActive] = useState(true); // Track the "on" class
  const bannerRef = useRef<HTMLDivElement>(null);
  const bigIconRef = useRef<HTMLDivElement>(null); // Reference for the Bigicon div
  const handleImageClick = (item: ImageSource) => {
    setSelected(item); // Update the selected image and text
    setBannerActive(false); // Remove "on" class
    setTimeout(() => {
      setBannerActive(true); // Add "on" class back after a short delay
    }, 0); // Ensure re-trigger
  };
  useGSAP(() => {
    const items = document.querySelectorAll(".maps-hd li");
    gsap.fromTo(
      items,
      { opacity: 0, y: -40 }, // Starting state: hidden and slightly above
      {
        opacity: 1,
        y: 0, // Ending state: fully visible and at original position
        duration: 1,
        stagger: 0.2, // Animate one after the other
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".maps-hd", // Trigger the animation when `.maps-hd` enters the viewport
          start: "top 70%", // When top of `.maps-hd` is 80% from the top of the viewport
          toggleActions: "play reverse play reverse",
        },
      }
    );
    // Change body background color
    gsap.to("body", {
      backgroundColor: "#e3e3e3", // Background color when scrolling down

      ease: "power1.out",
      scrollTrigger: {
        trigger: ".maps-hd",
        start: "top bottom", // When the top of `.maps-hd` hits the bottom of the viewport
        toggleActions: "play reverse play reverse",
        onEnter: () => {},
        onLeaveBack: () => {
          // Change the background color to black when scrolling back up
          gsap.to("body", {
            backgroundColor: "black",

            ease: "power1.out",
          });
        },
      },
    });
    if (bannerRef.current) {
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, x: 200 }, // Start invisible and slightly to the right
        {
          opacity: 1,
          x: 0, // Slide into place
          duration: 1, // Animation duration
          ease: "power2.out",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top 70%", // Trigger animation when `.maps-banner` is 90% in view
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }
    if (bigIconRef.current) {
      gsap.fromTo(
        bigIconRef.current,
        { opacity: 0, x: -200 }, // Start invisible and slightly to the right
        {
          opacity: 1,
          x: 0, // Slide into place
          duration: 1, // Animation duration
          ease: "power2.out",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top 70%", // Trigger animation when `.maps-banner` is 80% in view
            toggleActions: "play reverse play reverse",
          },
        }
      );
      // Parallax scroll effect for the image inside `.Bigicon` (move from y: 100 to 0)
      gsap.fromTo(
        "#bigIconImg",
        { y: 100 }, // Start from bottom y:100
        {
          y: 0, // Slide into place
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top bottom", // Start when top of bannerRef hits the bottom of the viewport
            end: "bottom top", // End when the bottom of bannerRef hits the top of the viewport
            scrub: true, // Smoothly scrub the animation in sync with scrolling
          },
        }
      );
    }
  }, []);
  return (
    <div className="relative  pt-80 md:pt-60 lg:pt-96">
      {/* Big background absolute div with mask */}
      <div className="maps-bg">
        <img
          src="/img/arc-bg.jpg"
          alt="arc"
          className="object-cover max-w-full align-middle"
        />
      </div>
      <div className="Bigicon" ref={bigIconRef}>
        <img src="/img/npc.png" id="bigIconImg" />
      </div>
      <div
        className="absolute left-0 right-0 z-2 mx-auto px-4"
        style={{
          width: "clamp(798px, 83.125vw, 1596px)",

          bottom: "calc(var(--size-160)* 2)",
        }}
      >
        <div className="relative map-cont w-fit flex mx-auto ">
          {/* map bg div */}

          <div className="bg ">
            <img src="/img/map.png" alt="Map" className="object-contain" />
          </div>

          {/* absolute div for icon and small frame */}
          <div className=" maps main absolute left-0 top-0 bottom-0 right-custom-right  h-full flex ">
            {/* left div with icon */}
            <div
              className="left flex justify-center "
              style={{
                width: "calc(100% - clamp(349px, 36.354166666666664vw, 698px))",
                paddingTop: "calc(var(--size-90)* 2)",
              }}
            >
              <ul className="relative list-none maps-hd ">
                {imageSources.map((item, index) => (
                  <li
                    key={index}
                    className={`transition-none cursor-pointer ${
                      selected.src === item.src ? "on" : ""
                    }`}
                    aria-selected={selected.src === item.src}
                    role="option"
                    onClick={() => handleImageClick(item)}
                  >
                    <a>
                      <div
                        className={`img ${
                          selected.src === item.src ? "current" : ""
                        }`}
                      >
                        <img
                          src={item.src}
                          alt={`Place ${index + 1}`}
                          className="max-w-full w-auto object-cover"
                        />
                      </div>
                      <div className="text flex justify-center whitespace-nowrap items-center relative mt-1 w-[17vw] italic ">
                        <div>
                          <div className="icon">
                            <img
                              src={`${
                                selected.src === item.src
                                  ? "/img/dot2.png"
                                  : "/img/dot1.png"
                              }`}
                            />
                          </div>
                          <h3
                            className=" font-semibold  block  "
                            style={{
                              fontSize: "clamp(8px,1.5625vw,18px)",
                            }}
                          >
                            {item.text}
                          </h3>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* right div with card */}
            <div
              className="right ml-auto "
              style={{
                width: "clamp(349px, 36.354166666666664vw, 698px)",
              }}
            >
              <div
                className="w-auto "
                style={{
                  height: "clamp(43px,5vw,96px)",
                  margin: "var(--size-110) calc(var(--size-80) * 2) 0 auto",
                }}
              >
                <img
                  src="/img/title03.png"
                  className="w-auto max-w-full align-middle object-cover"
                  style={{
                    marginTop: "var(--size-10-)",
                    marginLeft: "calc(var(--size-160) * 1.5)",
                  }}
                />
              </div>
              <div
                className={`relative maps-banner ${bannerActive ? "on" : ""}`}
                style={{ marginTop: "var(--size-60)", zIndex: 3 }}
                ref={bannerRef}
              >
                {/* frame */}
                <div className="  w-full ">
                  <img
                    src="/img/small-map-card.png"
                    alt="Map"
                    className="object-contain w-full max-w-full"
                  />
                </div>
                {/* tag */}
                <div
                  className="absolute z-10 top-0"
                  style={{
                    left: "var(--size-10-)",
                    top: "var(--size-75)",
                    width: "calc(var(--size-100) - 1px)",
                  }}
                >
                  <img
                    src="img/tags.png"
                    className="w-auto max-w-full object-cover"
                  />
                </div>
                {/* image + text */}
                <div
                  className="absolute text "
                  style={{
                    left: "var(--size-45)",
                    top: "var(--size-55)",
                    right: "var(--size-45)",
                    transform: "rotate(-8deg)",
                  }}
                >
                  <div className="img ">
                    <img
                      src={selected.detailImg}
                      alt={selected.text}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="text-block">
                    <h3
                      className="text-[#716561] uppercase text-center font-semibold  block  "
                      style={{
                        marginTop: "var(--size-20)",
                        fontSize: "clamp(18px,1.5625vw,30px)",
                      }}
                    >
                      {selected.text}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cloud">
            <ParticleSystem />
          </div>
        </div>
      </div>
    </div>
  );
}
