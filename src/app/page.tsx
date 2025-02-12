import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Slider from "@/components/Frontend/Slider";
import Fillter from "@/components/Frontend/HomeFilter";
import AboutSection from "@/components/Frontend/AboutSection";
import Recentlymarried from "@/components/Frontend/Recentlymarried";
import Review from "@/components/Frontend/Review";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export const metadata: Metadata = {
  title: "Home - TMSM",
  description: "",
};


export default async function Home() {

  const responseSlider = await fetch(`${process.env.BASE_URL}/api/cms/home/slider/list?page=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await responseSlider.json();
  const sliderData = data.data;

  const responseHome = await fetch(`${process.env.BASE_URL}/api/cms/home/page`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const data2 = await responseHome.json();
  const homeData = data2.data;

  const responseTestimonial = await fetch(`${process.env.BASE_URL}/api/cms/home/testimonial/list?page=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const data3 = await responseTestimonial.json();
  const testimonialData = data3.data;

  const responseReview = await fetch(`${process.env.BASE_URL}/api/cms/home/review/list?page=1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const data4 = await responseReview.json();
  const reviewData = data4.data;


  return (
    <>
      <FrontendLayouts>
        <Slider data={sliderData} />
        <Fillter />
        <AboutSection data={homeData} />
        <Recentlymarried data={testimonialData} />
        <Review data={reviewData} />
      </FrontendLayouts>
    </>
  );
}

