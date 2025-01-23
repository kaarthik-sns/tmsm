"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const AboutWeOffer = () => {
  const [offerlist, setOfferList] = useState([]);

  const fetchTableItems = async () => {
    try {
      const response = await fetch("/api/cms/about", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const dataArray = data.data;

      const offerlistData = [
        {
          icon: dataArray.feature_one_img,
          title: dataArray.feature_one,
          desc: dataArray.feature_one_desc,
        },
        {
          icon: dataArray.feature_two_img,
          title: dataArray.feature_two,
          desc: dataArray.feature_two_desc,
        },
        {
          icon: dataArray.feature_three_img,
          title: dataArray.feature_three,
          desc: dataArray.feature_three_desc,
        },
        {
          icon: dataArray.feature_four_img,
          title: dataArray.feature_four,
          desc: dataArray.feature_four_desc,
        },
      ];

      setOfferList(offerlistData);
    } catch (error) {
      console.error("Error fetching table items:", error);
    }
  };

  useEffect(() => {
    fetchTableItems();
  }, []);

  return (
    <>
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

export default AboutWeOffer;
