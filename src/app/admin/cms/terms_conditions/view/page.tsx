import TermTable from "@/components/Cms/Terms/view";

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
