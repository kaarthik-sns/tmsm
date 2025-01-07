import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Settings from "@/components/Settings";

export const metadata: Metadata = {
  title:"Settings - Admin",
  description: "",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
       <Settings />
      </DefaultLayout>
    </>
  );
}