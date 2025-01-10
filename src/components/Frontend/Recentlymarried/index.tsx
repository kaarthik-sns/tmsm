"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const TwoRowTwoColumnSlider = () => {
  const couples = [
    {
      name: "Surya & Vaishnavi",
      image: "/images/couple/couple1.svg",
      description:
        "recently tied the knot, their love story brought to life by TMSM Matrimonial’s personalized matchmaking services. Arun, an architect, and Anjali, an interior designer, bonded over shared dreams and values, leading to a deep connection.",
    },
    {
      name: "Siva & Meenakshi",
      image: "/images/couple/couple2.svg",
      description:
      "recently tied the knot, their love story brought to life by TMSM Matrimonial’s personalized matchmaking services. Arun, an architect, and Anjali, an interior designer, bonded over shared dreams and values, leading to a deep connection.",
    },
    {
      name: "Arun & Anjali",
      image: "/images/couple/couple3.svg",
      description:
      "recently tied the knot, their love story brought to life by TMSM Matrimonial’s personalized matchmaking services. Arun, an architect, and Anjali, an interior designer, bonded over shared dreams and values, leading to a deep connection.",
    },
    {
      name: "Naveen & Priya",
      image: "/images/couple/couple4.svg",
      description:
      "recently tied the knot, their love story brought to life by TMSM Matrimonial’s personalized matchmaking services. Arun, an architect, and Anjali, an interior designer, bonded over shared dreams and values, leading to a deep connection.",
    },
    {
      name: "Ajay & Anju",
      image: "/images/couple/couple1.svg",
      description:
      "recently tied the knot, their love story brought to life by TMSM Matrimonial’s personalized matchmaking services. Arun, an architect, and Anjali, an interior designer, bonded over shared dreams and values, leading to a deep connection.",
    },
    {
      name: "Rahul & Divya",
      image: "/images/couple/couple2.svg",
      description:
      "recently tied the knot, their love story brought to life by TMSM Matrimonial’s personalized matchmaking services. Arun, an architect, and Anjali, an interior designer, bonded over shared dreams and values, leading to a deep connection.",
    },
  ];

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
              <div className="flex items-center gap-6  p-6 ">
                {/* Image */}
                <img
                  src={couple.image}
                  alt={couple.name}
                  className="w-60 h-60 rounded-full object-cover"
                />
                {/* Content */}
                <div>
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
