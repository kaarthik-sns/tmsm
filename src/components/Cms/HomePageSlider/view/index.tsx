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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (faqId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/faq/get-faq-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: faqId }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }

          const { data } = await response.json();
          console.log(data);
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!formData.title) {
      errors.title = "Title is required.";
    }
    if (!formData.description) {
      errors.description = "Description is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the highlighted errors.");
      return;
    }

    setFormErrors({});
    try {
      const res = await fetch("/api/faq/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (!res.ok) {
        throw new Error("Failed to update FAQ data.");
      }
      toast.success("FAQ updated successfully!");
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
      toast.error("Failed to update FAQ.");
    }
  };


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
