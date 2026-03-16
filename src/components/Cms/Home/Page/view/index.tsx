'use client'
import Breadcrumb from "@/components/Breadcrumbs/BreadcrumbCustom";
import Image from "next/image";
import { useState, useEffect } from "react";

import Link from "next/link";

const Settings = () => {

  const [isLoading, setIsLoading] = useState(true);

  const lang = localStorage.getItem('lang') || 'en';
  const isTamil = lang === 'ta';

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
    sec_one_title_ta: '',
    sec_one_desc_ta: '',
    sec_two_title_ta: '',
    sec_two_desc_ta: '',
    feature_one_ta: '',
    feature_two_ta: '',
    feature_three_ta: '',
    feature_four_ta: '',
    banner_title_ta: '',
    banner_btn_text_ta: '',
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
          {
            name: isTamil ? "கட்டுப்பாட்டகம்" : "Dashboard",
            href: "/admin/dashboard",
          },
          {
            name: isTamil ? "முகப்பு பக்கம்" : "Home Page",
          },
        ]}
      />

      <div className="items-start justify-between md:flex">
        <div className="mt-3 md:mt-0 mb-3">
          <Link
            href="/admin/cms/home/page/edit"
            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm bg-color-custom dark-text"
          >
            {isTamil ? "முகப்புப் பக்கத்தைத் திருத்தவும்" : "Edit Home Page"}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">

        <div className="flex flex-col gap-9">

          {/* About Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">{isTamil ? 'எங்களைப் பற்றி' : 'About'}</h3>
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
                  <p className="text-sm dark:text-white  cms-heading">{lang === 'ta' ? formData.sec_one_title_ta : formData.sec_one_title}</p>
                </div>
              </div>

              <div className="mb-4.5">
                <div
                  className="text-sm dark:text-white  cms-description "
                  dangerouslySetInnerHTML={{ __html: lang === 'ta' ? formData.sec_one_desc_ta : formData.sec_one_desc }}
                />
              </div>

            </div>
          </div>

          {/* Banner Section */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">{isTamil ? 'எங்களுடன் சேருங்கள்' : 'Join us'}</h3>
            </div>
            <div className="p-6.5">

              <div className="mb-4.5">
                <p className="text-sm dark:text-white cms-description">{lang === 'ta' ? formData.banner_title_ta : formData.banner_title}</p>
              </div>

              <div className="mb-4.5">
                <p className="text-sm dark:text-white">
                  <a
                    href={formData.banner_btn_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"

                  >
                    {lang === 'ta' ? formData.banner_btn_text_ta : formData.banner_btn_text}
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
              <h3 className="font-medium dark-text dark:text-white">{isTamil ? 'எங்களை ஏன் தேர்ந்தெடுக்க வேண்டும்' : 'Why Choose Us'}</h3>
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
                  <p className="text-sm dark:text-white cms-heading">{lang === 'ta' ? formData.sec_two_title_ta : formData.sec_two_title}</p>
                </div>
              </div>


              <div className="mb-4.5">
                <div
                  className="text-sm dark:text-white cms-description"
                  dangerouslySetInnerHTML={{ __html: lang === 'ta' ? formData.sec_two_desc_ta : formData.sec_two_desc }}
                />
              </div>

              <div className="mb-4.5 flex items-center space-x-4">
                {/* Image Section */}
                <div className="w-25 h-25 flex-shrink-0 rounded-full overflow-hidden border-[1.5px] bg-gray-200 border-stroke">
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
                  <p className="text-sm dark:text-white cms-description">{lang === 'ta' ? formData.feature_one_ta : formData.feature_one}</p>
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
                  <p className="text-sm dark:text-white cms-description">{lang === 'ta' ? formData.feature_two_ta : formData.feature_two}</p>
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
                  <p className="text-sm dark:text-white cms-description">{lang === 'ta' ? formData.feature_three_ta : formData.feature_three}</p>
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
                  <p className="text-sm dark:text-white cms-description" >{lang === 'ta' ? formData.feature_four_ta : formData.feature_four}</p>
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
