import DashboardUi from "@/components/Dashboard/DashboardUi";
import DashboardUser from "@/components/DashboardUsers";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Dashboard - Admin",
  description: "",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <DashboardUi />
        <DashboardUser />
      </DefaultLayout>
    </>
  );
}
