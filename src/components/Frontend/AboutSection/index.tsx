"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';

const AboutUs = () => {

  const [features, setFeatures] = useState([]);

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

      console.log(data_array);

      const sec_one_title = data_array.sec_one_title;
      const sec_one_desc = data_array.sec_one_desc;
      const sec_one_img = data_array.sec_one_img;

      const sec_two_title = data_array.sec_two_title;
      const sec_two_desc = data_array.sec_two_desc;
      const sec_two_img = data_array.sec_two_img;

      const feature_one = data_array.feature_one;
      const feature_one_img = data_array.feature_one_img;
      const feature_two = data_array.feature_two;
      const feature_two_img = data_array.feature_two_img;
      const feature_three = data_array.feature_three;
      const feature_three_img = data_array.feature_three_img;
      const feature_four = data_array.feature_four;
      const feature_four_img = data_array.feature_four_img;

      const banner_title = data_array.banner_title;
      const banner_btn_text = data_array.banner_btn_text;
      const banner_btn_link = data_array.banner_btn_link;

      const features_data = [
        {
          icon: "/images/about/community.svg", // Replace with your icon path
          title: feature_one,
        },
        {
          icon: "/images/about/profile.svg", // Replace with your icon path
          title: feature_two,
        },
        {
          icon: "/images/about/privacy.svg", // Replace with your icon path
          title: feature_three,
        },
        {
          icon: "/images/about/match.svg", // Replace with your icon path
          title: feature_four,
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
    return <div>Loading...</div>; // Show a loading state while slides are being fetched
  }

  return (
    <>
      <section className="relative bg-[#FFD16C] py-12">
        {/* Decorative Header */}
        <div className="absolute top-0 w-full h-screen bg-repeat-x bg-[url('/images/about/about-bg-h.svg')]"></div>

        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Image Section */}
            <div className="w-full md:w-1/2 py-12">
              <div className="relative w-full h-[500px] md:h-[500px]  overflow-hidden border-0 ">
                <Image
                  src="/images/about/about-couple.svg" // Replace with your image path
                  alt="Happy Couple"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 md:text-left py-12 description">
              <h2 className="heading mb-6">About</h2>
              {/* <p className="description"> */}
              The Thondai Mandala Saiva Mudaliyar (TMSM) Matrimony is a matrimonial
              platform specially dedicated to the Thondai Mandala Saiva Mudaliyar
              community, which has its roots in Tamil Nadu. This community places
              significant emphasis on cultural values, traditions, and shared heritage,
              which is why many individuals and families prefer to seek matrimonial
              alliances within the community.
              {/* </p>
              <p className="description"> */}
              TMSM Matrimony services provide a platform where brides and grooms can
              find partners with similar cultural backgrounds and values, ensuring
              compatibility within family traditions. These services focus on verifying
              profiles, maintaining data privacy, and providing tailored search options
              for prospective brides and grooms within the Mudaliyar community.
              {/* </p>
              <p className="description"> */}
              The Thondai Mandala Saiva Mudaliyar (TMSM) Matrimony is a matrimonial platform specially dedicated ot the Thondai Mandala Saiva Mudaliyar community. Which has its roots in Tamil Nadu. This community places significant emphasis on cultural values, traditions and shared heritage, which is why many individuals and families prefer to seek matrimonial alliances within the community.
              {/* </p> */}
            </div>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="absolute bottom-0 w-full h-21 bg-repeat-x bg-[url('/images/about/about-bg.svg')]"></div>
      </section>

      <section className="relative bg-[#F8F8F8] py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Text Section */}
            <div className="w-full md:w-1/2 md:text-left py-12">
              <h2 className="heading mb-6">Why Choose Thondai Mandala Saiva Mudaliyar?</h2>
              <p className="description">
                Exclusive to the Thondai Mandala Saiva Mudaliyar (TMSM) community, our platform is deeply rooted in Tamil Nadu's rich cultural heritage, celebrating shared values, traditions, and legacy. We are dedicated to helping you find a life partner who shares your cultural background and family values, ensuring harmony and compatibility within traditions. Every profile on our platform is thoroughly verified to ensure authenticity, providing you with peace of mind as you search for your perfect match. Your privacy and security are our top priorities, with all data handled confidentially for a safe browsing experience.
              </p>
              <p className="description">
                With personalized search filters and advanced matchmaking tools, connecting with like-minded individuals within the Mudaliyar community has never been easier. By fostering meaningful alliances, we aim to uphold and strengthen the bonds and traditions of the Thondai Mandala Saiva Mudaliyar community for generations to come.
              </p>
            </div>

            {/* Image Section */}
            <div className="w-full md:w-1/2 py-12">
              <div className="relative w-full h-[500px] md:h-[600px]  overflow-hidden border-0 ">
                <Image
                  src="/images/about/couple.svg" // Replace with your image path
                  alt="Happy Couple"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
        </div>
        {/* icon Layout */}
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-6 lg:text-left"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center  rounded-full">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-20 h-20"
                  />
                </div>
                {/* Title */}
                <h3 className="flex-1 icon-text text-lg">
                  {feature.title}
                </h3>
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
                Join us today and experience a matrimonial service that truly understands and values your heritage!
              </h2>
            </div>
            <div className="w-1/2 text-right">
              <button className="px-6 py-3 rounded-full bg-color">
                Know More
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
