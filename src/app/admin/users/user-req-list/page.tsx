import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserReqTable from "@/components/UserReqTable/UserReqTable";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "List Profile Request - TMSM",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="List Profile Request" />
      <div className="flex flex-col gap-10">
        <UserReqTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
