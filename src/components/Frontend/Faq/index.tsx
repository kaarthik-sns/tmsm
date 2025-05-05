"use client";

import Image from "next/image";
import React, { useState } from "react";

const FAQ = (data) => {

  const faqData = data.data;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lang = localStorage.getItem('lang') || 'en';

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>

      <section className="inner-page-top-banner">
        <div className="relative in-banner-bg">
          <Image
            src="/images/faq/faq-banner.webp"
            alt="Happy Couple"
            layout="fill"
          />
        </div>

        <div className="inner-banner-info">
          <div className="top-title">
            <h2>{lang === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'FAQ' }</h2>
          </div>
        </div>
      </section>

      <section className="faq-info-con">
        <div className="container mx-auto">
          <div className="row flex flex-col md:flex-row ">
            <div className="w-full md:w-1/1  px-7.5">
              <div className="faq-content">
                <h3 className="title mb-4 md:mb-6">
                  {lang === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
                </h3>
                <p>
                  {lang === 'ta'
                    ? 'எங்கள் FAQ பக்கத்திற்கு வரவேற்கிறோம்! இங்கு, எங்கள் திருமண இணையதளம் எவ்வாறு செயல்படுகிறது மற்றும் உங்கள் வாழ்க்கைத் துணையைத் தேடும் பயணத்தில் எவ்வாறு உதவ முடியும் என்பதைக் குறித்து பொதுவாக கேட்கப்படும் கேள்விகளைப் பற்றி விவரங்கள் கொடுத்துள்ளோம். நீங்கள் எதிர்பார்க்கும் பதிலை காணவில்லை என்றால், எங்கள் ஆதரவு குழுவை அணுகவும்.'
                    : 'Welcome to our FAQ page! Here, we\'ve gathered the most commonly asked questions to help you understand how our matrimonial website works and how we can assist you in your search for a life partner. If you don\'t find the answer you\'re looking for, feel free to reach out to our support team.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="faq-list-con">
        <div className="container mx-auto">
          <div className="row flex flex-wrap -mx-4 px-7.5">
            {faqData.map((faq, index) => (
              <div
                key={faq._id}
                className={`w-full sm:w-full md:w-ful px-6 lg:pr-8 lg:border-r" : "lg:pl-8"
                  }`}
              >
                <div className="faq-item border-b border-gray-200 border-btm py-8">
                  <div
                    className="faq-question flex justify-between items-center cursor-pointer"
                    onClick={() => toggleAccordion(index)}
                  >
                    <h4 className="text-lg font-medium faq-question">{lang === 'ta' ? faq.title_ta : faq.title}</h4>
                    <span className="text-xl font-normal expand-font">
                      {activeIndex === index ? "-" : "+"}
                    </span>
                  </div>
                  {activeIndex === index && (
                    <div className="faq-answer mt-5 text-gray-600">
                      {lang === 'ta' ? faq.description_ta : faq.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
};

export default FAQ;
