"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/UserBreadcrumb";
import { toast } from "sonner";

const FaqElements = () => {
  const searchParams = useSearchParams();
  const faqId = searchParams.get("faqId");


  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (faqId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/cms/faq/get-faq-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: faqId }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }

          const { data } = await response.json();
       
          setFormData(data);

        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [faqId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Breadcrumb pageName="Edit FAQ" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium dark:text-white">
                  Title : {formData.title}
                </label>
              </div>
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
