"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FormData {
  title: string;
  description: string;
  photo: File | string;
  image?: string;
}

const Elements = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const formData_upload = new FormData();
  const [formData, setFormData] = useState<FormData>({
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
          setPreview(data?.image ? `/api${data.image}` : '');

        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [id]);

  const handleFile = (file: File) => {
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB', {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
      return;
    }

    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setFormData((prevData) => ({ ...prevData, photo: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      handleFile(files[0]);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file.', {
          className: "sonner-toast-error",
          cancel: {
            label: 'Close',
            onClick: () => console.log('Close'),
          },
        });
        return;
      }

      // Check file size for drag and drop as well
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size must be less than 5MB', {
          className: "sonner-toast-error",
          cancel: {
            label: 'Close',
            onClick: () => console.log('Close'),
          },
        });
        return;
      }

      handleFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title cannot be empty.";
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
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>
    </div>;
  }

  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          { name: "List Slider", href: "/admin/cms/home/slider/list" },
          { name: "Edit Slider" },
        ]}
      />
      <div className="grid grid-cols-1 gap-4 sm:gap-9">
        <div className="flex flex-col gap-4 sm:gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-4 sm:p-6.5">
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slider Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div
                        className={`relative flex-shrink-0 w-full sm:w-96 h-48 rounded-lg overflow-hidden cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : preview ? 'bg-gray-100' : 'bg-gray-50'
                          } ${formErrors.preview
                            ? "border-2 border-red-500"
                            : "border-2 border-dashed border-gray-300 hover:border-primary"
                          }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.querySelector<HTMLInputElement>('input[name="photo"]')?.click()}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          name="photo"
                          onChange={handleChange}
                          className="hidden"
                        />
                        {preview ? (
                          <Image
                            src={preview}
                            alt="Slider Preview"
                            width={256}
                            height={192}
                            className="w-full h-full object-cover"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <svg
                              className={`w-12 h-12 ${isDragging ? 'text-primary' : 'text-gray-400'}`}
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600 mt-4">
                              <p className="text-center">
                                <span className="text-primary">Click to upload</span>
                                <span className="px-1">or drag and drop</span>
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG, JPEG, WebP</p>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Upload a high-quality image for your slider. The image should be:
                        </p>
                        <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside space-y-1">
                          <li>At least 1920x1080 pixels (16:9 ratio)</li>
                          <li>Less than 5MB in size</li>
                          <li>In landscape orientation</li>
                        </ul>
                      </div>
                    </div>
                    {formErrors?.preview && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.preview}</p>
                    )}
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter a compelling title"
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors?.title
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-primary"
                        } focus:border-transparent focus:outline-none focus:ring-2 transition-colors dark:bg-boxdark dark:text-white`}
                    />
                    {formErrors?.title && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.title}</p>
                    )}
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter an engaging description"
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors?.description
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-primary"
                        } focus:border-transparent focus:outline-none focus:ring-2 transition-colors dark:bg-boxdark dark:text-white`}
                    />
                    {formErrors?.description && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.description}</p>
                    )}
                  </div>
                </div>

                {/* Bottom Submit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-6 text-custom"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

        export default Elements;
