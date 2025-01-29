import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";

import ProfileUser from "@/components/Frontend/ProfileUser";


export const metadata: Metadata = {
  title:"Profile - TMSM",
  description: "",
};

export default function Home() {
  return (
     <FrontendLayouts>
      <ProfileUser />
    </FrontendLayouts>
  );
}

