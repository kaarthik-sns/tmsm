"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from 'react';

const TestimonialsSlider = () => {

  const [testimonials, setReview] = useState([]);

  const fetchTableItems = async () => {
    try {
      const response = await fetch('/api/cms/home/review/list?page=1', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const data_array = data.data;

      const fetchedSlides = data_array.map((item, idx) => ({
        name: item.name,
        rating: item.rating,
        feedback: item.description
      }));

      setReview(fetchedSlides);

    } catch (error) {
      console.error("Error fetching table items:", error);
    }
  };

  useEffect(() => {
    fetchTableItems();
  }, []);

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

  if (testimonials.length === 0) {
    return <div>Loading...</div>; // Show a loading state while slides are being fetched
  }

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
