import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserReqTable from "@/components/UserReqTable/UserReqTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Profile Request List - TMSM",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Profile Request List" />

      <div className="flex flex-col gap-10">
        <UserReqTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
