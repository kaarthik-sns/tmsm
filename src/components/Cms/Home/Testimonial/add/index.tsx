"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import { toast } from "sonner";
import Image from "next/image";

const Elements = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photo: ""
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const formData_upload = new FormData();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {

      // Handle file input
      const file = files[0];
      const fileURL = URL.createObjectURL(file);

      if (name == 'photo') setPreview(fileURL);

      setFormData((prevData) => ({ ...prevData, [name]: file }));
    } else {
      // Handle regular input fields
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name cannot be empty.";
    }

    if (!preview.trim()) {
      errors.preview = "Image cannot be empty.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description cannot be empty.";
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

      const res = await fetch("/api/cms/home/testimonial", {
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
        photo: "",
        name: "",
        description: "",
      });

      setPreview("");

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
          { name: "List testimonials", href: "/admin/cms/home/testimonial/list" },
          { name: "Add testimonial" },
        ]}
      />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-6.5">


                <div className="mb-4.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                    Image <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`w-100 h-90 overflow-hidden border-[1.5px] bg-gray-200 ${formErrors.preview
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      }`}>
                      {preview && (
                        <Image
                          src={preview}
                          alt="Profile Preview"
                          width={200}
                          height={200}
                          quality={100}
                          unoptimized={true}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                   <div
                      className="relative cursor-pointer rounded-lg border border-dashed border-gray-400 bg-gray-100 px-6 py-5 text-center transition-all hover:border-primary hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        name="photo"
                        onChange={handleChange}
                        className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm dark:bg-gray-800">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                              fill="#3C50E0"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                              fill="#3C50E0"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                              fill="#3C50E0"
                            />
                          </svg>
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium dark-text">Click to upload</span> or drag & drop
                        </p>
                        <p className="text-xs text-gray-500">(SVG, PNG, JPG, JPEG, WebP)</p>
                      </div>
                    </div>
                  </div>
                  {formErrors?.preview && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.preview}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark:text-white dark-text">
                    Name <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark:text-white dark-text">
                    Description <span className="mt-1 text-sm text-red-500">*</span>
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
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 mt-4.5">
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

export default Elements;
