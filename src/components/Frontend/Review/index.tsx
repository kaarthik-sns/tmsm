"use client";
import React from "react";
import { Navigation, Pagination } from "swiper/modules";
import Loader from "@/components/common/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TestimonialsSlider = (data) => {

  const data_array = data.data;

  const reviews = data_array.map((item, idx) => ({
    name: item.name,
    rating: item.rating,
    feedback: item.description
  }));

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "text-yellow" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (reviews.length === 0) {
    return <Loader />
  }

  return (
    <section className="relative bg-[#F2F2F2] py-12">
      <div className="container mx-auto py-8">
        <h2 className="text-center sm:text-left mb-4 heading">
          Our Clients Say!
        </h2>
        <Swiper
          className="slider-paddings"
          modules={[Navigation]}
          navigation
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="p-6 flex flex-col">
                <p className="text-justify heading-description mb-4">{item.feedback}</p>
                <div className="flex justify-left gap-2">
                  <div className="sub-heading inline-block">{item.name}</div>
                  <div className="flex items-center ">{renderStars(item.rating)}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
