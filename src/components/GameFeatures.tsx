import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { EffectFade } from "swiper/modules";
// Import Swiper styles
import "swiper/swiper-bundle.css";

export default function GameFeatures() {
  const images = [
    { id: 1, src: "/img/1.jpg", alt: "Image 1" },
    { id: 2, src: "/img/2.jpg", alt: "Image 2" },
    { id: 3, src: "/img/3.jpg", alt: "Image 3" },
    { id: 4, src: "/img/4.jpg", alt: "Image 4" },
    { id: 5, src: "/img/5.jpg", alt: "Image 5" },
    { id: 6, src: "/img/6.jpg", alt: "Image 6" },
    { id: 7, src: "/img/7.jpg", alt: "Image 7" },
  ];

  return (
    <div className="index-game relative min-h-screen ">
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
        <div className="lh-title game flex items-center justify-center ">
          <img
            src="/img/title04.png"
            className="w-auto object-cover  max-w-full align-middle"
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

              //   autoplay={{
              //     delay: 3000, // Set autoplay delay
              //     disableOnInteraction: false, // Don't disable autoplay on interaction
              //   }}
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
