'use client';

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";

const SignIn: React.FC = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setPending(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      is_admin: false
    });

    if (res?.ok) {

      toast.success('Login successful!', {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });

      router.push("/frontend");
    } else if (res?.error) {
      setError(res.error);
      setPending(false);
    } else {
      setError("Something went wrong");
    }

  };

  return (

   <div className="flex h-screen bg-[#fbeed5]">
      {/* Left Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
      <div className="flex items-center w-100">
            <div className="w-full p-4">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In
              </h2>
              {!!error && (
                <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                  <TriangleAlert />
                  <p>{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="email"
                      disabled={pending}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="E-mail id"
                      className="w-full border-b border-gray-500 bg-transparent py-2 focus:outline-none"
                      autoComplete="off"
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

                <div className="mb-6">
                  <div className="relative">
                    <input
                      disabled={pending}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      type="password"
                      placeholder="Password"
                      className="w-full border-b border-gray-500 bg-transparent py-2 focus:outline-none"
                      autoComplete="off"

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
                <div className="mb-6 text-right">
                  <p>
                    <Link href="/forgot-password" className="text-dark">
                      Forgot Password?{" "}
                    </Link>
                  </p>
                </div>
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
                    <Link href="/frontend/register" className="text-dark hover:text-dark">
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
