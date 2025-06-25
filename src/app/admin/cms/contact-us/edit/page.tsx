import React from "react";
import TemsElements from "@/components/Cms/ContactUs/edit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Edit Contact Us Email Template- TMSM",
  description: "",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <TemsElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
