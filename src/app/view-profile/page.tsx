import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Profile from "@/components/Frontend/Profile";


export const metadata: Metadata = {
  title: "Profile - TMSM",
  description: "",
};

export default async function Home({ searchParams }) {
  const { id } = searchParams;

  return (
    <FrontendLayouts>
      <Profile userId={id} />
    </FrontendLayouts>
  );
}

