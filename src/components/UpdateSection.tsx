import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);
export default function UpdateSection() {
  const stickySectionRef = useRef<HTMLDivElement>(null);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [totalStickyHeight, setTotalStickyHeight] = useState(0);
  const images = [
    { id: 1, src: "/img/map_swiper_1.png", alt: "Image 1" },
    { id: 2, src: "/img/map_swiper_2.png", alt: "Image 2" },
    { id: 3, src: "/img/map_swiper_3.png", alt: "Image 3" },
    { id: 4, src: "/img/map_swiper_4.png", alt: "Image 4" },
  ];
  const images1 = [
    { id: 1, src: "/img/hero_swiper_1.png", alt: "Image 1" },
    { id: 2, src: "/img/hero_swiper_2.png", alt: "Image 2" },
    { id: 3, src: "/img/hero_swiper_3.png", alt: "Image 3" },
    { id: 4, src: "/img/hero_swiper_4.png", alt: "Image 4" },
  ];
  useEffect(() => {
    const updateStickyHeight = () => {
      const stickySection = stickySectionRef.current;
      if (stickySection) {
        const sectionHeight = stickySection.offsetHeight; // Get the sticky section height
        setSectionHeight(sectionHeight);
        setTotalStickyHeight(sectionHeight * 2); // Update totalStickyHeight
        console.log("Section Height:", sectionHeight);
      }
    };

    // Call once to set initial value
    updateStickyHeight();

    // Add resize listener to recalculate on window resize
    window.addEventListener("resize", updateStickyHeight);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", updateStickyHeight);
  }, []);

  useEffect(() => {
    if (sectionHeight > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stickySectionRef.current,
          start: "top top",
          end: `+=${sectionHeight * 3} top`,
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
        },
      });

      // Start bgImg1 scale, bgImg2 clipPath, and bgImg2 scale animations at the same time
      tl.to(".bgImg1", {
        scale: 1.125,
        duration: 1,
        ease: "none",
      })
        .to(
          ".bgImg2",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100% )",
            duration: 1,
            ease: "none",
          },
          0
        ) // Start immediately with bgImg1 scale
        .to(
          ".bgImg2",
          {
            scale: 1.125,
            duration: 2,
            ease: "none",
          },
          0
        ) // Start immediately with bgImg1 scale and bgImg2 clipPath

        // bgImg3 clipPath animation, starts after bgImg1 and bgImg2 animations
        .to(
          ".bgImg3",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100% )",

            duration: 2,
            ease: "none",
          },
          "-=1"
        )
        .to(
          ".bgImg3",
          {
            scale: 1.8,

            duration: 1,
            ease: "none",
          },
          "-=2"
        )
        .to(
          ".bgImg3",
          {
            scale: 1,
            duration: 1,
            ease: "none",
          },
          "-=1"
        );

      // Add event callbacks if needed
      tl.eventCallback("onStart", () => {
        console.log("Timeline started");
      });
      tl.eventCallback("onComplete", () => {
        console.log("Timeline complete");
      });
    }
  }, [sectionHeight, totalStickyHeight]);

  return (
    <section>
      <div
        className="relative overflow-hidden w-screen h-screen"
        ref={stickySectionRef}
      >
        <div
          className="bg1 page_bg flex-y flex-a-center !absolute top-0 left-0 w-full h-full z-10 bgImg1"
          style={{
            backgroundImage: "url(/img/afksss1.jpg) ",
            backgroundPosition: "center center",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            aspectRatio: "1920/1095",
          }}
        ></div>
        <div
          className="bg1 page_bg flex-y flex-a-center !absolute top-0 left-0 w-full h-full z-20 bgImg2"
          style={{
            backgroundImage: "url(/img/afkss2.jpeg) ",
            backgroundPosition: "center center",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            aspectRatio: "1920/1095",
          }}
        ></div>
        <div
          className="bg1 page_bg flex-y flex-a-center absolute top-0 left-0 w-full h-full z-30 bgImg3"
          style={{
            backgroundImage: "url(/img/pc_bg_01.jpg) ",
            backgroundPosition: "center center",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            aspectRatio: "1920/1095",
          }}
        ></div>
      </div>

      <div
        className="bg2 page_bg module flex-y flex-a-center "
        style={{
          backgroundImage: "url(/img/pc_bg_02.jpg) ",
          backgroundPosition: "center center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          aspectRatio: "1920/2257",
        }}
      ></div>
      <div
        className="bg3 page_bg module flex-y flex-a-center "
        style={{
          backgroundImage: "url(/img/pc_bg_03.jpg) ",
          backgroundPosition: "center center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          aspectRatio: "1920/1512",
        }}
      ></div>
      <div
        className="bg4 page_bg module flex-y flex-a-center "
        style={{
          backgroundImage: "url(/img/pc_bg_04.jpg) ",
          backgroundPosition: "center center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          aspectRatio: "1920/1128",
        }}
      >
        <div className="swiper-content">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView="auto" // Adjust slides per view
            centeredSlides={true}
            speed={750} // Set transition duration to 750ms
            autoplay={false}
            navigation={{
              prevEl: ".swiper-button-prev1",
              nextEl: ".swiper-button-next1",
            }}
            loop={true}
          >
            {images.map((image) => (
              <SwiperSlide key={image.id} className="!p-auto !m-auto" tag="li">
                <div className="img">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="imga !size-full overflow-hidden"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev swiper-button-prev1"></div>
          <div className="swiper-button-next swiper-button-next1"></div>
        </div>
      </div>
      <div
        className="bg5 page_bg module flex-y flex-a-center "
        style={{
          backgroundImage: "url(/img/pc_bg_05.jpg) ",
          backgroundPosition: "center center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          aspectRatio: "1920/1505",
        }}
      >
        <div className="swiper-content">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView="auto" // Adjust slides per view
            centeredSlides={true}
            speed={750} // Set transition duration to 750ms
            autoplay={false}
            navigation={{
              prevEl: ".swiper-button-prev2",
              nextEl: ".swiper-button-next2",
            }}
            loop={true}
          >
            {images1.map((image) => (
              <SwiperSlide key={image.id} className="!p-auto !m-auto" tag="li">
                <div className="img">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="imga !size-full overflow-hidden"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev swiper-button-prev2"></div>
          <div className="swiper-button-next swiper-button-next2"></div>
        </div>
      </div>
      <div
        className="bg6 page_bg flex-y flex-a-center  "
        style={{
          backgroundImage: "url(/img/pc_bg_06.jpg) ",
          backgroundPosition: "center center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          aspectRatio: "1920/1658",
        }}
      ></div>
      <div
        className="bg7 page_bg flex-y flex-a-center  "
        style={{
          backgroundImage: "url(/img/pc_bg_07.jpg) ",
          backgroundPosition: "center center",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          aspectRatio: "1920/4499",
        }}
      ></div>
    </section>
  );
}
