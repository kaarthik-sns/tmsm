'use client'
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import Image from "next/image";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import Link from "next/link";

const Settings = () => {

  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();

  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Breadcrumb
        breadcrumbs={[
          { name: "Dashboard", href: "/admin/dashboard" },
          { name: "Home Page" },
        ]}
      />

      <div className="items-start justify-between md:flex">
        <div className="mt-3 md:mt-0 mb-3">
          <Link
            href="/admin/cms/home/page/edit"
            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
          >
            Edit Home Page
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">

        <div className="flex flex-col gap-9">

          {/* About Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">About</h3>
            </div>
            <div className="p-6.5">

              <div className="mb-4.5 flex items-center space-x-4">
                <div className="w-25 h-25 flex-shrink-0 rounded-full overflow-hidden border-[1.5px] bg-gray-200 border-stroke">
                  {formData.sec_one_img && (
                    <Image
                      src={`/api${formData.sec_one_img}`}
                      alt="Profile Preview"
                      width={200}
                      height={200}
                      quality={100}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="mb-4.5 flex-1">
                  <p className="text-sm dark:text-white  cms-heading">{formData.sec_one_title || "N/A"}</p>
                </div>
              </div>

              <div className="mb-4.5">
                <div
                  className="text-sm dark:text-white  cms-description "
                  dangerouslySetInnerHTML={{ __html: formData.sec_one_desc || "N/A" }}
                />
              </div>

            </div>
          </div>

          {/* Banner Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">Join us</h3>
            </div>
            <div className="p-6.5">

              <div className="mb-4.5">
                <p className="text-sm dark:text-white cms-description">{formData.banner_title || "N/A"}</p>
              </div>

              <div className="mb-4.5">
                <p className="text-sm dark:text-white">
                  <a
                    href={formData.banner_btn_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"

                  >
                    {formData.banner_btn_text || "N/A"}
                  </a>
                </p>
              </div>


            </div>
          </div>

        </div>

        <div className="flex flex-col gap-9">

          {/* Why Choose Us Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">Why Choose Us</h3>
            </div>
            <div className="p-6.5">

              <div className="mb-4.5 flex items-center space-x-4">

                <div className="w-25 h-25 flex-shrink-0 rounded-full overflow-hidden border-[1.5px] bg-gray-200 border-stroke">
                  {formData.sec_two_img && (
                    <Image
                      src={`/api${formData.sec_two_img}`}
                      alt="Profile Preview"
                      width={200}
                      height={200}
                      quality={100}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="mb-4.5 flex-1">
                  <p className="text-sm dark:text-white cms-heading">{formData.sec_two_title || "N/A"}</p>
                </div>
              </div>


              <div className="mb-4.5">
                <div
                  className="text-sm dark:text-white cms-description"
                  dangerouslySetInnerHTML={{ __html: formData.sec_two_desc || "N/A" }}
                />
              </div>

              <div className="mb-4.5 flex items-center space-x-4">
                {/* Image Section */}
                <div className="w-25 h-25 flex-shrink-0 rounded-full overflow-hidden border-[1.5px] bg-gray-200 border-stroke flex-shrink-0">
                  {formData.feature_one_img && (
                    <Image
                      src={`/api${formData.feature_one_img}`}
                      alt="Profile Preview"
                      width={200}
                      height={200}
                      quality={100}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Title Section */}
                <div className="mb-4.5 flex-1">
                  <p className="text-sm dark:text-white cms-description">{formData.feature_one || "N/A"}</p>
                </div>
              </div>



              <div className="mb-4.5 flex items-center space-x-4">
                <div className="w-25 h-25 flex-shrink-0 rounded-full overflow-hidden border-[1.5px] bg-gray-200 border-stroke">
                  {formData.feature_two_img && (
                    <Image
                      src={`/api${formData.feature_two_img}`}
                      alt="Profile Preview"
                      width={200}
                      height={200}
                      quality={100}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="mb-4.5 flex-1">
                  <p className="text-sm dark:text-white cms-description">{formData.feature_two || "N/A"}</p>
                </div>
              </div>


              <div className="mb-4.5 flex items-center space-x-4">
                <div className="w-25 h-25 flex-shrink-0 rounded-full overflow-hidden border-[1.5px] bg-gray-200 border-stroke">
                  {formData.feature_three_img && (
                    <Image
                      src={`/api${formData.feature_three_img}`}
                      alt="Profile Preview"
                      width={200}
                      height={200}
                      quality={100}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="mb-4.5 flex-1">
                  <p className="text-sm dark:text-white cms-description">{formData.feature_three || "N/A"}</p>
                </div>
              </div>


              <div className="mb-4.5 flex items-center space-x-4">
                <div className="w-25 h-25 flex-shrink-0 rounded-full overflow-hidden border-[1.5px] bg-gray-200 border-stroke">
                  {formData.feature_four_img && (
                    <Image
                      src={`/api${formData.feature_four_img}`}
                      alt="Profile Preview"
                      width={200}
                      height={200}
                      quality={100}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="mb-4.5 flex-1">
                  <p className="text-sm dark:text-white cms-description" >{formData.feature_four || "N/A"}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );

};

export default Settings;
