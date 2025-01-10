'use client'; // Marking this component as a Client Component

import { useState } from 'react';
import Image from 'next/image';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: <Image src="/images/slider/slider.svg" alt="Slide 1" width={800} height={400} className="w-full h-full object-contain" />,
      title: <div className="slider-text">The Love of Your Life is Waiting</div>,
      content: <div className="slider-content">Find Them with Thondai Mandala Saiva Mudaliyar!</div>,

    },
    {
      image: <Image src="/images/slider/slider2.svg" alt="Slide 2" width={800} height={400} className="w-full h-full object-contain" />,
      title: <div className="slider-text">Love is the key to everything.</div>,
      content: <div className="slider-content">Find Them with Thondai Mandala Saiva Mudaliyar!</div>,
    },
    {
      image: <Image src="/images/slider/slider.svg" alt="Slide 3" width={800} height={400} className="w-full h-full object-contain" />,
      title: <div className="slider-text">Love will find its way to you</div>,
      content: <div className="slider-content">TFind Them with Thondai Mandala Saiva Mudaliyar!</div>,
    },
  ];

  const setSlide = (index) => {
    setCurrentSlide(index);
  };

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
            onClick={() => setSlide(index)}
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
