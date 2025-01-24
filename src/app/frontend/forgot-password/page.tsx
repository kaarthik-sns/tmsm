import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import ForgotPassword from "@/components/Frontend/ForgotPassword";


export const metadata: Metadata = {
  title:"Forgot Password - TMSM",
  description: "",
};

export default function Home() {
  return (
     <FrontendLayouts>
      <ForgotPassword />
      </FrontendLayouts>
  );
}

