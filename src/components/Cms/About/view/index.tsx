'use client'
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import Image from "next/image";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import Link from "next/link";

const Settings = () => {

  const [isLoading, setIsLoading] = useState(true);

  const lang = localStorage.getItem('lang') || 'en';

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

    sec_one_title_ta: '',
    sec_one_desc_ta: '',
    sec_two_title_ta: '',
    sec_two_desc_ta: '',
    feature_one_ta: '',
    feature_one_desc_ta: '',
    feature_two_ta: '',
    feature_two_desc_ta: '',
    feature_three_ta: '',
    feature_three_desc_ta: '',
    feature_four_ta: '',
    feature_four_desc_ta: '',
    banner_title_ta: '',
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
        <div className="flex flex-col gap-6">
          {/* Banner Section start */}
          <div className="rounded-lg border border-stroke bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-5 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Banner
              </h3>
            </div>
            <div className="p-7">
              <div className="flex items-center space-x-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 border-indigo-100 bg-gray-200">
                  {formData.banner_img && (
                    <Image
                      src={`/api${formData.banner_img}`}
                      alt="Profile Preview"
                      width={200}
                      height={200}
                      quality={100}
                      unoptimized={true}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-800 dark:text-white">{ lang === 'ta' ? formData.banner_title_ta : formData.banner_title}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Banner Section end */}

          {/* what we offer start */}
          <div className="rounded-lg border border-stroke bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-5 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                What we offer
              </h3>
            </div>
            <div className="p-7">
              {/* Feature One */}
              <div className="mb-8">
                <div className="flex items-center space-x-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-indigo-100 bg-gray-200">
                    {formData.feature_one_img && (
                      <Image
                        src={`/api${formData.feature_one_img}`}
                        alt="Feature One"
                        width={200}
                        height={200}
                        quality={100}
                        unoptimized={true}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-white">{  lang === 'ta' ? formData.feature_one_ta : formData.feature_one}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{lang === 'ta' ? formData.feature_one_desc_ta : formData.feature_one_desc}</p>
                  </div>
                </div>
              </div>

              {/* Feature Two */}
              <div className="mb-8">
                <div className="flex items-center space-x-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-indigo-100 bg-gray-200">
                    {formData.feature_two_img && (
                      <Image
                        src={`/api${formData.feature_two_img}`}
                        alt="Feature Two"
                        width={200}
                        height={200}
                        quality={100}
                        unoptimized={true}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-white">{lang === 'ta' ? formData.feature_two_ta : formData.feature_two}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{lang === 'ta' ? formData.feature_two_desc_ta : formData.feature_two_desc}</p>
                  </div>
                </div>
              </div>

              {/* Feature Three */}
              <div className="mb-8">
                <div className="flex items-center space-x-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-indigo-100 bg-gray-200">
                    {formData.feature_three_img && (
                      <Image
                        src={`/api${formData.feature_three_img}`}
                        alt="Feature Three"
                        width={200}
                        height={200}
                        quality={100}
                        unoptimized={true}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-white">{lang === 'ta' ? formData.feature_three_ta : formData.feature_three}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{lang === 'ta' ? formData.feature_three_desc_ta : formData.feature_three_desc}</p>
                  </div>
                </div>
              </div>

              {/* Feature Four */}
              <div>
                <div className="flex items-center space-x-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-indigo-100 bg-gray-200">
                    {formData.feature_four_img && (
                      <Image
                        src={`/api${formData.feature_four_img}`}
                        alt="Feature Four"
                        width={200}
                        height={200}
                        quality={100}
                        unoptimized={true}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-white">{lang === 'ta' ? formData.feature_four_ta : formData.feature_four}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{lang === 'ta' ? formData.feature_four_desc_ta : formData.feature_four_desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* what we offer end */}
        </div>

        <div className="flex flex-col gap-6">
          {/* About Us Section start */}
          <div className="rounded-lg border border-stroke bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-5 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                About Us
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-6 flex items-center space-x-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 border-indigo-100 bg-gray-200">
                  {formData.sec_one_img && (
                    <Image
                      src={`/api${formData.sec_one_img}`}
                      alt="About Us"
                      width={200}
                      height={200}
                      quality={100}
                      unoptimized={true}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white">{lang === 'ta' ? formData.sec_one_title_ta : formData.sec_one_title}</h4>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div
                  className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: lang === 'ta' ? formData.sec_one_desc_ta : formData.sec_one_desc }}
                />
              </div>
            </div>
          </div>
          {/* About Us Section end */}

          {/* Our Story Section start */}
          <div className="rounded-lg border border-stroke bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-5 dark:border-strokedark">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Our Story
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-6 flex items-center space-x-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border-2 border-indigo-100 bg-gray-200">
                  {formData.sec_two_img && (
                    <Image
                      src={`/api${formData.sec_two_img}`}
                      alt="Our Story"
                      width={200}
                      height={200}
                      quality={100}
                      unoptimized={true}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white">{lang === 'ta' ? formData.sec_two_title_ta : formData.sec_two_title}</h4>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div
                  className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: lang === 'ta' ? formData.sec_two_desc_ta : formData.sec_two_desc }}
                />
              </div>
            </div>
          </div>
          {/* Our Story Section end */}
        </div>
      </div>

    </>

  );
};

export default Settings;
