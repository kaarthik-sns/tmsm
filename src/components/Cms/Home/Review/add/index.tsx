"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import { toast } from "sonner";
import Image from "next/image";

const Elements = () => {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rating: "",
    description_ta: "",
    name_ta: ""
  });

  const lang = localStorage.getItem('lang') || 'en';
  const isTamil = lang === 'ta';

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const formData_upload = new FormData();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for rating field
    if (name === 'rating') {
      const numValue = parseInt(value);
      if (value === '' || (numValue >= 1 && numValue <= 5)) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
      return;
    }

    // Handle regular input fields
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    const ratingValue = parseInt(formData.rating);
    if (!formData.rating.trim()) {
      errors.rating = "Rating cannot be empty.";
    } else if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      errors.rating = "Rating must be a number between 1 and 5.";
    }

    if (!formData.name.trim()) {
      errors.name = "Name cannot be empty.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description cannot be empty.";
    }

    if (!formData.name_ta.trim()) {
      errors.name_ta = "Name cannot be empty.";
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

    for (const [key, value] of Object.entries(formData)) {
      formData_upload.append(key, value);
    }

    try {

      const res = await fetch("/api/cms/home/review", {
        method: "POST",
        body: formData_upload,
      });

      if (!res.ok) {
        throw new Error("Failed to add Data.");
      }

      const data = await res.json();

      toast.success('Data added successfully!', {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });

      setFormData({
        name: "",
        description: "",
        rating: "",
        description_ta: "",
        name_ta: ""
      });

    } catch (err: any) {
      toast.error('Failed to add Data.', {
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
      <Breadcrumb
        breadcrumbs={[
          { name: isTamil ? "விமர்சன பட்டியல்" : "List Reviews", href: "/admin/cms/home/review/list" },
          { name: isTamil ? "விமர்சனத்தைச் சேர்க்கவும்" : "Add Review" },
        ]}
      />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:gap-9">
          <div className="flex flex-col gap-4 sm:gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-4 sm:p-6.5">

                <div className="mb-3 sm:mb-4.5">
                  <label className="mb-2 sm:mb-3 block text-sm font-medium dark:text-white dark-text">
                    Name <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className={`w-full rounded border-[1.5px] px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-base outline-none transition ${formErrors?.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>

                <div className="mb-3 sm:mb-4.5">
                  <label className="mb-2 sm:mb-3 block text-sm font-medium dark:text-white dark-text">
                    Description <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Enter description"
                    className={`w-full rounded border-[1.5px] px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-base outline-none transition ${formErrors?.description
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.description && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>

                <div className="mb-3 sm:mb-4.5">
                  <label className="mb-2 sm:mb-3 block text-sm font-medium dark:text-white dark-text">
                    {isTamil ? "மதிப்பீடு" : "Rating"} <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="Enter rating (1-5)"
                    className={`w-full rounded border-[1.5px] px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-base outline-none transition ${formErrors?.rating
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.rating && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.rating}</p>
                  )}
                </div>

                <div className="mb-3 sm:mb-4.5">
                  <label className="mb-2 sm:mb-3 block text-sm font-medium dark:text-white dark-text">
                    பெயர் <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name_ta"
                    value={formData.name_ta}
                    onChange={handleChange}
                    placeholder="பெயரை உள்ளிடவும்"
                    className={`w-full rounded border-[1.5px] px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-base outline-none transition ${formErrors?.name_ta
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.name_ta && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name_ta}</p>
                  )}
                </div>

                <div className="mb-3 sm:mb-4.5">
                  <label className="mb-2 sm:mb-3 block text-sm font-medium dark:text-white dark-text">
                    விவரம் <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <textarea
                    name="description_ta"
                    value={formData.description_ta}
                    onChange={handleChange}
                    rows={6}
                    placeholder="விவரங்களை உள்ளிடவும்"
                    className={`w-full rounded border-[1.5px] px-3 sm:px-5 py-2 sm:py-3 text-sm sm:text-base outline-none transition ${formErrors?.description_ta
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.description_ta && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.description_ta}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-9 mt-3 sm:mt-4.5">
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

export default Elements;
