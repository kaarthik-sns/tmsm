import React from "react";
import Elements from "@/components/Cms/Home/Review/edit";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Edit Review - TMSM",
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
