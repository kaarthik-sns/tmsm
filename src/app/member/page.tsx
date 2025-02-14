import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Member from "@/components/Frontend/Member";
import '@/css/member.css';

export const metadata: Metadata = {
  title: "Member - TMSM",
  description: "",
};

export default function Home() {

 
  return (
    <>
      <FrontendLayouts>
        <Member/>
      </FrontendLayouts>
    </>
  );
}
