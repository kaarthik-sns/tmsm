import React from "react";
import Elements from "@/components/Cms/Home/Testimonial/edit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Edit Faq - TMSM",
  description:
    "",
};

const ElementsPage = () => {
  return (
    <DefaultLayout>
      <Elements />
    </DefaultLayout>
  );
};

export default ElementsPage;
