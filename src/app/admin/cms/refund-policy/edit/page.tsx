import React from "react";
import Elements from "@/components/Cms/Refund/edit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Edit Refund Policy - TMSM",
  description:
    "",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <Elements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
