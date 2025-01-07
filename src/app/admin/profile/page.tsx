'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import React from "react";

const Profile = () => {

  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [changePassword, setchangePassword] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return; // Ensure session and user ID exist
      try {
        const res = await fetch("/api/get-user-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: session.user.id, is_admin: true }),
        });


        if (res.ok) {
          const data = await res.json();
          setName(data.data.name);
          setEmail(data.data.email);
          setPreview(data.data.image);

          console.log(data.data.image);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (changePassword && (password == '' || password == '')) {
      setError("Please fill the password fileds");
      return;
    }

    if (changePassword && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Ask for confirmation before submitting
    const confirmed = window.confirm("Are you sure you want to update your profile?");
    if (!confirmed) {
      return; // Stop submission if user cancels
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("id", session.user.id);

    if (profilePic) formData.append("profilePic", profilePic);
    if (password) formData.append("password", password);

    console.log(formData);

    try {
      const response = await fetch("/api/update-admin", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success('Profile updated successfully!', {
          cancel: {
            label: 'Close',
            onClick: () => console.log('Close'),
          },
        });
      } else {
        toast.error('Failed to update profile', {
          cancel: {
            label: 'Close',
            onClick: () => console.log('Close'),
          },
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile', {
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto">
        <Breadcrumb pageName="Profile" />

        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="max-w-xl mx-auto mt-10 mb-10 p-6 ">
            {!!error && (
              <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                <TriangleAlert />
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                    {preview && (
                      <Image
                        src={preview}
                        alt="Profile Preview"
                        width={64}
                        height={64}
                        quality={100}
                        unoptimized={true}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                />
              </div>

              <CheckboxTwo
                changePassword={changePassword}
                setchangePassword={setchangePassword}
                label="Change Password"
              />

              {changePassword && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2  dark-text">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    />
                  </div>
                </>
              )}

              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 text-custom"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>

  );
};

export default Profile;