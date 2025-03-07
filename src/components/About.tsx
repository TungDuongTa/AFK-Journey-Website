import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import AnimatedTitle from "./AnimatedTitle";
gsap.registerPlugin(ScrollTrigger);
export default function About() {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });
    clipAnimation
      .to(".mask-clip-path", {
        width: "105vw",
        height: "100vh",
      })
      .to(
        "body",
        {
          backgroundColor: "black",
          duration: 0.1,
          ease: "none",
        },
        "-=0.1"
      ); // Overlap slightly with the previous animation
  }, []);
  return (
    <div id="about" className="min-h-screen w-screen ">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <h2 className="noto text-sm uppercase md:text-[14px]">
          Welcome to AFK JOURNEY
        </h2>
        <AnimatedTitle
          title="Discover the world's <br /> largest shared adventure"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p className="">
            Experience the magic of AFK Journey, an innovative overworld fantasy
            RPG
          </p>
        </div>
      </div>
      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about-image.jpeg"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
