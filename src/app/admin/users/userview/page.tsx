import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FormElements from "@/components/Userview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "View User - TMSM",
  description:
    "",
};

const ViewProfile = () => {

  return (
    <DefaultLayout>
        <FormElements />
    </DefaultLayout>

  );
};

export default ViewProfile;
