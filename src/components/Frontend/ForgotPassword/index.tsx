"use client";

import React, { useState, useEffect } from "react";
import AuthLayout from '@/components/Layouts/AuthLayout';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const [form, setForm] = useState({
    email: "",
    is_admin: false
  });
  const [remainingTime, setRemainingTime] = useState(10); // 5 seconds initially
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      const res = await fetch("/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setSuccessMessage(""); // Clear previous success message

      if (res.ok) {
        setPending(false);
        setSuccessMessage("Your password reset request was successful. Please check your email.");
      } else {
        setError(data.message);
        setPending(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
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
        {/* Left Section - Forgot Password Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <div className="flex items-center md:w-100">
            <div className="w-full p-4">
              <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 heading-title">
                Forgot Password
              </h2>

              {/* Show success message */}
              {successMessage && (
                <div className="bg-green-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600 mb-6">
                  <p>{successMessage} Redirecting to login in {remainingTime} seconds... </p>
                </div>
              )}

              {/* Show error message */}
              {!!error && (
                <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                  <TriangleAlert />
                  <p>{error}</p>
                </div>
              )}

              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled={pending}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-strokes bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
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
                    value="Request reset password link"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 text-custom"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p>
                    <Link href="/frontend/login" className="text-primary dark-text">
                      Back to Sign in
                    </Link>
                  </p>
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

export default ForgotPassword;
