import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Slider from "@/components/Frontend/Member";
import Fillter from "@/components/Frontend/Fillter";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export const metadata: Metadata = {
  title: "About - TMSM",
  description: "",
};

export default function Home() {
  return (
    <>
      <FrontendLayouts>
        <Fillter />
        <Slider />
      </FrontendLayouts>
    </>
  );
}

