import React from "react";
import Elements from "@/components/Cms/Home/Page/View";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "View Homepage Contents - TMSM",
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
