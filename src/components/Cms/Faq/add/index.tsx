"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/FaqBreadcrumb";
import { toast } from "sonner";

const FaqElements = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    description_ta: "",
    title_ta: "",
  });

  const lang = localStorage.getItem('lang') || 'en';
  const isTamil = lang === 'ta';

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

    if (!formData.title.trim()) {
      errors.title = "Title cannot be empty.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description cannot be empty.";
    }

    if (!formData.title_ta.trim()) {
      errors.title_ta = "Title cannot be empty.";
    }

    if (!formData.description_ta.trim()) {
      errors.description_ta = "Description cannot be empty.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix the highlighted errors.', {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
      return;
    }

    setFormErrors({});

    try {
      const formBody = new URLSearchParams({
        title: formData.title,
        description: formData.description,
      });

      const res = await fetch("/api/cms/faq/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody.toString(),
      });

      if (!res.ok) {
        throw new Error("Failed to add FAQ.");
      }

      toast.success('FAQ added successfully!', {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });

      setFormData({
        title: "",
        description: "",
        description_ta: "",
        title_ta: "",
      });

    } catch (err: any) {
      toast.error('Failed to add FAQ.', {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
    }
  };

  return (
    <>
      <Breadcrumb pageName={isTamil ? "அடிக்கடி கேட்கப்படும் கேள்வியைச் சேர்க்கவும்" : "Add FAQ"} />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-6.5">

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter title"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.title
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark:text-white">
                    Description <span className="text-meta-1">*</span>
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

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark:text-white">
                    தலைப்பு <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title_ta"
                    value={formData.title_ta}
                    onChange={handleChange}
                    placeholder="தலைப்பை உள்ளிடவும்"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.title_ta
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.title_ta && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.title_ta}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark:text-white">
                    விவரம் <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    name="description_ta"
                    value={formData.description_ta}
                    onChange={handleChange}
                    rows={6}
                    placeholder="விவரங்களை உள்ளிடவும்"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.description_ta
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.description_ta && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description_ta}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mt-4.5">
                  <div className="text-right">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 text-custom"
                    >
                      {isTamil ? 'சமர்ப்பிக்கவும்' : 'Submit'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default FaqElements;
