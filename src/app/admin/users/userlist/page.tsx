import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import  UserTable from "@/components/UserTable/UserTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "List Users - TMSM",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List Users" />

      <div className="flex flex-col gap-10">
        <UserTable />
      </div>
    </DefaultLayout>
  );
}; 

export default TablesPage;
