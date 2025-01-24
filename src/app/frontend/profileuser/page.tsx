import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";

import ProfileUser from "@/components/Frontend/ProfileUser";


import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export const metadata: Metadata = {
  title:"Profile - TMSM",
  description: "",
};

export default function Home() {
  return (
     <FrontendLayouts>
      <ProfileUser />
    </FrontendLayouts>
  );
}

