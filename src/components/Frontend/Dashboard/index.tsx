"use client";

import { useState } from "react";

const RequestStatus = () => {
  const [activeTab, setActiveTab] = useState("received");
  const myId = 2;
  const [selectedProfile, setSelectedProfile] = useState(null); // State for selected profile
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  // Filter received and sent requests
  const receivedRequests = profiles.filter(profile => profile.receiver_id === myId);
  const sentRequests = profiles.filter(profile => profile.sender_id === myId);

  // Filter profiles based on search query
  const filteredRequests = (activeTab === "received" ? receivedRequests : sentRequests).filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to open modal
  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  return (
    <div className="bg-light min-h-screen flex justify-center py-10 px-4">
      <div className="container max-w-4xl p-6">
        {/* Header Section */}
        <h1 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Request Status</h1>

        {/* Tabs Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 sm:space-x-4">
            <button className={`px-4 py-2 rounded-full ${activeTab === "received" ? "bg-dash-button-active" : "bg-dash-button"}`} onClick={() => setActiveTab("received")}>Received</button>
            <button className={`px-4 py-2 rounded-full ${activeTab === "sent" ? "bg-dash-button-active" : "bg-dash-button"}`} onClick={() => setActiveTab("sent")}>Sent</button>
          </div>

          {/* Search Filter with Alignment */}
          <div className="flex items-center space-x-2">
            {/* Search Input (below buttons on mobile) */}
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brown w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(profile => <ProfileCard key={profile.id} profile={profile} onViewProfile={handleViewProfile} />)
          ) : (
            <p className="text-gray-500 text-center">No requests found</p>
          )}
        </div>
      </div>

      {/* Profile Modal */}
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

// Request List Component
const RequestList = ({ requests, onViewProfile }) => (
  <div>
    {requests.length > 0 ? (
      requests.map(profile => <ProfileCard key={profile.id} profile={profile} onViewProfile={onViewProfile} />)
    ) : (
      <p className="text-gray-500 text-center">No requests found</p>
    )}
  </div>
);

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
