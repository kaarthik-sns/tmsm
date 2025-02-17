"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

const SignIn: React.FC = () => {

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");


  // Validation states
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setEmailError("");
    setPasswordError("");
    setError("");

    // Validate fields
    let valid = true;

    if (!email) {
      setEmailError("Email cannot be empty.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password cannot be empty");
      valid = false;
    }

    if (!valid) return;

    setPending(true);
    setSuccessMessage("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      is_admin: false,
    });

    if (res?.ok) {
      setSuccessMessage("Login Successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else if (res?.error) {
      setError(res.error);
      setPending(false);
    } else {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex bg-[#fbeed5]">
      {/* Left Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
        <div className="flex items-center md:w-100">
          <div className="w-full p-4">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 heading-title">
              Login
            </h2>

            {/* Show login success message */}
            {successMessage && (
              <div className="bg-green-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600 mb-6">
                <p>{successMessage}</p>
              </div>
            )}

            {/* Show error message if login fails */}
            {!!error && (
              <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                <TriangleAlert />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="email"
                    disabled={pending}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail id"
                    className={`w-full rounded-lg border ${emailError ? "border-red-500" : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    autoComplete="off"
                  />
                </div>
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    disabled={pending}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    className={`w-full rounded-lg border ${passwordError ? "border-red-500" : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    autoComplete="off"
                  />
                </div>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>

              <div className="mb-6 text-right">
                <p>
                  <Link href="/forgot-password" className="text-dark">
                    Forgot Password?{" "}
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <div className="mb-5">
                <input
                  type="submit"
                  value="Login"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 text-button"
                />
              </div>

              <div className="mt-6 text-left">
                <p>
                  Don’t have an account?{" "}
                  <Link href="/register" className="dark-terms" >
                    Sign Up
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
  );
};

export default SignIn;
