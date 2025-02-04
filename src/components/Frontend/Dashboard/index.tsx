"use client";

import { useState, useEffect } from "react";
import Profile from "@/components/Frontend/Profile";
import ProfileUser from "@/components/Frontend/ProfileUser";
import Settings from "@/components/Frontend/Profile/settings";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'; // Import SweetAlert2


const RequestStatus = () => {
  const { data: session } = useSession();
  const myId = session?.user.id;
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);  // State to track edit mode
  const [loading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [sentRequests, setSentReqData] = useState([]);
  const [receivedRequests, setRecivedReqData] = useState([]);
  const router = useRouter();



  const filteredRequests = (activeTab === "received" ? receivedRequests : sentRequests).filter(profile =>
    profile.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleEditProfile = () => {
    setIsEditMode(prev => !prev); // Toggle edit mode
  };

  // Move fetchUserData outside to be reusable
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

  // Run fetchUserData when exiting edit mode
  useEffect(() => {
    if (!isEditMode) {
      fetchUserData();
    }
  }, [isEditMode]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  // Fetch user data when `myId` changes
  useEffect(() => {
    if (myId) {
      fetchUserData();
      fetchReqData(myId);
    }
  }, [myId]);



  const fetchReqData = async (myId) => {
    try {

      const response2 = await fetch("/api/requests/profile-req-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: myId }),
      });

      if (!response2.ok) {
        throw new Error("Failed to fetch user data.");
      }

      const { SentRequestsData, RecivedRequestsData } = await response2.json();

      setSentReqData(SentRequestsData);
      setRecivedReqData(RecivedRequestsData);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequest = async (id: string, newStatus: string) => {
    if (!id || !newStatus) return;

    // Set different messages based on status
    let confirmationMessage = "";
    let successMessage = "";
    let confirmButtonText = "";

    switch (newStatus) {
      case "accepted":
        confirmationMessage = "Do you want to accept this request?";
        successMessage = "Request accepted successfully.";
        confirmButtonText = "Yes, Accept";
        break;
      case "rejected":
        confirmationMessage = "Do you want to decline this request?";
        successMessage = "Request has been declined.";
        confirmButtonText = "Yes, Decline";
        break;
      case "cancel":
        confirmationMessage = "Do you want to cancel this request?";
        successMessage = "Request has been cancelled.";
        confirmButtonText = "Yes, Cancel";
        break;
      default:
        return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: confirmationMessage,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: "No",
      customClass: {
        confirmButton: 'confirm-color',  // Custom class for confirm button (green)
        cancelButton: 'cancel-color'       // Custom class for cancel button (red)
      },

    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/requests/update-request-status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, status: newStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to update status");
        }

        fetchReqData(myId);

        await Swal.fire({
          title: "Success!",
          text: successMessage,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: 'confirm-color',  // Custom class for confirm button (green)
          },
        });

      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text: "Failed to update request status. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: 'confirm-color',  // Custom class for confirm button (green)
          },
        });
        console.error("Error updating status:", error);
      }
    } else {
      console.log("Request update was cancelled.");
    }
  };



  const redirectProfile = (id: string) => {
    if (id) {
      router.push(`/view-profile?id=${id}`); // Call the server-side redirect handler
    }
  };


  return (
    <div className="bg-light min-h-screen flex justify-center py-10 px-4">
      <div className="container max-w-4xl p-6">
        <h1 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">My Account</h1>

        {/* Tabs Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
          <div className="grid grid-cols-1 sm:flex sm:space-x-4 gap-2 w-full sm:w-auto">
            <button
              className={`px-4 py-2 rounded-full ${activeTab === "profile" ? "bg-dash-button-active" : "bg-dash-button"}`}
              onClick={() => {
                setActiveTab("profile");
                setIsEditMode(false); // Reset edit mode when switching to profile
              }}
            >
              My Profile
            </button>
            <button
              className={`px-4 py-2 rounded-full ${activeTab === "received" ? "bg-dash-button-active" : "bg-dash-button"}`}
              onClick={() => setActiveTab("received")}
            >
              Received Request
            </button>
            <button
              className={`px-4 py-2 rounded-full ${activeTab === "sent" ? "bg-dash-button-active" : "bg-dash-button"}`}
              onClick={() => setActiveTab("sent")}
            >
              Sent Request
            </button>
            <button
              className={`px-4 py-2 rounded-full ${activeTab === "settings" ? "bg-dash-button-active" : "bg-dash-button"}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {/* Search Input (Visible in non-profile tabs non-settings tabs) */}
          {activeTab !== "profile" && activeTab !== "settings" && (
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

        {/* Tab Content */}
        <div className="mt-6 relative">
          {activeTab === "profile" ? (
            !isEditMode ? (
              <>
                <Profile data={profileData} />
                <div className="absolute top-2 right-2 z-10 p-2">
                  <label
                    htmlFor="cover"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded bg-edit px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80"
                    onClick={handleEditProfile}
                  >
                    <span>Edit Profile</span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="absolute top-2 right-2 z-10 p-2 mb-5">
                  <label
                    htmlFor="cover"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded bg-edit px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80"
                    onClick={handleEditProfile}
                  >
                    <span>Back</span>
                  </label>
                </div>
                <ProfileUser userId={myId} />
              </>
            )
          ) : activeTab === "settings" ? (
            <Settings myId={myId} />
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                activeTab={activeTab}
                onViewProfile={handleViewProfile}
                onHandleRequest={handleRequest}
                onRedirectProfile={redirectProfile}
              />
            ))
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


// Profile Card Component
const ProfileCard = ({ profile, activeTab, onViewProfile, onHandleRequest, onRedirectProfile }) => (

  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
    <img src={profile.user.profile_photo} alt={profile.user.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border cursor-pointer" onClick={() => onViewProfile(profile)} />
    <div className="flex-1 text-center sm:text-left">
      <h2 className="dash-heading mb-2">{profile.user.name}</h2>
      <p className="text-gray-600 text-sm">{profile.user.profession} | Age: {profile.user.age}</p>
      <p className="text-xs text-gray-700 md:block hidden">Caste: {profile.user.caste} | SubCaste: {profile.user.subcaste}</p>
    </div>
    <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">

      {
        (activeTab === "received" && profile.status === "pending") ? (
          <>
            <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm accept" onClick={() => onHandleRequest(profile._id, 'accepted')}>Accept</button>
            <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm decline" onClick={() => onHandleRequest(profile._id, 'rejected')}>Decline</button>
          </>
        ) : profile.status === "accepted" ? (
          <>
            <button className="px-3 py-1 sm:px-4 sm:py-2 bg-green-500 rounded-full text-xs sm:text-sm accepted" >Accepted</button>
          </>
        ) : profile.status === "rejected" ? (
          <>
            <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm decline" >Declined</button>
          </>
        ) : (activeTab !== "received" && profile.status === "pending") ? (
          <>
            <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm decline" onClick={() => onHandleRequest(profile._id, 'cancel')}>Cancel</button>
          </>
        ) : null

      }

      {
        profile.status === "accepted" ? (
          <button
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm view"
            onClick={() => onRedirectProfile(profile.user._id)}
          >
            View Profile
          </button>
        ) : (
          <button
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm view"
            onClick={() => onViewProfile(profile)}
          >
            Basic info
          </button>
        )
      }

    </div>
  </div>

);

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
        <img src={profile.user.profile_photo} alt={profile.user.name} className="w-20 h-20 rounded-full border mb-4" />
        <h2 className="dash-heading">{profile.user.name}</h2>
        <p className="text-gray-600">{profile.user.profession}</p>
        <p className="text-gray-500 text-sm">Age: {profile.user.age}</p>
        <p className="text-gray-500 text-sm">Caste: {profile.user.caste} | SubCaste: {profile.user.subcaste}</p>
        {/* <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start mt-5">
          <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm accept">Accept</button>
          <button className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm decline">Decline</button>
        </div> */}
      </div>
    </div>
  </div>
);


export default RequestStatus;
