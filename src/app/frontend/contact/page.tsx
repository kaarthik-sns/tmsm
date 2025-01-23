import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Innerbanner from "@/components/Frontend/InnerPageBanner/contact-innerbanner";
import Contact from "@/components/Frontend/Contact/contact-info";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export const metadata: Metadata = {
  title:"Contact us - TMSM",
  description: "",
};

export default function Home() {
  return (
    <>
     <FrontendLayouts>
      <Innerbanner/>
      <Contact/>
     </FrontendLayouts>
    </>
  );
}