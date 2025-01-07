import React from "react";
import FaqElements from "@/components/Faq/edit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Edit Faq - TMSM",
  description:
    "",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <FaqElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
 