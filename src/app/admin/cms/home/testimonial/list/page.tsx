import Table from "@/components/Cms/Testimonial/list";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "List Testimonial - TMSM",
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
