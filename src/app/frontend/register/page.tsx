import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";

import Register from "@/components/Frontend/Register";


export const metadata: Metadata = {
  title:"Register - TMSM",
  description: "",
};

export default function Home() {
  return (
     <FrontendLayouts>
      <Register />
      </FrontendLayouts>
  );
}

