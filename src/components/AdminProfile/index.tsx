'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import React from "react";


const AdminProfile = () => {

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
          setPreview(data?.data?.image ? `/api${data.data.image}` : '');

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

  const validatePassword = (password: string): string | null => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 6 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    return null; // Valid password
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (changePassword) {
      if (password == '' || confirmPassword == '') {
        setError("Please fill the password fileds");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
      }

      const passwordError = validatePassword(password || "");

      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("id", session.user.id);


    if (!name) {
      setError(`Name can't be empty`)
      return
    }

    if (!email) {
      setError(`Email can't be empty`)
      return
    }


    if (profilePic) formData.append("profilePic", profilePic);
    if (password) formData.append("password", password);


    try {
      const response = await fetch("/api/update-admin", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success('Profile updated successfully!', {
          className: "sonner-toast-success",
          cancel: {
            label: 'Close',
            onClick: () => console.log('Close'),
          },
        });
        // Delay the page reload to allow the user to see the success message
        setTimeout(() => {
          window.location.reload();
        }, 1000); // Adjust the delay (in milliseconds) as needed
      } else {
        toast.error('Failed to update profile', {
          className: "sonner-toast-error",
          cancel: {
            label: 'Close',
            onClick: () => console.log('Close'),
          },
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile', {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
    }
  };

  return (
    <>
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
                  <div className="flex-shrink-0 w-26 h-26 rounded-full overflow-hidden bg-gray-200">
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
                  <div
                    className="relative w-full flex-1 cursor-pointer rounded-lg border border-dashed border-gray-400 bg-gray-100 px-6 py-5 text-center transition-all hover:border-primary hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      name="profilePic"
                      className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm dark:bg-gray-800">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium dark-text">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-gray-500">(SVG, PNG, JPG, JPEG, WebP)</p>
                    </div>
                  </div>

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
    </>
  );
};

export default AdminProfile;