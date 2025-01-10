'use client'
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Settings = () => {

  const [sec_one_img, setSecOneImg] = useState<File | null>(null);
  const [sec_two_img, setSecTwoImg] = useState<File | null>(null);
  const [feature_one_img, setFeatureOneImg] = useState<File | null>(null);
  const [feature_two_img, setFeatureTwoImg] = useState<File | null>(null);
  const [feature_three_img, setFeatureThreeImg] = useState<File | null>(null);
  const [feature_four_img, setFeatureFourImg] = useState<File | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const errors: Record<string, string> = {};

  const [error, setError] = useState(null);
  const formData_upload = new FormData();
  const [isLoading, setIsLoading] = useState(true);

  const toolbarOptions = [
    // Text formatting options
    ["bold", "italic", "underline", "strike"], // Bold, italic, underline, strikethrough
    ["blockquote", "code-block"], // Blockquote, code block

    // Embeds
    ["link", "image", "video", "formula"], // Link, image, video, formula

    // Headers
    [{ header: 1 }, { header: 2 }], // Header 1 and 2
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers 1-6 and normal text

    // Lists
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // Ordered, bullet, and checklist

    // Scripts
    [{ script: "sub" }, { script: "super" }], // Subscript, superscript

    // Indentation
    [{ indent: "-1" }, { indent: "+1" }], // Outdent, indent

    // Text direction
    [{ direction: "rtl" }], // Right-to-left

    // Font size
    [{ size: ["small", false, "large", "huge"] }], // Font size options

    // Text color and background color
    [{ color: [] }, { background: [] }], // Text color, background color

    // Font family
    [{ font: [] }], // Font family dropdown

    // Text alignment
    [{ align: [] }], // Text alignment options

    // Inline formulas
    ["formula"], // Formula support for inline math

    // Clean formatting
    ["clean"], // Remove formatting button
  ];

  const [formData, setFormData] = useState({
    sec_one_title: '',
    sec_one_desc: '',
    sec_one_img: '',

    sec_two_title: '',
    sec_two_desc: '',
    sec_two_img: '',

    feature_one: '',
    feature_one_img: '',
    feature_two: '',
    feature_two_img: '',
    feature_three: '',
    feature_three_img: '',
    feature_four: '',
    feature_four_img: '',

    banner_title: '',
    banner_btn_text: '',
    banner_btn_link: '',
  });

  useEffect(() => {

    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/cms/home/page", {
          method: "GET",
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

    fetchSettings();

  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      // Handle file input
      const file = files[0];

      if (name == 'sec_one_img') {
        setSecOneImg(file);
      }
      if (name == 'sec_two_img') {
        setSecTwoImg(file);
      }
      if (name == 'feature_one_img') {
        setFeatureOneImg(file);
      }
      if (name == 'feature_two_img') {
        setFeatureTwoImg(file);
      }
      if (name == 'feature_three_img') {
        setFeatureThreeImg(file);
      }
      if (name == 'feature_four_img') {
        setFeatureFourImg(file);
      }

      const fileURL = URL.createObjectURL(file);
      setFormData((prevData) => ({ ...prevData, [name]: fileURL }));

    } else {
      // Handle regular input fields
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const validateForm = () => {

    const fieldsToValidate = [
      { key: "sec_one_title", message: "Title is required." },
      { key: "sec_one_desc", message: "Description is required." },
      { key: "sec_one_img", message: "Image is required." },
      { key: "sec_two_title", message: "Title is required." },
      { key: "sec_two_desc", message: "Description is required." },
      { key: "sec_two_img", message: "Image is required." },
      { key: "feature_one", message: "Title One is required." },
      { key: "feature_one_img", message: "Image is required." },
      { key: "feature_two", message: "Title Two is required." },
      { key: "feature_two_img", message: "Image is required." },
      { key: "feature_three", message: "Title Three is required." },
      { key: "feature_three_img", message: "Image is required." },
      { key: "feature_four", message: "Title Four is required." },
      { key: "feature_four_img", message: "Image is required." },
      { key: "banner_title", message: "Title is required." },
      { key: "banner_btn_text", message: "Button Text is required." },
      { key: "banner_btn_link", message: "Button Link is required." },
    ];

    for (const { key, message } of fieldsToValidate) {
      if (!formData[key]?.trim()) {
        errors[key] = message;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the highlighted errors.", {
        className: "sonner-toast-error",
        cancel: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
      });
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!validateForm()) return;

    for (const [key, value] of Object.entries(formData)) {

      const excludedKeys = [
        'sec_one_img',
        'sec_two_img',
        'feature_one_img',
        'feature_two_img',
        'feature_three_img',
        'feature_four_img'
      ];

      if (!excludedKeys.includes(key)) {
        formData_upload.append(key, value);
      }
    }

    if (sec_one_img) formData_upload.append('sec_one_img', sec_one_img);
    if (sec_two_img) formData_upload.append('sec_two_img', sec_two_img);
    if (feature_one_img) formData_upload.append('feature_one_img', feature_one_img);
    if (feature_two_img) formData_upload.append('feature_two_img', feature_two_img);
    if (feature_three_img) formData_upload.append('feature_three_img', feature_three_img);
    if (feature_four_img) formData_upload.append('feature_four_img', feature_four_img);


    try {
      const response = await fetch('/api/cms/home/page', {
        method: 'PATCH',
        body: formData_upload,
      });

      if (response.ok) {

        toast.success('Settings updated successfully!', {
          className: "sonner-toast-success",
          cancel: {
            label: 'Close',
            onClick: () => console.log('Close'),
          },
        });

      } else {
        const error = await response.json();
        setError(`Error: ${error.message}`);
      }
    } catch (err) {

      toast.error('Settings failed to update!', {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });

      console.error(err);
    }
  };


  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Breadcrumb
                breadcrumbs={[
                    { name: "Home Page", href: "/admin/cms/home/page/view" },
                    { name: "Edit Home Page" },
                ]}
            />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">

          <div className="flex flex-col gap-9">

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  About Section
                </h3>
              </div>
              <div className="p-6.5">


                <div className="mb-4.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                    Image <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200 ${formErrors.sec_one_img
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      }`}>
                      {formData.sec_one_img && (
                        <Image
                          src={formData.sec_one_img}
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
                      name="sec_one_img"
                      accept="image/*"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                  {formErrors?.sec_one_img && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.sec_one_img}</p>
                  )}
                </div>



                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="sec_one_title"
                    value={formData.sec_one_title || ""}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.sec_one_title
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.sec_one_title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.sec_one_title}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Description <span className="text-meta-1">*</span>
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={formData.sec_one_desc}
                    onChange={(value) =>
                      handleChange({ target: { name: "sec_one_desc", value } })
                    }
                    placeholder="Enter Description"
                    modules={{ toolbar: toolbarOptions }}
                    className={`react-quill ${formErrors.sec_one_desc ? "border-red-500" : ""
                      }`}
                  />
                  {formErrors.sec_one_desc && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.sec_one_desc}
                    </p>
                  )}
                </div>

              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Banner Section
                </h3>
              </div>
              <div className="p-6.5">

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="banner_title"
                    value={formData.banner_title || ""}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.banner_title
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.banner_title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.banner_title}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Button title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="banner_btn_text"
                    value={formData.banner_btn_text || ""}
                    onChange={handleChange}
                    placeholder="Enter Button Title"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.banner_btn_text
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.banner_btn_text && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.banner_btn_text}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Button link <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="banner_btn_link"
                    value={formData.banner_btn_link || ""}
                    onChange={handleChange}
                    placeholder="Enter Button Link"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.banner_btn_link
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.banner_btn_link && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.banner_btn_link}</p>
                  )}
                </div>

              </div>
            </div>

          </div>


          <div className="flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Why Choose Us Section
                </h3>
              </div>
              <div className="p-6.5">

                <div className="mb-4.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                    Image <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200 ${formErrors.sec_two_img
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      }`}>
                      {formData.sec_two_img && (
                        <Image
                          src={formData.sec_two_img}
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
                      name="sec_two_img"
                      accept="image/*"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                  {formErrors?.sec_two_img && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.sec_two_img}</p>
                  )}
                </div>


                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="sec_two_title"
                    value={formData.sec_two_title || ""}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.sec_two_title
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.sec_two_title && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.sec_two_title}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Description <span className="text-meta-1">*</span>
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={formData.sec_two_desc}
                    onChange={(value) =>
                      handleChange({ target: { name: "sec_two_desc", value } })
                    }
                    placeholder="Enter Description"
                    modules={{ toolbar: toolbarOptions }}
                    className={`react-quill ${formErrors.sec_two_desc ? "border-red-500" : ""
                      }`}
                  />
                  {formErrors.sec_two_desc && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.sec_two_desc}
                    </p>
                  )}
                </div>



                <div className="mb-4.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                    Image <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200 ${formErrors.feature_one_img
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      }`}>
                      {formData.feature_one_img && (
                        <Image
                          src={formData.feature_one_img}
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
                      name="feature_one_img"
                      accept="image/*"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                  {formErrors?.feature_one_img && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.feature_one_img}</p>
                  )}
                </div>


                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="feature_one"
                    value={formData.feature_one || ""}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.feature_one
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.feature_one && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.feature_one}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                    Image <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200 ${formErrors.feature_two_img
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      }`}>
                      {formData.feature_two_img && (
                        <Image
                          src={formData.feature_two_img}
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
                      name="feature_two_img"
                      accept="image/*"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                  {formErrors?.feature_two_img && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.feature_two_img}</p>
                  )}
                </div>


                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="feature_two"
                    value={formData.feature_two || ""}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.feature_two
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.feature_two && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.feature_two}</p>
                  )}
                </div>


                <div className="mb-4.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                    Image <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200 ${formErrors.feature_three_img
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      }`}>
                      {formData.feature_three_img && (
                        <Image
                          src={formData.feature_three_img}
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
                      name="feature_three_img"
                      accept="image/*"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                  {formErrors?.feature_three_img && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.feature_three_img}</p>
                  )}
                </div>


                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="feature_three"
                    value={formData.feature_three || ""}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.feature_three
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.feature_three && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.feature_three}</p>
                  )}
                </div>


                <div className="mb-4.5">
                  <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                    Image <span className="mt-1 text-sm text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200 ${formErrors.feature_four_img
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      }`}>
                      {formData.feature_four_img && (
                        <Image
                          src={formData.feature_four_img}
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
                      name="feature_four_img"
                      accept="image/*"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                  {formErrors?.feature_four_img && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.feature_four_img}</p>
                  )}
                </div>


                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="feature_four"
                    value={formData.feature_four || ""}
                    onChange={handleChange}
                    placeholder="Enter Title"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.feature_four
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.feature_four && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.feature_four}</p>
                  )}
                </div>


              </div>

            </div>
            <div className="text-right">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 text-custom"
              >
                Submit
              </button>

            </div>

          </div>

        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}

      </form>

    </>

  );
};

export default Settings;
