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
    feature_one_desc: '',

    feature_two: '',
    feature_two_img: '',
    feature_two_desc: '',

    feature_three: '',
    feature_three_img: '',
    feature_three_desc: '',

    feature_four: '',
    feature_four_img: '',
    feature_four_desc: '',

    banner_title: '',
    banner_img: '',
  });

  useEffect(() => {

    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/cms/about", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data.");
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
          { name: "About Us" },
        ]}
      />

      <div className="items-start justify-between md:flex">
        <div className="mt-3 md:mt-0 mb-3">
          <Link
            href="/admin/cms/about/edit"
            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
          >
            Edit About Us
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">

        <div className="flex flex-col gap-9">

          {/* Banner Section start */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">
                Banner Section
              </h3>
            </div>

            <div className="p-6.5">

              <div className="mb-4.5 flex items-center space-x-4">

                <div className="w-25 h-25 flex-shrink-0 rounded-full overflow-hidden border-[1.5px] bg-gray-200 border-stroke">
                  {formData.banner_img && (
                    <Image
                      src={formData.banner_img}
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
                  <label className="block text-sm font-medium text-gray-700 dark-text">
                    Title
                  </label>
                  <p className="text-sm dark:text-white">{formData.sec_two_title || "N/A"}</p>
                </div>
              </div>

            </div>
          </div>
          {/* Banner Section end */}


          {/* what we offer start */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">
                What we offer
              </h3>
            </div>

            <div className="p-6.5">

              <div className="mb-4.5 flex items-center space-x-4">
                <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200 border-stroke focus:border-primary`}>
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
                <div className="mb-4.5">
                  <label className="block text-sm font-medium dark-text dark:text-white">
                    Title
                  </label>
                  <p className="text-sm dark:text-white">{formData.feature_one || ""}</p>
                </div>
              </div>


              <div className="mb-4.5">
                <label className="block text-sm font-medium dark-text dark:text-white">
                  Description
                </label>
                <p className="text-sm dark:text-white">{formData.feature_one_desc || ""}</p>
              </div>

              <div className="mb-4.5 flex items-center space-x-4">

                <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200border-stroke focus:border-primary`}>
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
                <div className="mb-4.5">
                  <label className="block text-sm font-medium dark-text dark:text-white">
                    Title
                  </label>
                  <p className="text-sm dark:text-white">{formData.feature_two || ""}</p>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="block text-sm font-medium dark-text dark:text-white">
                  Description
                </label>
                <p className="text-sm dark:text-white">{formData.feature_two_desc || ""}</p>
              </div>

              <div className="mb-4.5 flex items-center space-x-4">
                <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200border-stroke focus:border-primary`}>
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
                <div className="mb-4.5">
                  <label className="block text-sm font-medium dark-text dark:text-white">
                    Title
                  </label>
                  <p className="text-sm dark:text-white">{formData.feature_three || ""}</p>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="block text-sm font-medium dark-text dark:text-white">
                  Description
                </label>
                <p className="text-sm dark:text-white">{formData.feature_three_desc || ""}</p>
              </div>

              <div className="mb-4.5 flex items-center space-x-4">
                <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200border-stroke focus:border-primary`}>
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

                <div className="mb-4.5">
                  <label className="block text-sm font-medium dark-text dark:text-white">
                    Title
                  </label>
                  <p className="text-sm dark:text-white">{formData.feature_four || ""}</p>
                </div>
              </div>


              <div className="mb-4.5">
                <label className="block text-sm font-medium dark-text dark:text-white">
                  Description
                </label>
                <p className="text-sm dark:text-white">{formData.feature_four_desc || ""}</p>
              </div>

            </div>

          </div>
          {/* what we offer end */}

        </div>


        <div className="flex flex-col gap-9">


          {/* About Us Section start */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">
                About Us Section
              </h3>
            </div>
            <div className="p-6.5">

              <div className="mb-4.5 flex items-center space-x-4">
                <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200border-stroke focus:border-primary`}>
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
                <div className="mb-4.5">
                  <label className="block text-sm font-medium dark-text dark:text-white">
                    Title
                  </label>
                  <p className="text-sm dark:text-white">{formData.sec_one_title || ""}</p>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Description
                </label>
                <div
                  className="text-sm dark:text-white"
                  dangerouslySetInnerHTML={{ __html: formData.sec_one_desc || "N/A" }}
                />
              </div>

            </div>
          </div>
          {/* About Us Section end */}

          {/* Our Story Section start */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">
                Our Story Section
              </h3>
            </div>
            <div className="p-6.5">

              <div className="mb-4.5 flex items-center space-x-4">
                <div className={`w-25 h-25 rounded-full overflow-hidden border-[1.5px] bg-gray-200border-stroke focus:border-primary`}>
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
                <div className="mb-4.5">
                  <label className="block text-sm font-medium dark-text dark:text-white">
                    Title
                  </label>
                  <p className="text-sm dark:text-white">{formData.sec_two_title || ""}</p>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Description
                </label>
                <div
                  className="text-sm dark:text-white"
                  dangerouslySetInnerHTML={{ __html: formData.sec_two_desc || "N/A" }}
                />
              </div>

            </div>
          </div>
          {/* Our Story Section end */}



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


    </>

  );
};

export default Settings;
