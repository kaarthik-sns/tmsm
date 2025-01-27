"use client";

import { useState, useEffect } from "react";
import Profile from "@/components/Frontend/Profile";
import ProfileUser from "@/components/Frontend/ProfileUser";
import { useSession } from "next-auth/react";


const RequestStatus = () => {

  const [activeTab, setActiveTab] = useState("profile");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);  // State to track edit mode
  const [loading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState([]);


  const { data: session } = useSession();
  const myId = session.user.id;
  // const myId =2;
  const receivedRequests = profiles.filter(profile => profile.receiver_id === myId);
  const sentRequests = profiles.filter(profile => profile.sender_id === myId);

  const filteredRequests = (activeTab === "received" ? receivedRequests : sentRequests).filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleEditProfile = () => {
    setIsEditMode(prev => !prev); // Toggle edit mode
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };


  useEffect(() => {
    if (myId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/get-user-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: myId }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }

          const { data } = await response.json();

          setProfileData(data);

        } catch (err) {
          console.error(err);
          // setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [myId]);




  return (
    <div className="bg-light min-h-screen flex justify-center py-10 px-4">
      <div className="container max-w-4xl p-6">
        <h1 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">My Account</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <div className="grid grid-cols-1 sm:flex sm:space-x-4 gap-2 w-full sm:w-auto">
            <button
              className={`px-4 py-2 rounded-full ${activeTab === "profile" ? "bg-dash-button-active" : "bg-dash-button"
                }`}
              onClick={() => setActiveTab("profile")}
            >
              My Profile
            </button>
            <button
              className={`px-4 py-2 rounded-full ${activeTab === "received" ? "bg-dash-button-active" : "bg-dash-button"
                }`}
              onClick={() => setActiveTab("received")}
            >
              Received Request
            </button>
            <button
              className={`px-4 py-2 rounded-full ${activeTab === "sent" ? "bg-dash-button-active" : "bg-dash-button"
                }`}
              onClick={() => setActiveTab("sent")}
            >
              Sent Request
            </button>
          </div>

          {activeTab !== "profile" && (
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brown w-full sm:w-auto"
              />
            </div>
          )}
        </div>


        <div className="mt-6 relative"> {/* Added relative class */}
          {activeTab === "profile" ? (
            <>
              {!isEditMode ? (
                <>
                  <Profile data={profileData}/>
                  <div className="absolute top-2 right-2 z-10 p-2"> {/* Positioned correctly */}
                    <label
                      htmlFor="cover"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded bg-edit px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80"
                      onClick={handleEditProfile}
                    >
                      <span>
                        <svg
                          className="fill-current"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="#653d27"  // Updated color
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.498 1.002a1 1 0 0 1 1.414 0l2.586 2.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1-.27.2l-4 2a1 1 0 0 1-1.265-1.265l2-4a1 1 0 0 1 .2-.27l6.586-6.586a1 1 0 0 1 0-1.414L11.498 1.002zm1.832 3.538l1.586 1.586-5.02 5.02-1.586-1.586 5.02-5.02z"
                          />
                        </svg>
                      </span>
                      <span>Edit Profile</span>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute top-2 right-2 z-10 p-2 mb-5"> {/* Positioned correctly */}
                    <label
                      htmlFor="cover"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded bg-edit px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80"
                      onClick={handleEditProfile}
                    >
                      <span>
                        <svg
                          className="fill-current"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="#653d27"  // Updated color
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.707 13.707a1 1 0 0 1-1.414 0L4.293 8.707a1 1 0 0 1 0-1.414l5-5a1 1 0 1 1 1.414 1.414L6.414 8l4.293 4.293a1 1 0 0 1 0 1.414z"
                          />
                        </svg>
                      </span>
                      <span>Back</span>
                    </label>
                  </div>

                  <ProfileUser />

                </>
              )}
            </>
          ) : (
            filteredRequests.length > 0 ? (
              filteredRequests.map(profile => (
                <ProfileCard key={profile.id} profile={profile} onViewProfile={handleViewProfile} />
              ))
            ) : (
              <p className="text-gray-500 text-center">No requests found</p>
            )
          )}
        </div>

      </div>

      {isModalOpen && selectedProfile && <ProfileModal profile={selectedProfile} onClose={handleCloseModal} />}
    </div>
  );
};

// Sample Data
const profiles = [
  {
    id: 1,
    receiver_id: 1,
    sender_id: 2,
    name: "Vijay Kumar",
    profession: "MBBS",
    age: 28,
    caste: "Mudaliyar",
    subCaste: "SubCaste",
    image: "/images/member/profile/p1.png",
  },
  {
    id: 2,
    receiver_id: 5,
    sender_id: 2,
    name: "Karthik Raj",
    profession: "Engineer",
    age: 28,
    caste: "Mudaliyar",
    subCaste: "SubCaste",
    image: "/images/member/profile/p1.png",
  },
  {
    id: 3,
    receiver_id: 2,
    sender_id: 5,
    name: "Arun Kumar",
    profession: "MBBS",
    age: 28,
    caste: "Mudaliyar",
    subCaste: "SubCaste",
    image: "/images/member/profile/p1.png",
  },
];

// Profile Card Component
const ProfileCard = ({ profile, onViewProfile }) => (
  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
    <img src={profile.image} alt={profile.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border cursor-pointer" onClick={() => onViewProfile(profile)} />
    <div className="flex-1 text-center sm:text-left">
      <h2 className="dash-heading mb-2">{profile.name}</h2>
      <p className="text-gray-600 text-sm">{profile.profession} | Age: {profile.age}</p>
      <p className="text-xs text-gray-700 md:block hidden">Caste: {profile.caste} | SubCaste: {profile.subCaste}</p>
    </div>
    <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">
      <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm accept">Accept</button>
      <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm decline">Decline</button>
      <button
        className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm view"
        onClick={() => onViewProfile(profile)}
      >
        Basic info
      </button>
    </div>
  </div>
);

// Profile Modal Component
const ProfileModal = ({ profile, onClose }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 px-4">
    <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm sm:max-w-md w-full relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 red-color "
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
      <div className="flex flex-col items-center text-center">
        <img src={profile.image} alt={profile.name} className="w-20 h-20 rounded-full border mb-4" />
        <h2 className="dash-heading">{profile.name}</h2>
        <p className="text-gray-600">{profile.profession}</p>
        <p className="text-gray-500 text-sm">Age: {profile.age}</p>
        <p className="text-gray-500 text-sm">Caste: {profile.caste} | SubCaste: {profile.subCaste}</p>
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start mt-5">
          <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm accept">Accept</button>
          <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm decline">Decline</button>
        </div>
      </div>
    </div>
  </div>
);

export default RequestStatus;
