import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TermTable from "@/components/Terms/list";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions - TMSM",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <TermTable />
    </DefaultLayout>
  );
};

export default TablesPage;
