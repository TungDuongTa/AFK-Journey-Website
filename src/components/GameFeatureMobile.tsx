import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/swiper-bundle.css";

export default function GameFeaturesMobile() {
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
    <div className="index-games relative ">
      {/* bg div */}
      <div className="icon current" style={{ width: "63.33333333333333vw" }}>
        <img src="/img/bird1.png" className="imga" />
      </div>
      <div className="lh-title games">
        <img src="/img/title04.png" className="imga" />
      </div>
      <div className="game-cont relative bannerBox">
        <div className="overflow-hidden game-banner-box">
          <Swiper
            className="game-banner l-banner"
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView="auto" // Adjust slides per view
            centeredSlides={true}
            speed={750} // Set transition duration to 750ms
            autoplay={false}
            pagination={{
              el: ".custom-pagination",
              clickable: true, // Make the pagination dots clickable
            }}
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
        </div>
        <div className="game-hd-box">
          <ul className="game-hd bannerHd custom-pagination"></ul>
        </div>
        <div className="icon current">
          <img src="/img/icon41.png" className="imga !w-full" />
        </div>
      </div>
    </div>
  );
}
