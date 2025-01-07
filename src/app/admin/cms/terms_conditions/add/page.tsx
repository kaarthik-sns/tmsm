import React from "react";
import TermsElements from "@/components/Terms/add";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Add Users - TMSM",
  description:
    "",
};

const TermsElementsPage = () => {
  return (
    <DefaultLayout>
      <TermsElements />
    </DefaultLayout>
  );
};

export default TermsElementsPage;
 