"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/UserBreadcrumb";

const FaqElements = () => {

  const [formData, setFormData] = useState({
    description: "",
    is_delete:"",
  });


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
      setFormData(data);
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  fetchUserData();
}, []); // Dependency array empty as faqId is not required

  return (
    <>
      <Breadcrumb pageName="Edit FAQ" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium dark:text-white">
                  Description : {formData.description}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaqElements;
