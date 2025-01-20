"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/FaqBreadcrumb";
import { toast } from "sonner";

const TermsElements = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the highlighted errors.");
      return;
    }

    setFormErrors({});

    try {
      const formBody = new URLSearchParams({
        description: formData.description,
      });

      const res = await fetch("/api/terms/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!res.ok) {
        throw new Error("Failed to add FAQ.");
      }

      const data = await res.json();
      toast.success("FAQ added successfully!");

      setFormData({
        title: "",
        description: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to add FAQ.");
    }
  };


  return (
    <>
      <Breadcrumb pageName="Add FAQ" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Enter description"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.description
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 mt-4.5">
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 text-custom"
            >
              Submit
            </button>

          </div>
        </div>
      </form>
    </>
  );
};

export default TermsElements;
