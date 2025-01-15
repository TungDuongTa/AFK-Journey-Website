import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

import { Navigation, Pagination } from "swiper/modules";

const ExampleSwiper: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1.2} // Show part of previous and next slides
        spaceBetween={20} // Adjust spacing between slides
        centeredSlides={true} // Center the active slide
        navigation
        pagination={{ clickable: true }}
        className="w-full"
      >
        {/* Example slides */}
        <SwiperSlide>
          <div className="bg-green-500 h-60 rounded-md shadow-md flex items-center justify-center text-white text-xl">
            Slide 1
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-blue-500 h-60 rounded-md shadow-md flex items-center justify-center text-white text-xl">
            Slide 2
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="bg-red-500 h-60 rounded-md shadow-md flex items-center justify-center text-white text-xl">
            Slide 3
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default ExampleSwiper;
