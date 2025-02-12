import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Login from "@/components/Frontend/Login";



export const metadata: Metadata = {
  title:"Login - TMSM",
  description: "",
};

export default function Home() {
  return (
     <FrontendLayouts>
      <Login />
      </FrontendLayouts>
  );
}

