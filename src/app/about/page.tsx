import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import AboutUs from "@/components/Frontend/AboutUs/about-us";


export const metadata: Metadata = {
  title: "About - TMSM",
  description: "",
};



export default async function Home() {

  const response = await fetch(`${process.env.BASE_URL}/api/cms/about`, {
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
        <AboutUs data={data.data} />
      </FrontendLayouts>
    </>
  );
}

