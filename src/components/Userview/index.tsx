"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Updated import for query parameter extraction
import Breadcrumb from "@/components/Breadcrumbs/UserBreadcrumb";
import NextImage from "next/image"; // Rename the import to avoid conflict
import { toast } from "sonner";


const FormElements = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phonenumber: "",
    religion: "",
    caste: "",
    subcaste: "",
    birthdate: "",
    age: "",
    place_of_birth: "",
    education: "",
    complexion: "",
    profession: "",
    income: "",
    job: "",
    place_of_work: "",
    kuladeivam: "",
    place_of_kuladeivam_temple: "",
    gothram: "",
    reference1: "",
    reference2: "",
    father_name: "",
    father_phonenumber: "",
    father_occupation: "",
    father_religion: "",
    father_profession: "",
    father_placeOfWork: "",
    mother_name: "",
    mother_phonenumber: "",
    mother_occupation: "",
    mother_religion: "",
    mother_profession: "",
    mother_placeOfWork: "",
    address: "",
    partner_pref_age: "",
    partner_pref_education: "",
    profile_photo: "",
    photo1: "",
    photo2: "",
    photo3: "",
    photo4: "",
    horoscope: "",
    maritalstatus: "",
    profile_created_for: "",
    profile_creator_name: "",
    profile_creator_photo: "",
    profile_creator_aadhar: "",
    profile_creator_phonenumber: "",
    lookingfor: "",
    partner_pref_subcaste: "",
    gender: "",
    bride_groom_detail: "",
    state_id: "",
    city_id: ""
  });

  const handlePreview = () => {
    if (formData.horoscope) {
      // Open the file in a new tab
      window.open(formData.horoscope, "_blank");
    } else {
      toast.error('No file uploaded to preview!', {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/get-user-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId }),
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

      fetchUserData();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Return an empty string if the date is invalid
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`; // Example: "02-May-2025"
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Breadcrumb pageName="View User" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">

          {(formData.profile_created_for && formData.profile_created_for !== 'myself') && (
            <>
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                  <h3 className="font-medium dark-text dark:text-white">
                    Profile Creator Details
                  </h3>
                </div>
                <div className="p-6.5">

                  <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                        {formData.profile_creator_photo && (
                          <NextImage
                            src={formData.profile_creator_photo || ""}
                            alt="Profile Creator Picture"
                            width={64}
                            height={64}
                            quality={100}
                            unoptimized={true}
                            className="w-full h-full object-coverborder-stroke focus:border-primary"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-2.5">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Profile created for : {formData.profile_created_for || ''}
                    </label>
                  </div>

                  < div className="mb-2.5">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Name : {formData.profile_creator_name || ""}
                    </label>
                  </div>

                  <div className="mb-2.5">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Aadhar Number : {formData.profile_creator_aadhar || ""}
                    </label>
                  </div>

                  <div className="mb-2.5">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Phone Number : {formData.profile_creator_phonenumber || ""}
                    </label>
                  </div>

                  <div className="mb-2.5">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Detail about groom / bride : {formData.bride_groom_detail || ""}
                    </label>
                  </div>

                  <div className="mb-2.5">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Gender : {formData.gender || ""}
                    </label>
                  </div>

                </div>
              </div>
            </>
          )}


          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">
                Groom / Bride Details
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                    {formData.profile_photo && (
                      <NextImage
                        src={formData.profile_photo || ""}
                        alt="Profile Preview"
                        width={64}
                        height={64}
                        quality={100}
                        unoptimized={true}
                        className="w-full h-full object-coverborder-stroke focus:border-primary"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-2.5">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    First name : {formData.name || "No name provided"} {formData.lastname || ""}
                  </label>

                </div>


              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Email : {formData.email || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Phone Number : {formData.phonenumber || ""}
                </label>

              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Marital Status : {formData.maritalstatus || ''}
                </label>
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Looking For : {formData.lookingfor || ''}
                </label>
              </div>

              {/* Render SelectGroupReligion with dynamic castes */}
              <div>
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Religion : {formData.religion}
                </label>
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Caste : {formData.caste}
                </label>
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  SubCaste : {formData.subcaste}
                </label>
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Date Of Birth :  {formData.birthdate ? formatDate(formData.birthdate) : ""}
                </label>

              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Age : {formData.age || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Place of birth :  {formData.place_of_birth || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  City :  {formData?.city?.name || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  State :  {formData?.state?.name || ""}
                </label>
              </div>
            </div>
          </div>

          {/* <!-- Other Details --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">
                Other Details
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Education for Groom / Bride : {formData.education || ""}
                </label>
              </div>

              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Complexation for Groom / Bride (Dark/Wheat/Fair) : {formData.complexion || ""}
                </label>
              </div>

              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Profession : {formData.profession || ""}
                </label>
              </div>

              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Income : {formData.income || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Job of Groom / Bride  (Company, job etc) : {formData.job || ""}
                </label>
              </div>

              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Place of work : {formData.place_of_work || ""}
                </label>
              </div>

              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Kuladeivam : {formData.kuladeivam || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Place of Kuladeivam temple : {formData.place_of_kuladeivam_temple || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Gothram : {formData.gothram || ""}
                </label>
              </div>

              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Horoscope :  {formData.horoscope && (
                    <button
                      onClick={handlePreview} style={{ width: "200px", padding: "8px 0" }}
                      className="mt-4 px-2 py-1 bg-blue-500 text-white rounded-md text-custom"
                    >
                      View
                    </button>

                  )
                  }
                </label>
              </div>
            </div>
          </div>
        </div>




        <div className="flex flex-col gap-9">
          {/* <!-- Parents Details --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">
                Parents Details
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Father's Name : {formData.father_name || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Father's Phone Number : {formData.father_phonenumber || ""}
                </label>
              </div>

              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Father's Occupation : {formData.father_occupation || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Father's Religion : {formData.father_religion}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Father's Profession : {formData.father_profession || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Father's place of work : {formData.father_placeOfWork || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Mother's Name : {formData.mother_name || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Mother's Phone Number : {formData.mother_phonenumber || ""}
                </label>
              </div>

              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Mother's Occupation : {formData.mother_occupation || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Mother's Religion : {formData.mother_religion}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Mother's Profession : {formData.mother_profession || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Mother's place of work : {formData.mother_placeOfWork || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Address : {formData.address || ""}
                </label>

              </div>

            </div>
          </div>
          {/* <!-- Partner Preference  --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">
                Partner Preference
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Education : {formData.partner_pref_education || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Age : {formData.partner_pref_age || ""}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  Caste : {formData.caste}
                </label>
              </div>
              <div className="mb-2.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  SubCaste : {formData.subcaste}
                </label>
              </div>
            </div>
          </div>
          {/* <!-- Partner Preference end --> */}


          {/* <!-- Photo upload start --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium dark-text dark:text-white">
                Additional Picture
              </h3>
            </div>

            <div className="flex flex-col gap-5.5 p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                {formData.photo1 && (
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                        <NextImage
                          src={formData.photo1 || ""}
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          quality={100}
                          unoptimized={true}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {formData.photo2 && (
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Picture2
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                        <NextImage
                          src={formData.photo2 || ""}
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          quality={100}
                          unoptimized={true}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {formData.photo2 && (
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Picture3
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                        <NextImage
                          src={formData.photo3 || ""}
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          quality={100}
                          unoptimized={true}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {formData.photo4 && (
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Picture4
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                        <NextImage
                          src={formData.photo4 || ""}
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          quality={100}
                          unoptimized={true}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <!-- Photo upload end--> */}


        </div>
      </div>
    </>
  );
};

export default FormElements;
