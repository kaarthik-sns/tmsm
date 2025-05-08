import Table from "@/components/Cms/Refund/view";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Refund Policy - TMSM",
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
