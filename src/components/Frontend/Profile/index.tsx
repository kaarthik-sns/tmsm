'use client';

import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

export default function Profile() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="profilecolor text-white py-8 relative">
  <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start">

    {/* Left Side: Profile Info */}
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start px-5">
      <div className="relative">
        {/* Profile Picture */}
        <Image
          src="/images/member/profile/p1.png" // Change with your image path
          width={200}
          height={200}
          alt="Profile Picture"
          className="rounded-full border-4 border-white"
        />
      </div>

      <div className="text-center lg:text-left px-5">
        <h1 className="text-2xl font-bold mb-2 text-white">Vijay Kumar</h1>
        <p className="max-w-lg text-white text-justify">
          I’m Vijay Kumar, who values family, honesty, and meaningful relationships. I enjoy Sports and believe in mutual respect and open communication. Looking for a partner to build a life full of love, trust, and companionship.
        </p>
        <button className="inline-block px-10 py-4 text-white duration-150 rounded-full md:text-sm ftext-custom mt-5">
          View Horoscope
        </button>
      </div>
    </div>

    {/* Right Side: Contact Info */}
    <div className="p-6 rounded-lg text-white mt-6 lg:mt-0 lg:ml-10 md:px-26">
      <h2 className="text-lg font-bold">CONTACT INFO</h2>
      <div className="mt-2 conatct-bio">
        <p><FaPhoneAlt className="inline-block mr-2" /> +91 12345 67890</p>
        <p><FaEnvelope className="inline-block mr-2" /> vijaykumar@email.com</p>
        <p><FaMapMarkerAlt className="inline-block mr-2" /> Coimbatore, Crosscut Road, 123456</p>
      </div>
    </div>

  </div>
</div>

      {/* Information Sections */}
      <div className="container max-w-5xl mx-auto bg-light p-6 mt-6 mb-6 shadow-md rounded-lg">
        {/* Verification */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-green-600">
          <div className="flex items-center gap-1">
            <FaCheckCircle /> <span>Email: Verified</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCheckCircle /> <span>Identity: Verified</span>
          </div>
        </div>

        {/* Personal Information */}
        <h2 className="profile-heading py-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:gap-4 mt-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="contact-bio">
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">D.O.B</strong>
              <span>30 May 1995</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Age</strong>
              <span>30</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Looking For</strong>
              <span>Groom</span>
            </p>
          </div>

          <div className="contact-bio">
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Religion</strong>
              <span>Hindu</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Caste</strong>
              <span>Mudaliyar</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Sub Caste</strong>
              <span>Mudaliyar</span>
            </p>
          </div>

          <div className="contact-bio">
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Place Of Birth</strong>
              <span>Coimbatore</span>
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
              <span>Murugan</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-60">Place of Kuladeivam</strong>
              <span>Palani</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-60">Gothram</strong>
              <span>Badri</span>
            </p>
          </div>
          <div className="border-color mt-3 mb-3 md:hidden"></div>

          <div className="contact-bio">
            <h2 className="profile-heading py-6">Education / Occupation</h2>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Education</strong>
              <span>BBA / MBA / Ph.D</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Profession</strong>
              <span>Software Engineer</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Employed In</strong>
              <span>IBD Soft Technologies</span>
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
              <span>Chandran</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Phone</strong>
              <span>12325 6955</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Religion</strong>
              <span>Hindu</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Occupation</strong>
              <span>Engineer</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Profession</strong>
              <span>SAS Engineer Works</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Place of work</strong>
              <span>Karala</span>
            </p>
          </div>

          <div className="contact-bio">
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Mother’s Name</strong>
              <span>Oviya</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Phone</strong>
              <span>98524 54688</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Religion</strong>
              <span>Hindu</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Occupation</strong>
              <span>House Wife</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Profession</strong>
              <span>SAS Engineer Works</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Place of work</strong>
              <span>Karala</span>
            </p>
          </div>
        </div>

        <div className="border-color mt-6 mb-6"></div>

        <div className="grid grid-cols-1 gap-4 mt-3">
          <h2 className="profile-heading py-6">Address</h2>
          <div className="contact-bio">
            <p>Street17, Sathyamangalam Road, Kurumbapalayam, Coimbatore North 641001, </p>
          </div>
        </div>

        <div className="border-color mt-6 mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {/* Partner Preference */}
          <div className="contact-bio">
            <h2 className="profile-heading py-6">Partner Preference</h2>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Education</strong>
              <span>BA, MBA, Ph.D</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Age</strong>
              <span>30</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Caste</strong>
              <span>Mudaliyar</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">SubCaste</strong>
              <span>Mudaliyar</span>
            </p>
          </div>

          <div className="border-color mt-3 mb-3 md:hidden"></div>

          {/* References */}
          <div className="contact-bio">
            <h2 className="profile-heading py-6">References</h2>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Name</strong>
              <span>Mahalakshmi</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Contact</strong>
              <span>9874561230</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Name</strong>
              <span>Rajasekaran</span>
            </p>
            <p className="flex gap-x-2 text-left">
              <strong className="w-auto md:w-40">Contact</strong>
              <span>9874563210</span>
            </p>
          </div>
        </div>

        {/*Additional Pictures */}

        <div className="border-color mt-6 mb-6"></div>

        <div className="grid grid-cols-1 gap-4 mt-3">
          <h2 className="profile-heading py-6">Additional Pictures</h2>
          <div className="contact-bio flex flex-col-4 gap-4">
            <p>
              <Image
                src="/images/member/profile/p1.png" // Change with your image path
                width={150}
                height={150}
                alt="Profile Picture"
                className="rounded-full border-4 border-white"
              />
            </p>
            <p>
              <Image
                src="/images/member/profile/p1.png" // Change with your image path
                width={150}
                height={150}
                alt="Profile Picture"
                className="rounded-full border-4 border-white"
              />
            </p>
            <p>
              <Image
                src="/images/member/profile/p1.png" // Change with your image path
                width={150}
                height={150}
                alt="Profile Picture"
                className="rounded-full border-4 border-white"
              />
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
