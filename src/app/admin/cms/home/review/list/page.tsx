import Table from "@/components/Cms/Home/Review/list";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "List Review - TMSM",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Table />
    </DefaultLayout>
  );
};

export default TablesPage;
