import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Login from "@/components/Frontend/Login";

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

