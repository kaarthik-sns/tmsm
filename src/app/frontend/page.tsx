import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Slider from "@/components/Frontend/Slider";
import Fillter from "@/components/Frontend/Fillter";
import AboutSection from "@/components/Frontend/AboutSection";


export const metadata: Metadata = {
  title:"Home - TMSM",
  description: "",
};

export default function Home() {
  return (
    <>
     <FrontendLayouts>
      <Slider />
      <Fillter />
      <AboutSection />
     </FrontendLayouts>
    </>
  );
}

