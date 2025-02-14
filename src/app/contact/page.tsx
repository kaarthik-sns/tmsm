import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Innerbanner from "@/components/Frontend/InnerPageBanner/contact-innerbanner";
import Contact from "@/components/Frontend/Contact/contact-info";


export const metadata: Metadata = {
  title: "Contact us - TMSM",
  description: "",
};


export default async function Home() {

  const response = await fetch(`${process.env.BASE_URL}/api/get-settings-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  return (
    <>
      <FrontendLayouts>
        <Innerbanner />
        <Contact data={data.data} />
      </FrontendLayouts>
    </>
  );
}