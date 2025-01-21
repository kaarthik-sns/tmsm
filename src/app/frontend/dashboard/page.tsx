import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Innerbanner from "@/components/Frontend/InnerPageBanner/about-innerbanner";
import Dashboard from "@/components/Frontend/Dashboard";

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
      <Dashboard/>
     </FrontendLayouts>
    </>
  );
}

