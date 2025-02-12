'use client';

import { useState } from 'react';
import { signOut } from "next-auth/react"; // Import signOut from next-auth
import Swal from 'sweetalert2'; // Import SweetAlert2
import { TriangleAlert } from "lucide-react";
import { IoPower } from 'react-icons/io5';
import { IoLogOut } from "react-icons/io5"; // Import logout icon
import DeactivateModal from "@/components/Frontend/Modal/DeactivateModal"

type ChangePasswordProps = {
  myId: string;
};

const ChangePassword: React.FC<ChangePasswordProps> = ({ myId }) => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState('password'); // State for active tab
  const [passwordError, setPasswordError] = useState<string>("");
  const [ConPasswordError, setConPasswordError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
    id: myId,
    is_admin: "false",
  });

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

  const handleDeactivateAccount = async (reason: string) => {

    setPending(true);

    const res = await fetch(`/api/update-user-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: myId,
        is_active: false,
        reason
      }),
    })

    const data = await res.json();

    setIsModalOpen(false);

    if (res.ok) {
      setPending(false);
      Swal.fire({
        title: 'Deactivated!',
        text: 'Deactivated, Your account has been deactivated',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'confirm-color',  // Custom class for confirm button (green)
        },
      });
      signOut(); // Log out the user
    } else {
      setPending(false);
      Swal.fire('Error', data.message, 'error');
    }

  };

  const handleDeactivatePopup = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setSuccessMessage("");


    if (form.password == '') {
      setPasswordError("Password cannot be empty.");
      setPending(false);
      return;
    }

    if (form.confirmPassword == '') {
      setConPasswordError("Confirm Password cannot be empty.");
      setPending(false);
      return;
    }


    if (form.password !== form.confirmPassword) {
      setConPasswordError("Passwords do not match.");
      setPending(false);
      return;
    }

    setPending(true);
    setPasswordError('');
    setConPasswordError('');
    const passwordError = validatePassword(form.password || "");

    if (passwordError) {
      setError(passwordError);
      setPending(false);
      return;
    }

    const res = await fetch("/api/change-password-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setError('');
      setPending(false);
      setSuccessMessage("Your password has been updated successfully.");
    } else {
      setError(data.message);
      setPending(false);
    }
  };

  return (
    <>
      <div className="flex">

        <div className="w-full flex flex-col justify-center items-center p-6 md:p-2">
          <div className="flex flex-col w-full">

            {/* Tab buttons */}
            <div className="grid grid-cols-1 sm:flex sm:space-x-4 gap-2 w-full sm:w-auto">
              <button
                className={`px-3 py-1 text-sm rounded-full ${activeTab === 'password' ? 'active-setting' : 'setting'}`}
                onClick={() => setActiveTab('password')}
              >
                Change Password
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${activeTab === 'account' ? 'active-setting' : 'setting'}`}
                onClick={() => setActiveTab('account')}
              >
                Account
              </button>
            </div>


            {/* Tab Content */}
            {activeTab === 'password' ? (
              <div className="w-full">
                {/* Password Form */}
                <div className="w-full md:w-1/2 p-4">
                  {successMessage && (
                    <div className="bg-green-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600 mb-6">
                      <p>{successMessage}</p>
                    </div>
                  )}

                  {!!error && (
                    <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                      <TriangleAlert />
                      <p>{error}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          disabled={pending}
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          placeholder="Enter your password"
                          className={`w-full rounded-lg border ${passwordError ? "border-red-500" : "border-stroke"
                            } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                          autoComplete="off"
                        />
                      </div>
                      {passwordError && (
                        <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Re-type Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          disabled={pending}
                          value={form.confirmPassword}
                          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                          placeholder="Re-enter your password"
                          className={`w-full rounded-lg border ${ConPasswordError ? "border-red-500" : "border-stroke"
                            } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                          autoComplete="off"
                        />
                      </div>
                      {ConPasswordError && (
                        <p className="text-red-500 text-sm mt-1">{ConPasswordError}</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <input
                        type="submit"
                        value="Change Password"
                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 text-custom"
                      />
                    </div>
                  </form>
                </div>

              </div>
            ) : (
              <div className="w-full flex justify-center md:justify-start p-4">
                {/* Account Deactivation */}
                <div className="w-full md:w-1/2 p-4 ">
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: 'Are you sure?',
                        text: 'Do you want to logout?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, logout',
                        cancelButtonText: 'No, cancel',
                        customClass: {
                          confirmButton: 'confirm-color',  // Custom class for confirm button (green)
                          cancelButton: 'cancel-color'       // Custom class for cancel button (red)
                        },
                      });

                      if (result.isConfirmed) {
                        signOut(); // Proceed with sign-out if confirmed
                      }
                    }}
                    className="flex items-center space-x-2 mb-2 px-3 py-2 text-sm rounded-lg border border-gray-600 bg-gray-600 text-white transition hover:bg-opacity-90"
                  >
                    <IoLogOut className="mr-2" /> Logout
                  </button>
                  <button
                    onClick={handleDeactivatePopup}
                    className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg border border-red-600 bg-red-600 text-white transition hover:bg-opacity-90"
                  >
                    <IoPower className="mr-2" /> Deactivate Account
                  </button>

                  <DeactivateModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleDeactivateAccount}
                  />

                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default ChangePassword;
