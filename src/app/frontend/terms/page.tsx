import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Topbanner from "@/components/Frontend/InnerPageBanner/terms-and-conditions";
import TermsContent from "@/components/Frontend/Terms/terms-content";


export const metadata: Metadata = {
  title: "Terms and Conditions - TMSM",
  description: "",
};



export default async function Home() {

  const response = await fetch(`${process.env.BASE_URL}/api/terms/get-terms-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();
  console.log(data);
 
  return (
    <>
      <FrontendLayouts>
      <Topbanner/>
      <TermsContent data={data}/>
      </FrontendLayouts>
    </>
  );
}

