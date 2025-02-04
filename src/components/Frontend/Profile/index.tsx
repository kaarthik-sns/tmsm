'use client';
import { useState, useEffect } from "react";
import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";

export default function Profile({data}) {
  const profile_data = data;

  const [popupImage, setPopupImage] = useState(null); // State to store the image to show in the popup
  const openPopup = (image) => setPopupImage(image); // Set the clicked image in state
  const closePopup = () => setPopupImage(null); // Close the popup
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Return an empty string if the date is invalid
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`; // Example: "02-May-2025"
  };

  const handlePreview = () => {
    if (profile_data.horoscope) {
      // Open the file in a new tab
      window.open(profile_data.horoscope, "_blank");
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

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="profilecolor text-white py-8 relative">
        <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start">

          {/* Left Side: Profile Info */}
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start px-5">
            <div className="relative">
              {/* Profile Picture */}

              {profile_data.profile_photo && (
                <Image
                  src={profile_data.profile_photo || "/uploads/photos/1738154599244-a8e0a88c34bc.png"}
                  alt="Profile Picture"
                  width={200} // Fixed width
                  height={200} // Fixed height
                  quality={100}
                  unoptimized={true}
                  className="w-40 h-40 object-cover rounded-full border-4 border-white cursor-pointer"
                />
              )}
            </div>

            <div className="text-center lg:text-left px-5">
              <h1 className="text-2xl font-bold mb-2 text-white">{profile_data.name || "No name provided"} {profile_data.lastname || ""}</h1>
              <p className="max-w-lg text-white text-justify">
                {profile_data.bride_groom_detail || ""}
              </p>
              {(profile_data.horoscope) && (
                <button className="inline-block px-10 py-4 text-white duration-150 rounded-full md:text-sm ftext-custom mt-5" onClick={handlePreview} style={{ width: "200px", padding: "8px 0" }}>View Horoscope</button>
              )}
            </div>
          </div>

          {/* Right Side: Contact Info */}
          <div className="p-6 rounded-lg text-white mt-6 lg:mt-0 lg:ml-10 md:px-26">
            <h2 className="text-lg font-bold">CONTACT INFO</h2>
            <div className="mt-2 conatct-bio">
              <p><FaPhoneAlt className="inline-block mr-2" /> {profile_data.phonenumber || "-"}</p>
              <p><FaEnvelope className="inline-block mr-2" /> {profile_data.email || "-"}</p>
              <p>
                <FaMapMarkerAlt className="inline-block mr-2" />
                {profile_data?.city?.name ? `${profile_data?.city?.name}, ` : ""}
                {profile_data?.state?.name || ""}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Information Sections */}
      <div className="container max-w-5xl mx-auto bg-light p-6 mt-6 mb-6 shadow-md rounded-lg">
        {/* Verification */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-green-600">
          <div className="flex items-center gap-1">
            <FaCheckCircle /> <span>Email: {profile_data.is_approve === true ? "Verified" : "Not Verified"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaCheckCircle /> <span>Identity: {profile_data.is_verify === true ? "Verified" : "Not Verified"}</span>
          </div>
        </div>

        {/* Personal Information */}
        <h2 className="profile-heading py-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:gap-4 mt-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="contact-bio">
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">D.O.B</strong>
              <span>{profile_data.birthdate ? formatDate(profile_data.birthdate) : ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Age</strong>
              <span>{profile_data.age || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Looking For</strong>
              <span>{profile_data.lookingfor || ""}</span>
            </p>
          </div>

          <div className="contact-bio">
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Religion</strong>
              <span>{profile_data.religion || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Caste</strong>
              <span>{profile_data.caste || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Sub Caste</strong>
              <span>{profile_data.subcaste || ""}</span>
            </p>
          </div>

          <div className="contact-bio">
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Place Of Birth</strong>
              <span>{profile_data.place_of_birth || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Gender</strong>
              <span>{profile_data.gender || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Complexion</strong>
              <span>{profile_data.complexion || ""}</span>
            </p>
          </div>
        </div>


        <div className="border-color mt-6 mb-6"></div>

        {/* Education & Occupation */}
        <div className="grid grid-cols-1 gap-4 mt-3 md:grid-cols-2">
          <div className="contact-bio">
            <h2 className="profile-heading py-6">Family Information</h2>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-60">Kuladeivam</strong>
              <span>{profile_data.kuladeivam || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-60">Place of Kuladeivam</strong>
              <span>{profile_data.place_of_kuladeivam_temple || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-60">Gothram</strong>
              <span>{profile_data.gothram || ""}</span>
            </p>
          </div>
          <div className="border-color mt-3 mb-3 md:hidden"></div>

          <div className="contact-bio">
            <h2 className="profile-heading py-6">Education / Occupation</h2>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Education</strong>
              <span>{profile_data.partner_pref_education || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Profession</strong>
              <span>{profile_data.profession || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Employed In</strong>
              <span>{profile_data.job || ""}</span>
            </p>
          </div>
        </div>

        <div className="border-color mt-6 mb-6"></div>

        {/* Parent Details */}
        <h2 className="profile-heading py-6">Parents Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="contact-bio">
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Father’s Name</strong>
              <span>{profile_data.father_name || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Phone</strong>
              <span>{profile_data.father_phonenumber || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Religion</strong>
              <span>{profile_data.father_religion || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Occupation</strong>
              <span>{profile_data.father_occupation || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Profession</strong>
              <span>{profile_data.father_profession || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Place of work</strong>
              <span>{profile_data.father_placeOfWork || ""}</span>
            </p>
          </div>

          <div className="contact-bio">
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Mother’s Name</strong>
              <span>{profile_data.mother_name || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Phone</strong>
              <span>{profile_data.mother_phonenumber || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Religion</strong>
              <span>{profile_data.mother_religion || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Occupation</strong>
              <span>{profile_data.mother_occupation || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Profession</strong>
              <span>{profile_data.mother_profession || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Place of work</strong>
              <span>{profile_data.mother_placeOfWork || ""}</span>
            </p>
          </div>
        </div>

        <div className="border-color mt-6 mb-6"></div>

        <div className="grid grid-cols-1 gap-4 mt-3">
          <h2 className="profile-heading py-6">Address</h2>
          <div className="contact-bio">
            <p>{profile_data.address || ""} </p>
          </div>
        </div>

        <div className="border-color mt-6 mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {/* Partner Preference */}
          <div className="contact-bio">
            <h2 className="profile-heading py-6">Partner Preference</h2>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Education</strong>
              <span>{profile_data.partner_pref_education || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Age</strong>
              <span>{profile_data.partner_pref_age || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Caste</strong>
              <span>{profile_data.partner_pref_caste || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">SubCaste</strong>
              <span>{profile_data.partner_pref_subcaste || ""}</span>
            </p>
          </div>

          <div className="border-color mt-3 mb-3 md:hidden"></div>

          {/* References */}
          <div className="contact-bio">
            <h2 className="profile-heading py-6">References</h2>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Reference 1</strong>
              <span> {profile_data.reference1 || ""}</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Reference 2</strong>
              <span>{profile_data.reference2 || ""}</span>
            </p>

          </div>
        </div>

        {/*Additional Pictures */}


        {(profile_data.photo1 || profile_data.photo2 || profile_data.photo3 || profile_data.photo4) && (
          <> <div className="border-color mt-6 mb-6"></div>
            <div className="grid grid-cols-1 gap-4 mt-3">
              <h2 className="profile-heading py-6">Additional Pictures</h2>
              <div className="contact-bio flex flex-wrap gap-4">
                {[profile_data.photo1, profile_data.photo2, profile_data.photo3, profile_data.photo4]
                  .filter(Boolean) // Removes `null` or `undefined` values
                  .map((photo, index) => (
                    <Image
                      key={index}
                      src={photo}
                      alt={`Profile Picture ${index + 1}`}
                      width={150}
                      height={150}
                      quality={100}
                      unoptimized={true}
                      className="rounded-full border-4 border-white cursor-pointer"
                      onClick={() => openPopup(photo)}
                    />
                  ))}
              </div>

              {/* Popup */}
              {popupImage && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 px-4">
                  <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm sm:max-w-md w-full relative">
                    <button
                      onClick={closePopup}
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 red-color"
                      aria-label="Close"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                    <div className="flex justify-center items-center">
                      <img
                        src={popupImage}
                        alt="Enlarged Profile Picture"
                        className="max-w-full max-h-screen rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}


            </div>
          </>
        )}

      </div>
    </div>
  );
}
