import { Metadata } from "next";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import Profile from "@/components/Frontend/Profile";


export const metadata: Metadata = {
  title: "Profile - TMSM",
  description: "",
};

export default async function Home({ searchParams }) {
  const { id } = searchParams;

  const response = await fetch(`${process.env.BASE_URL}/api/get-user-data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data.");
  }

  const { data } = await response.json();

  return (
    <FrontendLayouts>
      <Profile data={data} />
    </FrontendLayouts>
  );
}

