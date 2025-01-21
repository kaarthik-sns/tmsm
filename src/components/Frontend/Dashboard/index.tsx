"use client";

import { useState } from "react";

const RequestStatus = () => {
  const [activeTab, setActiveTab] = useState("received");
 
  return (
    <div className="bg-yellow-50 min-h-screen p-6">
      {/* Header Section */}
      <h1 className="text-xl font-semibold mb-4">Request Status</h1>

      {/* Tabs */}
      <div className="flex space-x-4">
        <button
          className={`px-6 py-2 rounded-full ${
            activeTab === "received" ? "bg-yellow-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Received
        </button>
        <button
          className={`px-6 py-2 rounded-full ${
            activeTab === "sent" ? "bg-yellow-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </button>
      </div>

      {/* Content based on Active Tab */}
      <div className="mt-6">
        {activeTab === "received" ? <ReceivedRequests /> : <SentRequests />}
      </div>
    </div>
  );
};

// Sample Data for Received and Sent Requests
const profiles = [
  {
    id: 1,
    name: "Vijay Kumar",
    profession: "MBBS",
    age: 28,
    religion: "Hindu",
    caste: "Caste",
    subCaste: "SubCaste",
    image: "/images/member/profile/p1.png",
  },
  {
    id: 2,
    name: "Karthik Raj",
    profession: "Engineer",
    age: 28,
    religion: "Hindu",
    caste: "Caste",
    subCaste: "SubCaste",
    image: "/images/member/profile/p2.png",
  },
];

// Received Requests Component
const ReceivedRequests = () => (
  <div>
    {profiles.map((profile) => (
      <ProfileCard key={profile.id} profile={profile} />
    ))}
  </div>
);

// Sent Requests Component
const SentRequests = () => (
  <div>
    {profiles.map((profile) => (
      <ProfileCard key={profile.id} profile={profile} />
    ))}
  </div>
);

// Profile Card Component
const ProfileCard = ({ profile }) => (
  <div className="bg-white rounded-lg p-6 shadow-md flex items-center space-x-4 mb-4">
    <img
      src={profile.image}
      alt={profile.name}
      className="w-16 h-16 rounded-full border"
    />
    <div className="flex-1">
      <h2 className="text-lg font-semibold text-brown-700">{profile.name}</h2>
      <p className="text-gray-500">{profile.profession}</p>
      <p className="text-sm text-gray-700">
        Age: {profile.age} | Religion: {profile.religion}
      </p>
      <p className="text-sm text-gray-700">
        Caste: {profile.caste} | SubCaste: {profile.subCaste}
      </p>
    </div>
    <div className="flex flex-col space-y-2">
      <button className="bg-yellow-400 text-white px-4 py-2 rounded">Accept</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded">Decline</button>
      <button className="border px-4 py-2 rounded">View Profile</button>
    </div>
  </div>
);

export default RequestStatus;
