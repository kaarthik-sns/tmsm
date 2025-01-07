import React from "react";
import FaqElements from "@/components/Faq/add";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Add Faq - TMSM",
  description:
    "",
};

const FormFaqElements = () => {
  return (
    <DefaultLayout>
      <FaqElements />
    </DefaultLayout>
  );
};

export default FormFaqElements;
 