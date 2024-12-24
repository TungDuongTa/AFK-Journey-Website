import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { EffectFade } from "swiper/modules";
// Import Swiper styles
import "swiper/swiper-bundle.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger);
export default function GameFeatures() {
  const titleRef = useRef<HTMLDivElement>(null);
  const images = [
    { id: 1, src: "/img/1.jpg", alt: "Image 1" },
    { id: 2, src: "/img/2.jpg", alt: "Image 2" },
    { id: 3, src: "/img/3.jpg", alt: "Image 3" },
    { id: 4, src: "/img/4.jpg", alt: "Image 4" },
    { id: 5, src: "/img/5.jpg", alt: "Image 5" },
    { id: 6, src: "/img/6.jpg", alt: "Image 6" },
    { id: 7, src: "/img/7.jpg", alt: "Image 7" },
  ];
  useGSAP(() => {
    // Set up GSAP animation
    gsap.to(titleRef.current, {
      x: "0%", // Horizontal translation
      y: "0%", // Vertical translation
      scale: 1, // No scaling
      rotation: 0, // No rotation
      opacity: 1, // Fully visible
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top bottom", // Top of the .ref meets the bottom of the viewport
        toggleActions: "play none none reverse", // Allows replay on reverse
      },
    });
  }, []);
  return (
    <div className="index-game relative py-32 ">
      {/* bg div */}
      <div className="game-bg current">
        <img
          src="/img/icon1.png"
          className="size-full object-cover object-center max-w-full"
        />
      </div>
      {/* bird div */}
      <div className="game-bird current">
        <img
          src="/img/bird.png"
          className="size-full object-cover object-center max-w-full"
        />
      </div>
      <div className="l-container">
        <div
          ref={titleRef}
          className="lh-title game  "
          style={{
            opacity: 0,
            translate: "none",
            scale: "none",
            rotate: "none",
            transform: "translate(0%, 50%)",
          }}
        >
          <img
            src="/img/title04.png"
            className="w-auto object-cover  max-w-full align-middle inline-block"
          />
        </div>
        <div className="game-cont relative bannerBox">
          <div className="overflow-hidden game-banner">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect="fade"
              slidesPerView={1}
              navigation={{
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
              }}
              pagination={{
                el: ".custom-pagination",
                clickable: true, // Make the pagination dots clickable
              }}
              loop={true}
              autoplay={{
                delay: 3000, // Set autoplay delay
                disableOnInteraction: false, // Don't disable autoplay on interaction
              }}
            >
              {images.map((image) => (
                <SwiperSlide key={image.id}>
                  <div className="img">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-cover size-full align-middle max-w-full"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom Navigation Buttons */}
          </div>
          {/* custom pagination */}
          <ul className="custom-pagination game-hd list-none "></ul>
          {/* next prev button */}
          <div className="game-btn bannerBtn">
            <a className="swiper-button-prev prevs ">
              <img
                src="/img/prev.png"
                className="w-auto max-w-full align-middle object-cover"
              />
            </a>
            <a className="swiper-button-next nexts ">
              <img
                src="/img/next.png"
                className="w-auto max-w-full align-middle object-cover"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
