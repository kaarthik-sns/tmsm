import React from "react";
import Elements from "@/components/Cms/About/edit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Edit About - TMSM",
  description:
    "",
};

const FormElements = () => {
  return (
    <DefaultLayout>
      <Elements />
    </DefaultLayout>
  );
};

export default FormElements;
 