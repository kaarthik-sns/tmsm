"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";


const Elements = () => {

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState("");
  const formData_upload = new FormData();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photo: "",
  });

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/cms/home/slider?id=${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }

          const { data } = await response.json();
          setFormData(data);
          setPreview(data.image);

        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [id]);


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

    if (!formData.title.trim()) {
      errors.title = "Title is required.";
    }

    if (!preview.trim()) {
      errors.preview = "Image is required.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required.";
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

      const res = await fetch("/api/cms/home/slider", {
        method: "PUT",
        body: formData_upload,
      });

      if (!res.ok) {
        throw new Error("Failed to update Data.");
      }

      const data = await res.json();

      router.push(`/admin/cms/home/slider/list`);

      toast.success('Data updated successfully!', {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });

    } catch (err: any) {
      toast.error('Failed to update data.', {
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
      <Breadcrumb
        breadcrumbs={[
          { name: "List Slider", href: "/admin/cms/home/slider/list" },
          { name: "Edit Slider" },
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

                    <input
                      type="file"
                      name="photo"
                      accept="image/*"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                  {formErrors?.preview && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.preview}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark:text-white dark-text">
                    Title <span className="mt-1 text-sm text-red-500">*</span>
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
