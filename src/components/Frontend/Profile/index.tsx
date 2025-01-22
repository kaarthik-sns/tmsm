'use client';

import React from "react";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

export default function Profile() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="profilecolor text-white py-8">
        <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start">

          {/* Left Side: Profile Info */}
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
            <Image
              src="/images/member/profile/p1.png" // Change with your image path
              width={200}
              height={200}
              alt="Profile Picture"
              className="rounded-full border-4 border-white"
            />
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
        <div className="flex items-center gap-3 text-green-600">
          <FaCheckCircle /> <span>Email: Verified</span>
          <FaCheckCircle /> <span>Identity: Verified</span>
        </div>

        {/* Personal Information */}
        <h2 className="profile-heading py-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          <div className="contact-bio">
            <p><strong className="inline-block w-40">D.O.B</strong> 30 May 1995</p>
            <p><strong className="inline-block w-40">Age</strong> 30</p>
            <p><strong className="inline-block w-40">Looking For</strong> Bride</p>
          </div>

          <div className="contact-bio">
            <p><strong className="inline-block w-40">Religion</strong> Hindu</p>
            <p><strong className="inline-block w-40">Caste</strong> Mudaliyar</p>
            <p><strong className="inline-block w-40">Sub Caste</strong> Mudaliyar</p>
          </div>

          <div className="contact-bio">
            <p><strong className="inline-block w-40">Place Of Birth</strong> Coimbatore</p>
          </div>
        </div>

        <div className="border-color mt-6 mb-6"></div>

        {/* Education & Occupation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="contact-bio">
            <h2 className="profile-heading py-6">Education / Occupation</h2>
            <p><strong className="inline-block w-40">Education</strong> BBA / MBA / Ph.D</p>
            <p><strong className="inline-block w-40">Profession</strong> Software Engineer</p>
            <p><strong className="inline-block w-40">Employed In</strong> IBD Soft Technologies</p>
          </div>
          <div className="contact-bio">
            <h2 className="profile-heading py-6">Other Personal Information</h2>
            <p><strong className="inline-block w-60">Kuladeivam</strong> Murugan</p>
            <p><strong className="inline-block w-60">Place of Kuladeivam temple</strong> Palani</p>
            <p><strong className="inline-block w-60">Gothram</strong> Badri</p>
          </div>
        </div>

        <div className="border-color mt-6 mb-6"></div>

        {/* Parent Details */}
        <h2 className="profile-heading py-6">Parents Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="contact-bio">
            <p><strong className="inline-block w-40">Father’s Name</strong> Chandran</p>
            <p><strong className="inline-block w-40">Father’s Phone</strong> 12325 6955</p>
            <p><strong className="inline-block w-40">Father’s Religion</strong> Hindu</p>
            <p><strong className="inline-block w-40">Father’s Occupation</strong> Engineer</p>
            <p><strong className="inline-block w-40">Father’s Profession</strong> SAS Engineer Works</p>
            <p><strong className="inline-block w-40">Place of work</strong> Karala</p>
          </div>
          <div className="contact-bio">
            <p><strong className="inline-block w-40">Mother’s Name</strong> Thilagavathi</p>
            <p><strong className="inline-block w-40">Mother’s Phone</strong> 98524 54688</p>
            <p><strong className="inline-block w-40">Mother’s Religion</strong> Hindu</p>
            <p><strong className="inline-block w-40">Mother’s Occupation</strong> House Wife</p>
            <p><strong className="inline-block w-40">Mother’s Profession</strong> SAS Engineer Works</p>
            <p><strong className="inline-block w-40">Place of work</strong> Karala</p>
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
            <p><strong className="inline-block w-40">Education</strong>  BA, MBA, Ph.D</p>
            <p><strong className="inline-block w-40">Age</strong> 30</p>
            <p><strong className="inline-block w-40">Caste</strong> Mudaliyar</p>
            <p><strong className="inline-block w-40">SubCaste</strong> Mudaliyar</p>
          </div>
          {/* References */}
          <div className="contact-bio">
            <h2 className="profile-heading py-6">References</h2>
            <p><strong className="inline-block w-40">Name</strong> Mahalakshmi</p>
            <p><strong className="inline-block w-40">Contact</strong> 9874561230</p>
            <p><strong className="inline-block w-40">Name</strong> rajasekaran</p>
            <p><strong className="inline-block w-40">Contact</strong> 9874563210</p>
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
