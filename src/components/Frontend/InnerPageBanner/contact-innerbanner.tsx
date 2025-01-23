"use client";

import Image from "next/image";

const features = [
  
  
];

const ContactInnerBanner = () => {
  return (
    <>
    <section className="inner-page-top-banner">
    <div className="relative in-banner-bg">
        <Image
                  src="/images/contact/contact-us.webp" 
                  alt="Happy Couple"
                  layout="fill"
                />
                </div>
    
        <div className="inner-banner-info">        
                <div className="top-title">
          <h2>Contact Us</h2>  
      </div>
    </div>
    </section>
    </>
  );
};

export default ContactInnerBanner;