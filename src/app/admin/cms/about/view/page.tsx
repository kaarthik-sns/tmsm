import React from "react";
import Elements from "@/components/Cms/About/view";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "About Us View - TMSM",
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
 