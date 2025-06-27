import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Contact from "@/components/ContactUs/contact";

export const metadata: Metadata = {
  title:"List Contact Us - Admin",
  description: "",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
       <Contact />
      </DefaultLayout>
    </>
  );
}