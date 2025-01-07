'use client';

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useSearchParams } from 'next/navigation';
import TermsElements from "@/components/Terms/view";

const ViewTerms = () => {

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/terms/get-terms-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_delete: false }), // Always fetch non-deleted data
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
  
        const { data } = await response.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      } finally {
      }
    };
  
    fetchUserData();
  }, []); // Dependency array empty as faqId is not required
  return (
    <DefaultLayout>
        <TermsElements />
    </DefaultLayout>

  );
};

export default ViewTerms;
