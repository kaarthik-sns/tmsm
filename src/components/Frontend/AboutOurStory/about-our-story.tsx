"use client";

import Image from "next/image";

const features = [
  
  
];

const AboutOurStory = () => {
  return (
    <>
    <section className="about-our-story">
      <div className="container mx-auto">
            <div className="row flex flex-col md:flex-row ">
                <div className="w-full md:w-1/2 px-7.5">
                      <div className="story-left-media relative media-relative">
                                          <Image
                                              src="/images/about/our-story.webp" 
                                              alt="Happy Couple"
                                              layout="fill"
                                           />
                                  </div>
                </div>
                <div className="w-full md:w-1/2 px-7.5">
                  <div className="story-right-desc">
                      <h3>Our Story</h3>
                      <p>Founded with the vision to bring people together in the most genuine and meaningful way, Thondai Mandala Saiva Mudaliyar (TMSM) community has become a trusted name in the world of matrimonial matchmaking. With years of expertise, a deep understanding of cultural values, and a passion for helping people build lasting relationships, we’re proud to be a part of so many love stories.</p>
                      <p>We provide an online space where like-minded individuals can meet, interact, and build relationships that lead to lifelong partnerships. Our platform serves as a safe and secure environment where privacy and respect are valued above all. What started as a small, dedicated effort to help people meet has grown into one of the most trusted names in matrimonial services. Over the years, we’ve helped thousands of individuals from different backgrounds find their life partners, and every success story reinforces our belief in the power of genuine connections. As we continue to grow, we remain committed to providing a safe, secure, and supportive space for people to explore meaningful relationships. At Thondai Mandala Saiva Mudaliyar (TMSM) community, we’re not just a matrimonial service – we’re a trusted partner in your journey to love, and we’re honored to be part of the beginning of so many beautiful love stories.</p>
                  </div>
                </div>
            </div>
        </div>
    </section>
    </>
  );
};

export default AboutOurStory;