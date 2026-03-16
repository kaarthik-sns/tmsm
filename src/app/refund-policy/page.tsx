import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Topbanner from "@/components/Frontend/InnerPageBanner/refund-policy";
import TermsContent from "@/components/Frontend/Terms/terms-content";

export const metadata: Metadata = {
  title: "Refund Policy - TMSM",
  description: "",
};

export default async function Home() {

  const response = await fetch(`${process.env.BASE_URL}/api/cms/refund/view`, {
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
        <Topbanner />
        <TermsContent data={data} />
      </FrontendLayouts>
    </>
  );
}

