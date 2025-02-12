'use client';

import { useState } from 'react';
import { signOut } from "next-auth/react"; // Import signOut from next-auth
import Swal from 'sweetalert2'; // Import SweetAlert2
import { TriangleAlert } from "lucide-react";
import { IoPower } from 'react-icons/io5';
import { IoLogOut } from "react-icons/io5"; // Import logout icon

type ChangePasswordProps = {
  myId: string;
};

const ChangePassword: React.FC<ChangePasswordProps> = ({ myId }) => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState('password'); // State for active tab
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

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

    if (!password) return "Password cannot be empty.";

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

  const handleDeactivateAccount = async () => {
    const { value: reason } = await Swal.fire({
      title: "Are you sure?",
      text: "Once deactivated, you'll be logged out and can't log in until admin approval.",
      icon: "warning",
      input: "textarea",
      inputPlaceholder: "Enter the reason for deactivation...",
      inputAttributes: {
        required: "true",
      },
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate it!",
      cancelButtonText: "No, cancel",
      customClass: {
        confirmButton: "confirm-color", // Custom class for confirm button (green)
        cancelButton: "cancel-color",   // Custom class for cancel button (red)
      },
      preConfirm: (inputValue) => {
        if (!inputValue) {
          Swal.showValidationMessage("You must enter a reason for deactivation.");
        }
        return inputValue;
      },
    });
  
    if (reason) {
      setPending(true);
  
      const res = await fetch(`/api/update-user-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: myId,
          is_active: false,
          reason, // Send the reason to the backend
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setPending(false);
        Swal.fire({
          title: "Deactivated!",
          text: "Your account has been deactivated.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "confirm-color",
          },
        });
        signOut(); // Log out the user
      } else {
        setPending(false);
        Swal.fire("Error", data.message, "error");
      }
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setForm((prevData) => {
      const updatedForm = { ...prevData, [name]: value };
  
      // Validate password
      if (name === "password") {
        setPasswordError(validatePassword(value));
  
        // Also validate confirm password when changing password
        if (updatedForm.confirmPassword && updatedForm.confirmPassword !== value) {
          setConfirmPasswordError("Passwords do not match.");
        } else {
          setConfirmPasswordError(null);
        }
      }
  
      // Validate confirm password
      if (name === "confirmPassword") {
        setConfirmPasswordError(updatedForm.password !== value ? "Passwords do not match." : null);
      }
  
      return updatedForm;
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setSuccessMessage("");
  
    let valid = true;
  
    if (!form.password) {
      setPasswordError("Password cannot be empty.");
      valid = false;
    } else {
      setPasswordError(validatePassword(form.password));
    }
  
    if (!form.confirmPassword) {
      setConfirmPasswordError("Confirm Password cannot be empty.");
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    }
  
    if (!valid) {
      setPending(false);
      return;
    }
  
    try {
      const res = await fetch("/api/change-password-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setPasswordError(null);
        setConfirmPasswordError(null);
        setSuccessMessage("Your password has been updated successfully.");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      setError("Network error, please try again.");
    } finally {
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
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Password"
                          className={`w-full rounded-lg border ${passwordError ? "border-red-500" : "border-stroke"
                            } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}
                        />
                        {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Re-type Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          name="confirmPassword" // ✅ Ensure this matches state key
                          value={form.confirmPassword} // ✅ Ensure correct state binding
                          onChange={handleChange}
                          placeholder="Confirm Password"
                          className={`w-full rounded-lg border ${confirmPasswordError ? "border-red-500" : "border-stroke"
                            } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}
                        />
                        {confirmPasswordError && <p className="text-red-600 text-sm">{confirmPasswordError}</p>}
                      </div>
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
                    className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg border border-gray-600 bg-gray-600 text-white transition hover:bg-opacity-90"
                  >
                    <IoLogOut className="mr-2" /> Logout
                  </button>
                  <button
                    onClick={handleDeactivateAccount}
                    className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg border border-red-600 bg-red-600 text-white transition hover:bg-opacity-90 mt-5"
                  >
                    <IoPower className="mr-2" />Deactivate Account
                  </button>

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
