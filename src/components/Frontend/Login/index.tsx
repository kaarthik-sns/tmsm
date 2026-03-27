"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import Image from "next/image";

const SignIn: React.FC = () => {

  const router = useRouter();

  const [loginId, setLoginId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");


  // Validation states
  const [loginIdError, setLoginIdError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const lang = localStorage.getItem('lang') || 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setLoginIdError("");
    setPasswordError("");
    setError("");

    // Validate fields
    let valid = true;

    if (!loginId) {
      setLoginIdError(lang == 'ta' ? "மின்னஞ்சல் அல்லது தொலைபேசி எண் கட்டாயம்" : "Email or Phone Number cannot be empty.");
      valid = false;
    }

    if (!password) {
      setPasswordError(lang == 'ta' ? "கடவுச்சொல் கட்டாயம்" : "Password cannot be empty");
      valid = false;
    }

    if (!valid) return;

    setPending(true);
    setSuccessMessage("");

    const res = await signIn("credentials", {
      redirect: false,
      email: loginId,
      password,
      is_admin: false,
      lang
    });

    if (res?.ok) {
      setSuccessMessage(lang == 'ta' ? "உள்நுழைவு சரி! உங்கள் கணக்குக்கு செல்லலாம்..." : "Login Successful! Redirecting...");
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
    <div className="flex flex-col justify-center lg:flex-row lg:justify-start md:min-h-40vh bg-[#fbeed5] register">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10">
        <div className="flex items-center w-full md:w-1/2 sm:max-w-md lg:max-w-lg xl:max-w-xl">
          <div className="w-full p-2 sm:p-4">
            <h2 className="mb-6 sm:mb-9 text-2xl sm:text-3xl font-bold text-black dark:text-white lg:text-title-xl2 heading-title text-center sm:text-left">
              {lang == 'ta' ? 'உள்நுழை' : 'Login'}
            </h2>

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
              {/* Login Identifier Input */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    disabled={pending}
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder={lang == 'ta' ? 'மின்னஞ்சல் அல்லது தொலைபேசி எண்' : 'E-mail id or Phone Number'}

                    className={`w-full rounded-lg border ${loginIdError ? "border-red-500" : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    autoComplete="username"
                  />
                </div>
                {loginIdError && <p className="text-red-500 text-sm mt-1">{loginIdError}</p>}
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    disabled={pending}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder={lang == 'ta' ? 'கடவுச்சொல் உள்ளிடவும்' : 'Password'}
                    className={`w-full rounded-lg border ${passwordError ? "border-red-500" : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    autoComplete="new-password"
                  />
                </div>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>

              <div className="mb-6 text-right">
                <p>
                  <Link href="/forgot-password" className="text-dark">
                    {lang == 'ta' ? 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?' : 'Forgot Password?'}{" "}
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <div className="mb-5">
                <input
                  type="submit"
                  value={lang == 'ta' ? 'உள்நுழை' : 'Login'}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 text-button"
                />
              </div>

              <div className="mt-6 text-left">
                <p>
                  {lang == 'ta' ? 'கணக்கு இல்லையா?' : 'Don’t have an account?'}{" "}
                  <Link href="/register" className="dark-terms">
                    {lang == 'ta' ? 'புதிய கணக்கு உருவாக்கவும்.' : 'Sign Up'}
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>


      {/* Right Section - Image with Overlay */}
      <div className="w-full lg:w-1/2 relative hidden lg:block">
        <Image
          width={100}
          height={100}
          src="/images/login/login.svg"
          alt="Couple"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
};

export default SignIn;
