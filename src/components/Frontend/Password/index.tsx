'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import React from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

const ChangePassword: React.FC = () => {

  const [remainingTime, setRemainingTime] = useState(10); // 5 seconds initially
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
    is_admin: false,
    token: token
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setSuccessMessage("");

    if (form.password == '' || form.confirmPassword == '') {
      setError("Please fill the password fileds");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const passwordError = validatePassword(form.password || "");

    if (passwordError) {
      setError(passwordError);
      setPending(false);
      return;
    }

    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {

      setPending(false);
      setSuccessMessage("Your password has been updated successfully.");
      setTimeout(() => {
        router.push("/frontend/login");
      }, 5000); // 5000ms = 5 seconds

    } else {
      setError(data.message);
      setPending(false);
    }
  };
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (successMessage) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timer as NodeJS.Timeout);  // Stop the timer
            router.push("/frontend/login");  // Redirect after countdown finishes
          }
          return prevTime - 1;
        });
      }, 1000); // 1000ms = 1 second
    }

    return () => {
      if (timer) clearInterval(timer); // Clean up the interval if the component unmounts or successMessage changes
    };
  }, [successMessage, router]);

  return (
    <>

      <div className="flex bg-[#fbeed5]">
        {/* Left Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <div className="flex items-center md:w-100">
            <div className="w-full p-4">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 heading-title">
                Change Password
              </h2>

              {/* Show login success message */}
              {successMessage && (
                <div className="bg-green-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600 mb-6">
                  <p>{successMessage} Redirecting to login in {remainingTime} seconds... </p>
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
                      required
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
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
                      required
                      placeholder="Re-enter your password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
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
        </div>

        {/* Right Section - Image with Overlay */}
        <div className="w-1/2 relative hidden md:block">
          <img
            src="/images/login/login.svg"
            alt="Couple"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
