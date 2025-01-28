import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import AboutUs from "@/components/Frontend/Faq";
import InnerBanner from "@/components/Frontend/InnerPageBanner/faq-innerbanner";


export const metadata: Metadata = {
  title: "FAQ - TMSM",
  description: "",
};



export default async function Home() {

  const response = await fetch(`${process.env.BASE_URL}/api/cms/faq`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  return (
    <>
      <FrontendLayouts>
        <InnerBanner />
        <AboutUs data={data.data} />
      </FrontendLayouts>
    </>
  );
}

