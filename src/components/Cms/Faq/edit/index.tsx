"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/FaqBreadcrumb";
import { toast } from "sonner";

const FaqElements = () => {
  const searchParams = useSearchParams();
  const faqId = searchParams.get("faqId");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    description_ta: "",
    title_ta: "",
  });

  const lang = localStorage.getItem('lang') || 'en';
  const isTamil = lang === 'ta';

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!formData.title) {
      errors.title = "Title cannot be empty.";
    }

    if (!formData.description) {
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
      const res = await fetch("/api/cms/faq/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (!res.ok) {
        throw new Error("Failed to update FAQ data.");
      }

      toast.success('FAQ updated successfully!', {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });

      // Redirect to the FAQ list page after successful update

    } catch (err) {
      setError(err.message || "An unknown error occurred.");

      toast.error('Failed to update FAQ', {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Breadcrumb pageName={isTamil ? "அடிக்கடி கேட்கப்படும் கேள்வியைத் திருத்து" : "Edit FAQ"} />

      {error && <p className="text-red-500">{error}</p>}
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
