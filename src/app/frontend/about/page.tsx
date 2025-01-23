import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Innerbanner from "@/components/Frontend/InnerPageBanner/about-innerbanner";
import AboutInfo from "@/components/Frontend/AboutInfo/about-info";
import AboutOurStory from "@/components/Frontend/AboutOurStory/about-our-story";
import AboutWeOffer from "@/components/Frontend/AboutWeOffer/about-we-offer";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export const metadata: Metadata = {
  title:"About - TMSM",
  description: "",
};

export default function Home() {
  return (
    <>
     <FrontendLayouts>
      <Innerbanner/>
      <AboutInfo/>
      <AboutOurStory/>
      <AboutWeOffer/>    
     </FrontendLayouts>
    </>
  );
}

