'use client';

import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";

const SignIn: React.FC = () => {

  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const lang = localStorage.getItem('lang') || 'en';

  
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

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      lang,
      is_admin: true
    });

    if (res?.ok) {
      toast.success("Login Successful", {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        }
      });
      router.push("/admin/dashboard");
    } else if (res?.status === 401) {
      setError(res.error);
      setPending(false);
    } else {
      setError("Something went wrong");
    }
  };

  return (

    <div className="min-h-screen w-full flex items-center justify-center bg-color-custom dark:bg-boxdark">
      <div className="w-full max-w-[1000px] mx-4">
        <div className="rounded-lg overflow-hidden bg-white dark:bg-boxdark">
          <div className="grid grid-cols-1 xl:grid-cols-2">
            {/* Left side with logo */}
            <div className="p-8 sm:p-12 bg-[#fff5e5] dark:bg-boxdark flex items-center justify-center">
              <div className="text-center max-w-[400px]">
                <Link href="/" className="inline-block mb-8">
                  <Image
                    className="w-64 f-logo"
                    src={"/images/logo/logo-dark.svg"}
                    alt="Logo"
                    width={300}
                    height={100}
                    priority
                  />
                </Link>
              </div>
            </div>

            {/* Right side with form */}
            <div className="p-8 sm:p-12 flex items-center">
              <div className="w-full max-w-[360px] mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-8 dark-text">
                  Sign In to TMSM
                </h2>

                {!!error && (
                  <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                    <TriangleAlert className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled={pending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={`w-full h-12 px-4 rounded-lg border ${emailError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                          } bg-transparent text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 
                          focus:ring-primary/20 focus:border-primary transition-colors`}
                      />
                      {emailError && <p className="text-red-500 text-sm mt-1.5">{emailError}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        disabled={pending}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={`w-full h-12 px-4 rounded-lg border ${passwordError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                          } bg-transparent text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 
                          focus:ring-primary/20 focus:border-primary transition-colors`}
                      />
                      {passwordError && <p className="text-red-500 text-sm mt-1.5">{passwordError}</p>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full h-12 rounded-lg bg-[#ffd480] text-gray-900 font-medium text-base
                      hover:bg-[#ffc44d] focus:outline-none focus:ring-2 focus:ring-[#ffd480]/50 
                      transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {pending ? "Signing in..." : "Sign In"}
                  </button>

                  <div className="text-center">
                    <Link
                      href="/admin/forgot-password"
                      className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 
                        dark:hover:text-white font-medium transition-colors dark-text"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
