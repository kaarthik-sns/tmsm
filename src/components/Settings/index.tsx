'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";



const Settings = () => {

  const [logo, setLogo] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState('');
  const [error, setError] = useState(null);
  const formData_upload = new FormData();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    organisation_description: "",
    organisation_name: "",
    organisation_email_id: "",
    admin_to_email_id: "",
    admin_from_email_id: "",
    phone_no: "",
    address: "",
    domain_url: "",
    copyright: "",
    logo: "",
    favicon: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",

    smtp_mail: "",
    smtp_password: "",
    smtp_port: "",
    smtp_host: "",
    smtp_secure: "",

    profile_req_limit: "",
    contact_desc:""
  });

  useEffect(() => {

    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/get-settings-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const { data } = await response.json();

        setFormData(data);

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchSettings();

  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      // Handle file input
      const file = files[0];

      if (name == 'logo') {
        setLogo(file);
      }

      const fileURL = URL.createObjectURL(file);
      setFormData((prevData) => ({ ...prevData, [name]: fileURL }));

    } else {
      // Handle regular input fields
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  interface FormDataType {
    organisation_name: string;
    organisation_description?: string;
    organisation_email_id: string;
    admin_to_email_id: string;
    admin_from_email_id: string;
    phone_no: string;
    address: string;
    domain_url: string;
    copyright: string;
    logo: string;
    favicon?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    smtp_mail: string;
    smtp_password: string;
    smtp_port: string;
    smtp_host: string;
    smtp_secure: string;
    profile_req_limit: string;
    contact_desc:string;
  }

  const validateFormData = (formData: Partial<FormDataType>): Record<string, string> => {
    let errors: Record<string, string> = {};

    // Required field validation
    const requiredFields: (keyof FormDataType)[] = [
      "organisation_name",
      "organisation_email_id",
      "admin_to_email_id",
      "admin_from_email_id",
      "phone_no",
      "address",
      "domain_url",
      "copyright",
      "smtp_mail",
      "smtp_password",
      "smtp_port",
      "smtp_host",
      "smtp_secure",
      "profile_req_limit",
      "domain_url",
      "facebook",
      "twitter",
      "instagram",
      "youtube",
      "contact_desc"
    ];

    requiredFields.forEach((field) => {

      const formfiled = String(formData[field]);

      if (!formfiled?.trim()) {
        errors[field] = `${field.replace(/_/g, " ")} is required.`;
      }
    });

    // Email validation
    const emailFields: (keyof FormDataType)[] = ["organisation_email_id", "admin_to_email_id", "admin_from_email_id", "smtp_mail"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailFields.forEach((field) => {
      if (formData[field] && !emailRegex.test(formData[field] as string)) {
        errors[field] = "Invalid email format.";
      }
    });

    // Phone number validation (10digits)
    const phoneRegex = /^\d{10}$/;
    if (formData.phone_no && !phoneRegex.test(formData.phone_no)) {
      errors.phone_no = "Invalid phone number. Must be 10 digits.";
    }

    return errors;

  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const errors = validateFormData(formData);

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
      const excludedKeys = ['logo'];
      if (!excludedKeys.includes(key)) {
        formData_upload.append(key, value);
      }
    }

    if (logo) formData_upload.append('logo', logo);

    try {
      const response = await fetch('/api/update-settings', {
        method: 'POST',
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

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Settings" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 gap-8">

          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Site Information
                </h3>
              </div>
              <div className="p-7">
                {!!error && (
                  <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                    <TriangleAlert />
                    <p>{error}</p>
                  </div>
                )}

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="organisation_name"
                    >
                      Organization Name
                    </label>
                    <div>
                      <input
                        className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                          ${formErrors?.organisation_name ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                          dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary`}
                        type="text"
                        id="organisation_name"
                        name="organisation_name"
                        value={formData.organisation_name || ""}
                        onChange={handleChange}
                        placeholder="Enter Organisation Name"
                      />
                      {formErrors?.organisation_name && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.organisation_name}</p>
                      )}
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phone_no"
                    >
                      Phone Number
                    </label>
                    <input
                      className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                        ${formErrors?.phone_no ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                        dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary`}
                      type="text"
                      name="phone_no"
                      value={formData.phone_no || ""}
                      onChange={handleChange}
                      id="phone_no"
                      placeholder="Enter Phone Number"
                      maxLength={10}
                    />
                    {formErrors?.phone_no && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.phone_no}</p>
                    )}
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="organisation_email_id"
                  >
                    Organization Email ID
                  </label>
                  <div>
                    <input
                      className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                        ${formErrors?.organisation_email_id ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                        dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                      `}
                      type="email"
                      name="organisation_email_id"
                      id="organisation_email_id"
                      placeholder="Enter Organisation Email ID"
                      value={formData.organisation_email_id || ""}
                      onChange={handleChange}
                    />
                    {formErrors?.organisation_email_id && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.organisation_email_id}</p>
                    )}
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="admin_to_email_id"
                  >
                    Admin To Email ID
                  </label>
                  <div>
                    <input
                      className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                        ${formErrors?.admin_to_email_id ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                        dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                      `}
                      type="email"
                      name="admin_to_email_id"
                      id="admin_to_email_id"
                      placeholder="Enter Admin To Email ID"
                      value={formData.admin_to_email_id || ""}
                      onChange={handleChange}
                    />
                    {formErrors?.admin_to_email_id && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.admin_to_email_id}</p>
                    )}
                  </div>
                </div>


                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="admin_from_email_id"
                  >
                    Admin From Email ID
                  </label>
                  <div>
                    <input
                      className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.admin_from_email_id ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                      type="email"
                      name="admin_from_email_id"
                      id="admin_from_email_id"
                      placeholder="Enter Admin From Email ID"
                      value={formData.admin_from_email_id || ""}
                      onChange={handleChange}
                    />
                    {formErrors?.admin_from_email_id && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.admin_from_email_id}</p>
                    )}
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="domain_url"
                  >
                    Domain URL
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                    ${formErrors?.domain_url ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                    dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                  `}
                    type="text"
                    name="domain_url"
                    id="domain_url"
                    placeholder="Enter Domain URL"
                    value={formData.domain_url || ""}
                    onChange={handleChange}
                  />
                  {formErrors?.domain_url && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.domain_url}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="copyright"
                  >
                    Copyright
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.copyright ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                    type="text"
                    name="copyright"
                    id="copyright"
                    placeholder="Enter Copyright"
                    value={formData.copyright || ""}
                    onChange={handleChange}
                  />
                  {formErrors?.copyright && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.copyright}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="facebook"
                  >
                    Facebook
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.facebook ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                    type="text"
                    name="facebook"
                    id="facebook"
                    placeholder="Enter Facebook ID"
                    value={formData.facebook || ""}
                    onChange={handleChange}
                  />
                  {formErrors?.facebook && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.facebook}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="twitter"
                  >
                    Twitter
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.twitter ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                    type="text"
                    name="twitter"
                    id="twitter"
                    placeholder="Enter Twitter ID"
                    value={formData.twitter || ""}
                    onChange={handleChange}
                  />
                  {formErrors?.twitter && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.twitter}</p>
                  )}
                </div>


                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="instagram"
                  >
                    Instagram
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.instagram ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                    type="text"
                    name="instagram"
                    id="instagram"
                    placeholder="Enter Instagram ID"
                    value={formData.instagram || ""}
                    onChange={handleChange}
                  />
                  {formErrors?.instagram && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.instagram}</p>
                  )}
                </div>


                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="youtube"
                  >
                    Youtube
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                    ${formErrors?.youtube ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                    dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                  `}
                    type="text"
                    name="youtube"
                    id="youtube"
                    placeholder="Enter Youtube ID"
                    value={formData.youtube || ""}
                    onChange={handleChange}
                  />
                  {formErrors?.youtube && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.youtube}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <div>
                    <textarea
                      className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                        ${formErrors?.address ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                        dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                      `}
                      name="address"
                      id="address"
                      rows={6}
                      placeholder="Enter Address"
                      value={formData.address || ""}
                      onChange={handleChange}
                    ></textarea>
                    {formErrors?.address && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-3">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Logo
                </h3>
              </div>
              <div className="p-7">

                <div className="mb-4 flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full">
                    {formData.logo && (
                      <Image
                        src={formData.logo}
                        alt="Profile Preview"
                        width={64}
                        height={64}
                        quality={100}
                        unoptimized={true}
                        className="w-full h-full object-cover"
                      />)}
                  </div>
                </div>

                <div
                  id="FileUpload"
                  className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                >
                  <input
                    type="file"
                    accept="image/*"
                    name='logo'
                    onChange={handleChange}
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
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
                    <p>
                      <span className="text-primary">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-3">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Other Information
                </h3>
              </div>
              <div className="p-7">


                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="profile_req_limit"
                  >
                    Profile Request Limit
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.profile_req_limit ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                    type="text"
                    name="profile_req_limit"
                    id="profile_req_limit"
                    placeholder="Enter Profile Request Limit"
                    onChange={handleChange}
                    value={formData.profile_req_limit || ""}

                  />
                  {formErrors?.profile_req_limit && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.profile_req_limit}</p>
                  )}
                </div>

              </div>
            </div>


            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-3">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  SMTP Information
                </h3>
              </div>
              <div className="p-7">

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="smtp_mail"
                  >
                    Email ID
                  </label>
                  <div>
                    <input
                      className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                        ${formErrors?.smtp_mail ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                        dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                      `}
                      type="email"
                      name="smtp_mail"
                      id="smtp_mail"
                      placeholder="Enter Email ID"
                      onChange={handleChange}
                      value={formData.smtp_mail || ""}

                    />
                    {formErrors?.smtp_mail && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.smtp_mail}</p>
                    )}
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="smtp_password"
                  >
                    Password
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.smtp_password ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                    type="password"
                    name="smtp_password"
                    id="smtp_password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    value={formData.smtp_password || ""}
                  />
                  {formErrors?.smtp_password && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.smtp_password}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="smtp_host"
                  >
                    Host
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.smtp_host ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                    type="text"
                    name="smtp_host"
                    id="smtp_host"
                    placeholder="Enter Host"
                    onChange={handleChange}
                    value={formData.smtp_host || ""}

                  />
                  {formErrors?.smtp_host && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.smtp_host}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="smtp_port"
                  >
                    Port
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.smtp_port ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                    type="text"
                    name="smtp_port"
                    id="smtp_port"
                    placeholder="Enter Port"
                    onChange={handleChange}
                    value={formData.smtp_port || ""}

                  />
                  {formErrors?.smtp_port && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.smtp_port}</p>
                  )}
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="smtp_secure"
                  >
                    Secure
                  </label>
                  <input
                    className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                      ${formErrors?.smtp_secure ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                      dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                    `}
                    type="text"
                    name="smtp_secure"
                    id="smtp_secure"
                    placeholder="Enter Port"
                    onChange={handleChange}
                    value={formData.smtp_secure || ""}

                  />
                  {formErrors?.smtp_secure && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.smtp_secure}</p>
                  )}
                </div>
              </div>
            </div>


            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Contact Page Information
                </h3>
              </div>
              <div className="p-7">

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="contact_desc"
                  >
                    Contact Description
                  </label>
                  
                    <div>
                      <textarea
                        className={`w-full rounded border bg-gray px-4.5 py-3 text-black focus-visible:outline-none
                        ${formErrors?.contact_desc ? "border-red-500 focus:border-red-500" : "border-stroke focus:border-primary"}
                        dark:bg-meta-4 dark:text-white dark:border-strokedark dark:focus:border-primary
                      `}
                        name="contact_desc"
                        id="contact_desc"
                        rows={6}
                        placeholder="Enter Conatct Description"
                        value={formData.contact_desc || ""}
                        onChange={handleChange}
                      ></textarea>
                      {formErrors?.contact_desc && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.contact_desc}</p>
                      )}
                    </div>
                  
                </div>

              </div>
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

      </form>
    </div>
  );
};

export default Settings;
