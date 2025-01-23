"use client";

import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import Loader from "@/components/common/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TwoRowTwoColumnSlider = (data) => {

  const data_array = data.data;

  const couples = data_array.map((item, idx) => ({
    image: item.image,
    name: item.name, // Assuming item.title contains the text
    description: item.description, // Assuming item.content contains the text
  }));

  if (couples.length === 0) {
    return <Loader />
  }

  return (
    <section className="relative bg-[#F8F8F8] py-12">
      <div className="absolute top-0 w-full h-screen bg-contain bg-no-repeat bg-[url('/images/couple/bg-couple.svg')]"></div>

      <div className="container mx-auto py-12">
        <h2 className="text-center mb-8 heading">Recently Married</h2>
        <Swiper
          className="slider-padding"
          modules={[Navigation, Pagination]}
          navigation
          spaceBetween={30}
          slidesPerView={2} // Show 2 columns

          grid={{
            rows: 1, // Two rows
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              grid: { rows: 1 },
            },
            640: {
              slidesPerView: 1,
              grid: { rows: 1 },
            },
            1024: {
              slidesPerView: 2,
              grid: { rows: 2 },
            },
          }}
        >
          {couples.map((couple, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                {/* Image - Centered Above on Mobile */}
                <img
                  src={couple.image}
                  alt={couple.name}
                  className="w-40 h-40 md:w-60 md:h-60 rounded-full object-cover"
                />
                {/* Content - Below Image on Mobile, Side by Side on Desktop */}
                <div className="text-center md:text-left">
                  <h3 className="heading-text mb-2">{couple.name}</h3>
                  <p className="heading-description">{couple.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TwoRowTwoColumnSlider;
