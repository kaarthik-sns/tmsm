'use client'; 

import { useState } from 'react';
import Image from 'next/image';
import Loader from "@/components/common/Loader";

const Slider = (data) => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const data_array = data.data;

  const slides = data_array.map((item, idx) => ({
    image: (
      <Image
        src={item.image} // Assuming item.image contains the image URL
        alt={item.title} // Assuming item.title contains the title
        width={800}
        height={400}
        className="w-full h-full object-contain"
      />
    ),
    title: <div className="slider-text">{item.title}</div>, // Assuming item.title contains the text
    content: <div className="slider-content">{item.description}</div>, // Assuming item.content contains the text
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

// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// const Slider = ({ slides }) => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   if (!slides || slides.length === 0) {
//     return <div className="text-center text-red-500">No slides available.</div>;
//   }

//   return (
//     <div className="relative mx-auto">
//       {/* Slider Image and Content */}
//       <div className="relative">
//         <div className="w-full h-full flex justify-center items-center">
//           <Image
//             src={slides[currentSlide].image}
//             alt={slides[currentSlide].title || 'Slider Image'}
//             width={800}
//             height={400}
//             className="w-full h-full object-contain"
//             loading="lazy"
//           />
//           <div className="absolute inset-0 bg-black opacity-40"></div>
//         </div>
//         <div className="container mx-auto">
//           <div className="absolute top-1/2 px-4">
//             <div className="w-full">
//               <div className="slider-text text-lg font-bold">
//                 {slides[currentSlide].title}
//               </div>
//               <div className="slider-content text-sm">
//                 {slides[currentSlide].content}
//               </div>
//             </div>
//             {/* Bullets Navigation */}
//             <div className="absolute flex space-x-2 pl-0">
//               {slides.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentSlide(index)}
//                   className={`w-3 h-3 rounded-full transition-colors ${
//                     currentSlide === index ? 'bg-black' : 'bg-white'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Server-Side Data Fetching
// export async function getServerSideProps() {
//   try {
//     const response = await fetch(
//       '/api/cms/home/slider/list?page=1',
//       {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     // Transforming API data
//     const slides = data.data.map((item) => ({
//       image: item.image,
//       title: item.title,
//       content: item.description,
//     }));

//     return {
//       props: { slides }, // Pass slides as props to the component
//     };
//   } catch (error) {
//     console.error('Error fetching slides:', error);
//     return {
//       props: { slides: [] }, // Pass an empty array in case of error
//     };
//   }
// }

// export default Slider;

