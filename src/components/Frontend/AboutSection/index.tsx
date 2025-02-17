"use client";

import Image from "next/image";
import Loader from "@/components/common/Loader";

const AboutUs = (data) => {

  const homeData = data.data;

  const features = [
    {
      icon: homeData.feature_one_img,
      title: homeData.feature_one,
    },
    {
      icon: homeData.feature_two_img,
      title: homeData.feature_two,
    },
    {
      icon: homeData.feature_three_img,
      title: homeData.feature_three,
    },
    {
      icon: homeData.feature_four_img,
      title: homeData.feature_four,
    }
  ];

  if (features.length === 0) {
    return <Loader />
  }

  if (features.length === 0) {
    return <Loader />
  }

  return (
    <>
      <section className="relative bg-[#FFD16C] py-12">
        {/* Decorative Header */}
        <div className="absolute top-0 w-full h-screen bg-repeat-x bg-[url('/images/about/about-bg-h.svg')]"></div>

        <div className="container mx-auto px-6 py-6 md:py-12">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Image Section */}
            <div className="w-full md:w-1/2 py-6 md:py-12">
              <div className="relative w-full rounded-full h-[300px] md:h-[500px] overflow-hidden border-0">
                <Image
                  src={`/api${homeData.sec_one_img}`}
                  alt="Happy Couple"
                  layout="fill"
                  objectFit="contain"

                />
              </div>
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 md:text-left py-6 md:py-12 description">
              <h2 className="heading mb-4 md:mb-6">{homeData.sec_one_title}</h2>
              <div dangerouslySetInnerHTML={{ __html: homeData.sec_one_desc }} />
            </div>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="absolute bottom-0 w-full h-21 bg-repeat-x bg-[url('/images/about/about-bg.svg')]"></div>
      </section>

      <section className="relative bg-[#F8F8F8] py-6 md:py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-8">
            {/* Text Section */}
            <div className="w-full md:w-1/2 md:text-left py-6 md:py-12 description">
              <h2 className="heading mb-4 md:mb-6">{homeData.sec_two_title}</h2>
              <div dangerouslySetInnerHTML={{ __html: homeData.sec_two_desc }} />
            </div>
            {/* Image Section */}
            <div className="w-full md:w-1/2 py-6 md:py-12">
              <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden border-0">
                <Image
                  src={`/api${homeData.sec_two_img}`}
                  alt="Happy Couple"
                  layout="fill"
                  objectFit="contain"
                  loading="lazy"
                />
              </div>
            </div>


          </div>
        </div>
        {/* icon Layout */}
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center sm:flex-row gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center rounded-full">
                  <img src={`/api${feature.icon}`} alt={feature.title} className="w-20 h-20" loading="lazy" />
                </div>
                {/* Title */}
                <h3 className="flex-1 icon-text text-lg">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="join-us py-8">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {/* Text Section */}
            <div className="w-full sm:w-3/4 text-center sm:text-left mb-4 sm:mb-0">
              <h2 className="join-heading">
                {homeData.banner_title}
              </h2>
            </div>

            {/* Button Section */}
            <div className="w-full sm:w-1/2 text-center sm:text-right">
              <a
                href={homeData?.banner_btn_link || "#"}
                className="px-6 py-3 rounded-full bg-color inline-block"
              >
                {homeData?.banner_btn_text}
              </a>

            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default AboutUs;
