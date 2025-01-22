"use client";

import Image from "next/image";

const features = [
  
  
];

const InnerBanner = () => {
  return (
    <>
    <section className="inner-page-top-banner">
    <div className="relative in-banner-bg">
        <Image
                  src="/images/member/dashbaord.svg" 
                  alt="Happy Couple"
                  layout="fill"
                />
                </div>
    
        <div className="inner-banner-info">        
                <div className="top-title">
          <h2>Dashbaord</h2>       
        
      
      </div>
    </div>
    </section>
    </>
  );
};

export default InnerBanner;