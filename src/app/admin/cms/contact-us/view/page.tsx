import TermTable from "@/components/Cms/ContactUs/view";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Contact Us Email Template- TMSM",
  description: "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <TermTable />
    </DefaultLayout>
  );
};

export default TablesPage;
