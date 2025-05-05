"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Updated import for query parameter extraction
import Breadcrumb from "@/components/Breadcrumbs/UserBreadcrumb";
import NextImage from "next/image"; // Rename the import to avoid conflict
import { toast } from "sonner";
import { FaCheckCircle } from "react-icons/fa";

// Add this utility function at the top level
const capitalizeFirstLetter = (value: any): string => {
  if (!value) return "";

  // Handle objects (like city, state)
  if (typeof value === 'object' && value !== null) {
    return value.name ? capitalizeFirstLetter(value.name) : "";
  }

  // Convert to string and handle non-string values
  const str = String(value);
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const FormElements = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [isLoading, setIsLoading] = useState(true);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
    city_id: "",
    state: { name: "" },
    city: { name: "" },
    country: { name: "" },
    reactivate_reason: "",
    deactivate_reason: "",
    is_approve: false,
    is_verify: false,
    is_active: Boolean
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

          setFormData((prevFormData) => ({
            ...prevFormData, // Spread existing form data to keep other fields
            photo1: data?.photo1 ? `/api${data.photo1}` : '',
            photo2: data?.photo2 ? `/api${data.photo2}` : '',
            photo3: data?.photo3 ? `/api${data.photo3}` : '',
            photo4: data?.photo4 ? `/api${data.photo4}` : '',
            profile_photo: data?.profile_photo ? `/api${data.profile_photo}` : '',
            profile_creator_photo: data?.profile_creator_photo ? `/api${data.profile_creator_photo}` : '',
            horoscope: data?.horoscope ? `/api${data.horoscope}` : ''
          }));

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

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowImagePopup(true);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const images = [formData.photo1, formData.photo2, formData.photo3, formData.photo4].filter(img => img);
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Breadcrumb pageName="View Profile" />

      {/* Main Profile Section */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-8">
        <div className="p-8 flex flex-col md:flex-row gap-8">
          {/* Left Column - Photos */}
          <div className="md:w-1/3">
            <div className="mb-6">
              <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden bg-gray-100">
                {formData.profile_photo && (
                  <NextImage
                    src={formData.profile_photo}
                    alt="Profile"
                    width={192}
                    height={192}
                    quality={100}
                    unoptimized={true}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Additional Photos Grid - even smaller sizes */}
            <div className="flex justify-center gap-4 mt-4">
              {[formData.photo1, formData.photo2, formData.photo3, formData.photo4]
                .filter(photo => photo)
                .map((photo, index) => (
                  <div
                    key={index}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  >
                    <NextImage
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      width={80}
                      height={80}
                      quality={100}
                      unoptimized={true}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Right Column - Basic Info */}
          <div className="md:w-2/3">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2 dark-text">
                {capitalizeFirstLetter(formData.name)} {capitalizeFirstLetter(formData.lastname)}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {capitalizeFirstLetter(formData.bride_groom_detail)}
              </p>
              
              {/* Moved Verification status to top */}
              <div className="flex flex-row items-center gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <FaCheckCircle className={formData.is_approve ? "text-green-600" : "text-red-500"} />
                  <span className={formData.is_approve ? "text-green-600" : "text-red-500"}>
                    Email: {formData.is_approve === true ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <FaCheckCircle className={formData.is_verify ? "text-green-600" : "text-red-500"} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Basic Info Items */}
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Age:</span>
                <span className="text-gray-800 dark:text-white">{formData.age}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Gender:</span>
                <span className="text-gray-800 dark:text-white">{capitalizeFirstLetter(formData.gender)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Email:</span>
                <span className="text-gray-800 dark:text-white">{formData.email}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Phone:</span>
                <span className="text-gray-800 dark:text-white">{formData.phonenumber}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Education:</span>
                <span className="text-gray-800 dark:text-white">{formData.education}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Religion:</span>
                <span className="text-gray-800 dark:text-white">{capitalizeFirstLetter(formData.religion)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Profession:</span>
                <span className="text-gray-800 dark:text-white">{formData.profession}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Caste:</span>
                <span className="text-gray-800 dark:text-white">{capitalizeFirstLetter(formData.caste)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Income:</span>
                <span className="text-gray-800 dark:text-white">{formData.income}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Subcaste:</span>
                <span className="text-gray-800 dark:text-white">{capitalizeFirstLetter(formData.subcaste)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Looking For:</span>
                <span className="text-gray-800 dark:text-white">{capitalizeFirstLetter(formData.lookingfor)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Location:</span>
                <span className="text-gray-800 dark:text-white whitespace-nowrap">
                  {[
                    capitalizeFirstLetter(formData.city?.name),
                    capitalizeFirstLetter(formData.state?.name)
                  ].filter(Boolean).join(", ")}
                </span>
              </div>
            </div>

            {/* Horoscope button */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-5 gap-4">
              <div>
                {formData.horoscope && (
                  <button
                    onClick={handlePreview}
                    className="w-full md:w-auto inline-block px-10 py-4 text-white duration-150 rounded-full md:text-sm ftext-custom"
                  >
                    View Horoscope
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Profile Creator Section - Show only if profile is not created for self */}
      {formData.profile_created_for !== 'myself' && (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-8">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark bg-color-custom dark-text">
            <h3>Profile Creator Details</h3>
          </div>
          <div className="p-8 flex flex-col md:flex-row gap-8">
            {/* Creator's Photo */}
            <div className="md:w-1/4">
              <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden bg-gray-100">
                {formData.profile_creator_photo && (
                  <NextImage
                    src={formData.profile_creator_photo}
                    alt="Creator Profile"
                    width={128}
                    height={128}
                    quality={100}
                    unoptimized={true}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Creator's Information */}
            <div className="md:w-3/4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-[120px]">Creator Name:</span>
                  <span className="text-gray-800 dark:text-white">
                    {capitalizeFirstLetter(formData.profile_creator_name)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-[120px]">Phone Number:</span>
                  <span className="text-gray-800 dark:text-white">
                    {formData.phonenumber}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-[120px]">Created For:</span>
                  <span className="text-gray-800 dark:text-white">
                    {capitalizeFirstLetter(formData.profile_created_for)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-[120px]">Aadhar:</span>
                  <span className="text-gray-800 dark:text-white">
                    {formData.profile_creator_aadhar}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Detailed Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Personal Details */}
        <DetailSection title="Personal Details">
          <div className="grid grid-cols-1 gap-4">
            <InfoItem label="Date of Birth" value={formData.birthdate ? formatDate(formData.birthdate) : ""} inline={true} />
            <InfoItem label="Place of Birth" value={capitalizeFirstLetter(formData.place_of_birth)} inline={true} />
            <InfoItem label="Marital Status" value={capitalizeFirstLetter(formData.maritalstatus)} inline={true} />
            <InfoItem label="Complexion" value={capitalizeFirstLetter(formData.complexion)} inline={true} />
            <InfoItem label="Employed In" value={capitalizeFirstLetter(formData.job)} inline={true} />
            <InfoItem label="Work Location" value={capitalizeFirstLetter(formData.place_of_work)} inline={true} />
            <InfoItem label="Alt Phone" value={formData.profile_creator_phonenumber} inline={true} />

          </div>
        </DetailSection>

        {/* Family Information */}
        <DetailSection title="Family Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Father's Details */}
            <div>
              <h4 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-2 dark-text">
                {capitalizeFirstLetter("Father's Details")}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <InfoItem label="Name" value={capitalizeFirstLetter(formData.father_name)} inline={true} />
                <InfoItem label="Occupation" value={capitalizeFirstLetter(formData.father_occupation)} inline={true} />
                <InfoItem label="Contact" value={capitalizeFirstLetter(formData.father_phonenumber)} inline={true} />
                <InfoItem label="Religion" value={capitalizeFirstLetter(formData.father_religion)} inline={true} />
                <InfoItem label="Profession" value={capitalizeFirstLetter(formData.father_profession)} inline={true} />
                <InfoItem label="Place of Work" value={capitalizeFirstLetter(formData.father_placeOfWork)} inline={true} />
              </div>
            </div>

            {/* Mother's Details */}
            <div className="mt-4 md:mt-0">
              <h4 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-2 dark-text">
                {capitalizeFirstLetter("Mother's Details")}
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <InfoItem label="Name" value={capitalizeFirstLetter(formData.mother_name)} inline={true} />
                <InfoItem label="Occupation" value={capitalizeFirstLetter(formData.mother_occupation)} inline={true} />
                <InfoItem label="Contact" value={capitalizeFirstLetter(formData.mother_phonenumber)} inline={true} />
                <InfoItem label="Religion" value={capitalizeFirstLetter(formData.mother_religion)} inline={true} />
                <InfoItem label="Profession" value={capitalizeFirstLetter(formData.mother_profession)} inline={true} />
                <InfoItem label="Place of Work" value={capitalizeFirstLetter(formData.mother_placeOfWork)} inline={true} />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-start">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Address:</span>
                <div className="text-gray-800 dark:text-white flex flex-col">
                  <span>{capitalizeFirstLetter(formData.address)}</span>
                  <span className="whitespace-nowrap">
                    {[
                      capitalizeFirstLetter(formData.city?.name),
                      capitalizeFirstLetter(formData.state?.name),
                      capitalizeFirstLetter(formData.country?.name)
                    ].filter(Boolean).join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DetailSection>
      </div>

      {/* New 3-column section for Religion, Partner, and Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Religious Information */}
        <DetailSection title="Religious Information">
          <div className="grid grid-cols-1 gap-4">
            <InfoItem label="Kuladeivam" value={capitalizeFirstLetter(formData.kuladeivam)} inline={true} />
            <InfoItem label="Place of Temple" value={capitalizeFirstLetter(formData.place_of_kuladeivam_temple)} inline={true} />
            <InfoItem label="Gothram" value={capitalizeFirstLetter(formData.gothram)} inline={true} />
          </div>
        </DetailSection>

        {/* Partner Preferences */}
        <DetailSection title="Partner Preferences">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Age:</span>
              <span className="text-gray-800 dark:text-white">
                {capitalizeFirstLetter(formData.partner_pref_age)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Education:</span>
              <span className="text-gray-800 dark:text-white">
                {capitalizeFirstLetter(formData.partner_pref_education)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Caste:</span>
              <span className="text-gray-800 dark:text-white">
                {capitalizeFirstLetter(formData.caste)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 w-[100px] sm:min-w-[120px]">Subcaste In Mudaliyar:</span>
              <span className="text-gray-800 dark:text-white">
                {capitalizeFirstLetter(formData.partner_pref_subcaste)}
              </span>
            </div>
          </div>
        </DetailSection>

        {/* Reference Details */}
        <DetailSection title="Reference Details">
          <div className="grid grid-cols-1 gap-4">
            <InfoItem label="Reference 1" value={capitalizeFirstLetter(formData.reference1)} inline={true} />
            <InfoItem label="Reference 2" value={capitalizeFirstLetter(formData.reference2)} inline={true} />
          </div>
        </DetailSection>
      </div>

      {/* Image Popup */}
      {showImagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl mx-auto">
            <button
              onClick={() => setShowImagePopup(false)}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ×
            </button>
            <button
              onClick={() => handleNavigate('prev')}
              className="absolute left-4 top-1/2 text-white text-2xl"
            >
              ‹
            </button>
            <button
              onClick={() => handleNavigate('next')}
              className="absolute right-4 top-1/2 text-white text-2xl"
            >
              ›
            </button>
            <NextImage
              src={[formData.photo1, formData.photo2, formData.photo3, formData.photo4].filter(img => img)[selectedImageIndex]}
              alt="Selected photo"
              width={800}
              height={600}
              quality={100}
              unoptimized={true}
              className="max-h-[80vh] w-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};

// Helper Components
const DetailSection = ({ title, children }) => (
  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark bg-color-custom  dark-text ">
      <h3>{capitalizeFirstLetter(title)}</h3>
    </div>
    <div className="p-6.5">{children}</div>
  </div>
);

// Update the InfoItem component for consistent label-value alignment
const InfoItem = ({ label, value, inline = false }) => {
  return (
    <div className={inline ? "flex items-center" : "flex flex-col"}>
      <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[120px]">{label}:</span>
      <span className="text-gray-800 dark:text-white">
        {value ? capitalizeFirstLetter(value) : "Not specified"}
      </span>
    </div>
  );
};

export default FormElements;
