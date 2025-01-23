"use client";

import Image from "next/image";

const AboutUs = (data) => {

  const AboutData = data.data;

  const offerlist = [
    {
      icon: AboutData.feature_one_img,
      title: AboutData.feature_one,
      desc: AboutData.feature_one_desc,
    },
    {
      icon: AboutData.feature_two_img,
      title: AboutData.feature_two,
      desc: AboutData.feature_two_desc,
    },
    {
      icon: AboutData.feature_three_img,
      title: AboutData.feature_three,
      desc: AboutData.feature_three_desc,
    },
    {
      icon: AboutData.feature_four_img,
      title: AboutData.feature_four,
      desc: AboutData.feature_four_desc,
    },
  ];

  return (
    <>
      <section className="inner-page-top-banner">
        <div className="relative in-banner-bg">
          <Image
            src={AboutData.banner_img}
            alt="Happy Couple"
            layout="fill"
          />
        </div>

        <div className="inner-banner-info">
          <div className="top-title">
            <h2>{AboutData.banner_title}</h2>
          </div>
        </div>
      </section>

      <section className="about-info-con">
        <div className="container mx-auto">
          <div className="row flex flex-col md:flex-row ">
            <div className="w-full md:w-1/2 px-7.5">
              <div className="about-left-media relative media-relative ">
                <Image
                  src={AboutData.sec_one_img}
                  alt="Happy Couple"
                  layout="fill"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-7.5">
              <div className="about-con-desc">
                <h3>{AboutData.sec_one_title}</h3>
                <div dangerouslySetInnerHTML={{ __html: AboutData.sec_one_desc }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-our-story">
        <div className="container mx-auto">
          <div className="row flex flex-col md:flex-row ">
            <div className="w-full md:w-1/2 px-7.5">
              <div className="story-left-media relative media-relative">
                <Image
                  src={AboutData.sec_two_img}
                  alt="Happy Couple"
                  layout="fill"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-7.5">
              <div className="story-right-desc">
              <h3>{AboutData.sec_two_title}</h3>
              <div dangerouslySetInnerHTML={{ __html: AboutData.sec_two_desc }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-we-offer">
        <div className="container mx-auto">
          <div className="row flex flex-col md:flex-row">
            <div className="we-offer-title px-7.5">
              <h3>What We Offer</h3>
            </div>
          </div>
          <div className="row flex flex-wrap px-7.5">
            {offerlist.length > 0 ? (
              offerlist.map((list, index) => (
                <div className="w-full md:w-1/4 px-2.5 list-offer-info" key={index} >
                  <div className="offer-list-itmes">
                    <div className="offer-icon relative">

                      <Image
                        src={list.icon}
                        alt={list.title}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <h4>{list.title}</h4>
                    <p>{list.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading features...</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
