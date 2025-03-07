import BentoCard from "./BentoCard";
import BentoTilt from "./BentoTilt";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);
export default function Features() {
  useGSAP(() => {
    const tiltElements = document.querySelectorAll(".bentoAnimation");

    tiltElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          transform:
            "perspective(1000px) translate(0px, 100px) rotateX(-40deg)",
          opacity: 0,
        },
        {
          transform: "perspective(1000px) ",
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top bottom", // Animation starts when the top of the element meets the bottom of the viewport
            toggleActions: "play none none reverse", // Change this to allow replaying
          },
        }
      );
    });
  }, []);

  return (
    <section className="pb-52" id="hero">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="noto text-lg text-blue-50">Met The Characters</p>

          <p className="max-w-md noto text-lg text-blue-50 opacity-50">
            Explore the journeys of unique characters as their fates intertwine
            with the world around them, filled with mystery, danger, and hope.
          </p>
        </div>
        <div className=" bentoAnimation ">
          <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh] ">
            <BentoCard
              src="videos/feature1-1.mp4"
              title={<>Sonja</>}
              description="From above Rustport, Sonja watches her domain - ships in the harbor, travelers, children at play, gang thugs on the prowl - and sees her own fate reflected in their lives."
              isComingSoon
            />
          </BentoTilt>
        </div>

        <div className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
          <div className=" row-span-1 md:col-span-1 md:row-span-2  bentoAnimation relative col-span-2 overflow-hidden rounded-md">
            <BentoTilt className=" border-hsla bentoAnimation size-full rounded-md transition-transform duration-300 ease-out">
              <BentoCard
                src="videos/feature1-2.mp4"
                title={<>Hugin</>}
                description="Master blacksmith haunted by a tragic past, he seeks vengeance against those who wronged him, hoping his creations will bring justice"
              />
            </BentoTilt>
          </div>
          <div className="relative col-span-2 overflow-hidden rounded-md row-span-1 ms-32 md:col-span-1 md:ms-0 bentoAnimation">
            <BentoTilt className="border-hsla size-full rounded-md transition-transform duration-300 ease-out">
              <BentoCard
                src="videos/feature1-3.mp4"
                title={<>Lily May</>}
                description="The Twilight Tracker"
              />
            </BentoTilt>
          </div>
          <div className="me-14 md:col-span-1 md:me-0  bentoAnimation overflow-hidden relative col-span-2">
            <BentoTilt className="border-hsla size-full  rounded-md transition-transform duration-300 ease-out ">
              <BentoCard
                src="videos/feature1-4.mp4"
                title={
                  <>
                    V<b>a</b>la
                  </>
                }
                description="Phantom of Oakenfell"
              />
            </BentoTilt>
          </div>
          <div className="relative col-span-1 row-span-1 overflow-hidden rounded-md bentoAnimation">
            <BentoTilt className=" border-hsla size-full rounded-md transition-transform duration-300 ease-out  ">
              <div className="flex size-full overflow-hidden relative px-6 py-8 md:px-6 md:py-6">
                <img
                  src="videos/feature1-6.jpg"
                  loading="lazy"
                  className="absolute left-0 top-0 object-cover object-center size-full"
                />

                <h1 className=" z-10 bento-title special-font text-blue-50">
                  More <br /> Coming <br /> Soon
                </h1>
              </div>
            </BentoTilt>
          </div>
          <div className="relative col-span-1 row-span-1 overflow-hidden rounded-md bentoAnimation">
            <BentoTilt className="border-hsla size-full rounded-md transition-transform duration-300 ease-out  ">
              <video
                src="videos/feature1-5.mp4"
                loop
                muted
                autoPlay
                preload="none"
                className="size-full object-cover object-center  "
              />
            </BentoTilt>
          </div>
        </div>
      </div>
    </section>
  );
}
