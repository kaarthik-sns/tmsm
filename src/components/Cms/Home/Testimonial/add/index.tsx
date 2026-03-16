"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import { toast } from "sonner";
import Image from "next/image";

interface FormData {
  name: string;
  description: string;
  description_ta: string;
  name_ta: string;
  photo: File | string;
}

const Elements = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    photo: "",
    description_ta: "",
    name_ta: ""
  });

  const lang = localStorage.getItem('lang') || 'en';
  const isTamil = lang === 'ta';

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const formData_upload = new FormData();

  const handleFile = (file: File) => {
    // Check file size (1MB = 1 * 1024 * 1024 bytes)
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size must be less than 1MB', {
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
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
      if (file.size > maxSize) {
        toast.error('Image size must be less than 1MB', {
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
        description_ta: "",
        name_ta: ""
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
          {
            name: isTamil ? "சான்றுரைகள் பட்டியல்" : "List Testimonials",
            href: "/admin/cms/home/testimonial/list",
          },
          {
            name: isTamil ? "சான்றுரையைச் சேர்க்கவும்" : "Add Testimonial",
          },
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
                      Profile Image <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div
                          className={`relative w-[250px] h-[250px] rounded-full overflow-hidden cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : preview ? 'bg-gray-100' : 'bg-gray-50'
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
                            <div className="relative w-full h-full group">
                              <Image
                                src={preview}
                                alt="Profile Preview"
                                width={250}
                                height={250}
                                className="object-cover w-full h-full rounded-full"
                                unoptimized={true}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                <p className="text-white text-sm">Click to change image</p>
                              </div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
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
                      </div>

                      <div className="flex-1 space-y-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Image Requirements</h4>
                        <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside space-y-1">
                          <li>Circular profile image (250 x 250 pixels)</li>
                          <li>Maximum file size: 1MB</li>
                          <li>Accepted formats: SVG, PNG, JPG, JPEG, WebP</li>
                          <li>Clear and professional quality</li>
                        </ul>
                      </div>
                    </div>
                    {formErrors?.preview && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.preview}</p>
                    )}
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter person's name"
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors?.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                        } focus:border-transparent focus:outline-none focus:ring-2 transition-colors dark:bg-boxdark dark:text-white`}
                    />
                    {formErrors?.name && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.name}</p>
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
                      placeholder="Enter testimonial content"
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors?.description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                        } focus:border-transparent focus:outline-none focus:ring-2 transition-colors dark:bg-boxdark dark:text-white`}
                    />
                    {formErrors?.description && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      பெயர் <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name_ta"
                      value={formData.name_ta}
                      onChange={handleChange}
                      placeholder="பெயரை உள்ளிடவும்"
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors?.name_ta
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                        } focus:border-transparent focus:outline-none focus:ring-2 transition-colors dark:bg-boxdark dark:text-white`}
                    />
                    {formErrors?.name_ta && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.name_ta}</p>
                    )}
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      விவரம் <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description_ta"
                      value={formData.description_ta}
                      onChange={handleChange}
                      rows={4}
                      placeholder="விவரங்களை உள்ளிடவும்"
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors?.description_ta
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary"
                        } focus:border-transparent focus:outline-none focus:ring-2 transition-colors dark:bg-boxdark dark:text-white`}
                    />
                    {formErrors?.description_ta && (
                      <p className="mt-2 text-sm text-red-500">{formErrors.description_ta}</p>
                    )}
                  </div>

                </div>

                {/* Bottom Submit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90 lg:px-5 xl:px-6 text-custom"
                  >
                    {isTamil ? 'சமர்ப்பிக்கவும்' : 'Submit'}
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
