import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Member from "@/components/Frontend/Member";
import InnerBanner from '@/components/Frontend/InnerPageBanner/member-innerbanner';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/css/member.css';

export const metadata: Metadata = {
  title: "Member - TMSM",
  description: "",
};

export default function Home() {

 
  return (
    <>
      <FrontendLayouts>
        <InnerBanner />
        <Member/>
      </FrontendLayouts>
    </>
  );
}
