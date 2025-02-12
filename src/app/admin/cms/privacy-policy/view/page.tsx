import PrivacyTable from "@/components/Cms/Privacy/view";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Privacy Policy - TMSM",
  description:
    "",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <PrivacyTable />
    </DefaultLayout>
  );
};

export default TablesPage;
