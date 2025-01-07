import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FaqTable from "@/components/Faq/list";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "List Faq - TMSM",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <FaqTable />
    </DefaultLayout>
  );
};

export default TablesPage;
