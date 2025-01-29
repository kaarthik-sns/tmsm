import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Innerbanner from "@/components/Frontend/Dashboard/innerbanner";
import Dashboard from "@/components/Frontend/Dashboard";


export const metadata: Metadata = {
  title:"Dashboard - TMSM",
  description: "",
};

export default function Home() {
  return (
    <>
     <FrontendLayouts>
      {/* <Innerbanner/> */}
      <Dashboard/>
     </FrontendLayouts>
    </>
  );
}

