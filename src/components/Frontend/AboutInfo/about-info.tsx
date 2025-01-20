"use client";

import Image from "next/image";

const features = [
  
  
];

const AboutInfo = () => {
  return (
    <>
    <section className="about-info-con">
        <div className="container mx-auto">
          <div className="row flex flex-col md:flex-row ">
            <div className="w-full md:w-1/2 px-7.5">
              <div className="about-left-media relative media-relative ">
                      <Image
                          src="/images/about/about-us-media.webp" 
                          alt="Happy Couple"
                          layout="fill"
                       />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-7.5">
              <div className="about-con-desc">
                <h3>About Us</h3>
                <p>At Thondai Mandala Saiva Mudaliyar (TMSM) community, we are dedicated to helping you find your perfect life partner. With years of experience in matchmaking, our platform combines modern technology with personalized service to create meaningful connections. Whether you are looking for love, companionship, or a lifelong marriage, we are here to support you at every step of your journey.</p>
                <p>At Thondai Mandala Saiva Mudaliyar (TMSM) community, we are dedicated to helping you find your perfect life partner. With years of experience in matchmaking, our platform combines modern technology with personalized service to create meaningful connections. Whether you are looking for love, companionship, or a lifelong marriage, we are here to support you at every step of your journey.</p>
              </div>
            </div>
          </div>
        </div>
    </section>
    </>
  );
};

export default AboutInfo;