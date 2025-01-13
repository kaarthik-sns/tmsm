"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const TestimonialsSlider = () => {
  const testimonials = [
    {
      name: "Priya",
      feedback:
        "TMSM Matrimony made finding my perfect match a seamless experience. Their verified profiles and secure platform gave my family and me peace of mind throughout the process. I found someone who truly understands and shares my values, traditions, and heritage. Thank you for bringing us together!",
      rating: 4,
    },
    {
      name: "Arun",
      feedback:
        "I had always hoped to find a partner who appreciated our cultural roots and traditions as much as I do. TMSM Matrimony exceeded my expectations with their tailored search options and dedicated community focus. My life partner and I couldn’t have asked for a better way to connect!",
      rating: 4,
    },
    {
      name: "Meenakshi",
      feedback:
        "What sets TMSM Matrimony apart is its commitment to authenticity and community values. The detailed profiles and personalized support helped me find someone who is not just my life partner but also a perfect fit for our family. Highly recommended for anyone in the Mudaliyar community!",
      rating: 5,
    },
    {
      name: "Sudar",
      feedback:
        "What sets TMSM Matrimony apart is its commitment to authenticity and community values. The detailed profiles and personalized support helped me find someone who is not just my life partner but also a perfect fit for our family. Highly recommended for anyone in the Mudaliyar community!",
      rating: 5,
    },
  ];

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

  return (
    <section className="relative bg-[#F2F2F2] py-12">
      <div className="container mx-auto py-8">
        <h2 className="text-left mb-4 heading">Our Clients Say!</h2>
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
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="p-6 flex flex-col">
                <p className="text-justify heading-description mb-4">{testimonial.feedback}</p>
                <div className="flex justify-left gap-2">
                  <div className="sub-heading inline-block">{testimonial.name}</div>
                  <div className="flex items-center ">{renderStars(testimonial.rating)}</div>
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
