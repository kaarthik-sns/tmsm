"use client";

import Image from "next/image";

const ContactInnerBanner = () => {

  const lang = localStorage.getItem('lang') || 'en';

  return (
    <>
      <section className="inner-page-top-banner">
        <div className="relative in-banner-bg">
          <Image
            src="/images/terms/terms-bg.webp"
            alt="Happy Couple"
            layout="fill"
          />
        </div>

        <div className="inner-banner-info">
          <div className="top-title">
            <h2>{lang == 'ta' ? 'பணம் திருப்பித் தரும் கொள்கை' : 'Refund Policy'}</h2>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactInnerBanner;