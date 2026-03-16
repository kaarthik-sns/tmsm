'use client';

import { useState } from 'react';
import Image from 'next/image';
import Loader from "@/components/common/Loader";

const Slider = (data) => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const data_array = data.data;
  const lang = localStorage.getItem('lang') || 'en';

  let slides = data_array.map((item, idx) => ({
    image: (
      <Image
        src={`/api${item.image}`}
        alt={item.title}
        width={800}
        height={400}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    ),
    title: (
      <div className="slider-text">
        {lang === 'ta' ? item.title_ta : item.title}
      </div>
    ),
    content: (
      <div className="slider-content">
        {lang === 'ta' ? item.description_ta : item.description}
      </div>
    ),
  }));


  if (slides.length === 0) {
    return <Loader />
  }

  return (

    <div className="relative mx-auto">
      {/* Slider Image and Content */}
      <div className="relative">
        <div className="w-full h-full flex justify-center items-center">
          {slides[currentSlide].image}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="container mx-auto">
          <div className="absolute top-1/2 px-4">
            <div className="w-full">
              {slides[currentSlide].title}
              {slides[currentSlide].content}
            </div>
            {/* Bullets Navigation */}
            <div className="absolute flex space-x-2 pl-0">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Slider;
