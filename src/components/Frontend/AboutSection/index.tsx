"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';
import Loader from "@/components/common/Loader";
// import ClipLoader from "react-spinners/ClipLoader";

const AboutUs = () => {

  const [features, setFeatures] = useState([]);
  const [sec_one_title, setSeconetitle] = useState('');
  const [sec_one_desc, setSecOneDesc] = useState('');
  const [sec_one_img, setSecOneImg] = useState('');

  const [sec_two_title, setSecTwoTitle] = useState('');
  const [sec_two_desc, setSecTwoDesc] = useState('');
  const [sec_two_img, setSecTwoImg] = useState('');

  const [banner_title, setBannerTitle] = useState('');
  const [banner_btn_text, setBannerBtnText] = useState('');
  const [banner_btn_link, setBannerBtnLink] = useState('');


  const fetchTableItems = async () => {
    try {
      const response = await fetch('/api/cms/home/page', {
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

      setSeconetitle(data_array.sec_one_title);
      setSecOneDesc(data_array.sec_one_desc);
      setSecOneImg(data_array.sec_one_img);

      setSecTwoTitle(data_array.sec_two_title);
      setSecTwoDesc(data_array.sec_two_desc);
      setSecTwoImg(data_array.sec_two_img);

      setBannerTitle(data_array.banner_title);
      setBannerBtnText(data_array.banner_btn_text);
      setBannerBtnLink(data_array.banner_btn_link);

      const features_data = [
        {
          icon: data_array.feature_one_img,
          title: data_array.feature_one,
        },
        {
          icon: data_array.feature_two_img,
          title: data_array.feature_two,
        },
        {
          icon: data_array.feature_three_img,
          title: data_array.feature_three,
        },
        {
          icon: data_array.feature_four_img,
          title: data_array.feature_four,
        }
      ];

      setFeatures(features_data);

    } catch (error) {
      console.error("Error fetching table items:", error);
    }
  };


  useEffect(() => {
    fetchTableItems();
  }, []);

  if (features.length === 0) {
    return <Loader />
    // return <ClipLoader color="#3498db" loading={true} size={40} />;
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
                  src={sec_one_img}
                  alt="Happy Couple"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 md:text-left py-6 md:py-12 description">
              <h2 className="heading mb-4 md:mb-6">{sec_one_title}</h2>
              <div dangerouslySetInnerHTML={{ __html: sec_one_desc }} />
            </div>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="absolute bottom-0 w-full h-21 bg-repeat-x bg-[url('/images/about/about-bg.svg')]"></div>
      </section>

      <section className="relative bg-[#F8F8F8] py-6 md:py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-8">
            {/* Image Section */}
            <div className="w-full md:w-1/2 py-6 md:py-12">
              <div className="relative w-full h-[300px] md:h-[600px] overflow-hidden border-0">
                <Image
                  src="/images/about/couple.svg"
                  alt="Happy Couple"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 md:text-left py-6 md:py-12 description">
              <h2 className="heading mb-4 md:mb-6">{sec_two_title}</h2>
              <div dangerouslySetInnerHTML={{ __html: sec_two_desc }} />
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
                  <img src={feature.icon} alt={feature.title} className="w-20 h-20" />
                </div>
                {/* Title */}
                <h3 className="flex-1 icon-text text-lg">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="join-us py-8">
        <div className="container mx-auto ">
          <div className="flex justify-between items-center">
            <div className="w-3/4">
              <h2 className="join-heading">
                {banner_title}
              </h2>
            </div>
            <div className="w-1/2 text-right">
              <button className="px-6 py-3 rounded-full bg-color">
                {banner_btn_text}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
