import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import AdminProfile from "@/components/AdminProfile";

export const metadata: Metadata = {
  title:"Profile - Admin",
  description: "",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
       <AdminProfile />
      </DefaultLayout>
    </>
  );
}