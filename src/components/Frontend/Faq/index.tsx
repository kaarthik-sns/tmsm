"use client";

import Image from "next/image";
import React, { useState } from "react";

const AboutUs = (data) => {

  const faqData = data.data;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  console.log("faqData--", faqData);
  const faqs = [
    { question: "How do I create an account?", answer: "You can create an account by clicking on the 'Sign Up' button on the homepage and filling out the registration form." },
    { question: "Is registration free?", answer: "Yes, registration is completely free for all users." },
    { question: "Can I search for matches based on specific criteria?", answer: "Yes, our advanced search allows you to filter matches based on specific criteria like age, location, and interests." },
    { question: "What is the benefit of a premium membership?", answer: "Premium membership provides features like priority matchmaking, enhanced search options, and more." },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>


      <section className="faq-info-con">
        <div className="container mx-auto">
          <div className="row flex flex-col md:flex-row ">
            <div className="w-full md:w-1/1  px-7.5">
              <div className="faq-content">
                <h3 className="title mb-4 md:mb-6">Frequently Asked Questions</h3>
                <p>Welcome to our FAQ page! Here, we've gathered the most commonly asked questions to help you understand how our matrimonial website works and how we can assist you in your search for a life partner. If you don't find the answer you're looking for, feel free to reach out to our support team.</p>
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
                className={`w-full sm:w-full md:w-full lg:w-1/2 px-6 ${index % 2 === 0 ? "lg:pr-8 lg:border-r lg:border-gray-300" : "lg:pl-8"
                  }`}
              >
                <div className="faq-item border-b border-gray-200 border-btm py-8">
                  <div
                    className="faq-question flex justify-between items-center cursor-pointer"
                    onClick={() => toggleAccordion(index)}
                  >
                    <h4 className="text-lg font-medium faq-question">{faq.title}</h4>
                    <span className="text-xl font-normal expand-font">
                      {activeIndex === index ? "-" : "+"}
                    </span>
                  </div>
                  {activeIndex === index && (
                    <div className="faq-answer mt-5 text-gray-600">
                      {faq.description}
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

export default AboutUs;
