import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Dashboard from "@/components/Frontend/Dashboard";


export const metadata: Metadata = {
  title:"Dashboard - TMSM",
  description: "",
};

export default function Home() {
  return (
    <>
     <FrontendLayouts>
      <Dashboard/>
     </FrontendLayouts>
    </>
  );
}

