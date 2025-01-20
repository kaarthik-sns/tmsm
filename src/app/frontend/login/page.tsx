import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Login from "@/components/Frontend/Login";
import Slider from "@/components/Frontend/Slider";
import Fillter from "@/components/Frontend/Fillter";
import AboutSection from "@/components/Frontend/AboutSection";
import Recentlymarried from "@/components/Frontend/Recentlymarried";
import Testimonial from "@/components/Frontend/Testimonial";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export const metadata: Metadata = {
  title:"Login - TMSM",
  description: "",
};

export default function Home() {
  return (
     <FrontendLayouts>
      <Login />
      </FrontendLayouts>
  );
}

