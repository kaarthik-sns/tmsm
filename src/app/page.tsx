import ECommerce from "@/components/Dashboard/DashboardUi";
import { Metadata } from "next";
import HomeLayout from "@/components/Layouts/HomeLayout";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <>
      <HomeLayout>
        <ECommerce />
      </HomeLayout>
    </>
  );
}
