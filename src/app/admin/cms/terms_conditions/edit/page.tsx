import React from "react";
import TemsElements from "@/components/Cms/Terms/edit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Edit Terms & Conditions - TMSM",
  description:
    "",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <TemsElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
 