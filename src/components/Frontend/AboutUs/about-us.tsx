"use client";

import Image from "next/image";

const AboutUs = (data) => {

  const AboutData = data.data;
  const lang = localStorage.getItem('lang') || 'en';

  const offerlist = [
    {
      icon: AboutData.feature_one_img,
      title: lang == 'ta' ? AboutData.feature_one_ta : AboutData.feature_one,
      desc: lang == 'ta' ? AboutData.feature_one_desc_ta : AboutData.feature_one_desc,
    },
    {
      icon: AboutData.feature_two_img,
      title: lang == 'ta' ? AboutData.feature_two_ta : AboutData.feature_two,
      desc: lang == 'ta' ? AboutData.feature_two_desc_ta : AboutData.feature_two_desc,
    },
    {
      icon: AboutData.feature_three_img,
      title: lang == 'ta' ? AboutData.feature_three_ta : AboutData.feature_three,
      desc: lang == 'ta' ? AboutData.feature_three_desc_ta : AboutData.feature_three_desc,
    },
    {
      icon: AboutData.feature_four_img,
      title: lang == 'ta' ? AboutData.feature_four_ta : AboutData.feature_four,
      desc: lang == 'ta' ? AboutData.feature_four_desc_ta : AboutData.feature_four_desc,
    },
  ];

  return (
    <>
      <section className="inner-page-top-banner">
        <div className="relative in-banner-bg">
          <Image
            src={`/api${AboutData.banner_img}`}
            alt="Happy Couple"
            layout="fill"
          />
        </div>

        <div className="inner-banner-info">
          <div className="top-title">
            <h2>{lang == 'ta' ? AboutData.banner_title_ta : AboutData.banner_title}</h2>
          </div>
        </div>
      </section>

      <section className="about-info-con">
        <div className="container mx-auto">
          <div className="row flex flex-col md:flex-row ">
            <div className="w-full md:w-1/2 px-7.5">
              <div className="about-left-media relative media-relative ">
                <Image
                  src={`/api${AboutData.sec_one_img}`}
                  alt="Happy Couple"
                  layout="fill"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-7.5">
              <div className="about-con-desc">
                <h3>{lang == 'ta' ? AboutData.sec_one_title_ta : AboutData.sec_one_title}</h3>
                <div dangerouslySetInnerHTML={{ __html: lang == 'ta' ? AboutData.sec_one_desc_ta : AboutData.sec_one_desc }} />
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
                  src={`/api${AboutData.sec_two_img}`}
                  alt="Happy Couple"
                  layout="fill"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 px-7.5">
              <div className="story-right-desc">
                <h3>{lang == 'ta' ? AboutData.sec_two_title_ta : AboutData.sec_two_title}</h3>
                <div dangerouslySetInnerHTML={{ __html: lang == 'ta' ? AboutData.sec_two_desc_ta : AboutData.sec_two_desc }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-we-offer">
        <div className="container mx-auto">
          <div className="row flex flex-col md:flex-row">
            <div className="we-offer-title px-7.5">
              <h3>{lang == 'ta' ? 'நாங்கள் வழங்குவது' : 'What We Offer'}</h3>
            </div>
          </div>
          <div className="row flex flex-wrap px-7.5">
            {offerlist.length > 0 ? (
              offerlist.map((list, index) => (
                <div className="w-full md:w-1/4 px-2.5 list-offer-info" key={index} >
                  <div className="offer-list-itmes">
                    <div className="offer-icon relative">

                      <Image
                        src={`/api${list.icon}`}
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
