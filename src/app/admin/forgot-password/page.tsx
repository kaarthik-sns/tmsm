"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import AuthLayout from '@/components/Layouts/AuthLayout';
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

const ForgotPassword: React.FC = () => {

  const [form, setForm] = useState({
    email: "",
    is_admin: true
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setEmailError("");
    setError("");

    if (!form.email) {
      setEmailError(isTamil ? "மின்னஞ்சல் காலியாக இருக்க முடியாது." : "Email cannot be empty.");
      return;
    }

    setPending(true);

    const res = await fetch("/api/forgot-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setPending(false);

    if (res.ok) {
      toast.success(data.message, {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
      router.push("/admin/auth/signin");
    } else {
      setError(data.message);
      toast.error(data.message, {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
    }
  };

  const lang = localStorage.getItem('lang') || 'en';
  const isTamil = lang === 'ta';

  return (
    <AuthLayout>
      <div className="min-h-screen w-full flex items-center justify-center  bg-color-custom dark:bg-boxdark forgot-password-section">
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4 dark-text">
                    {isTamil ? "கடவுச்சொல்லை மறந்துவிட்டீர்களா" : "Forgot Password"}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 text-base mb-8">
                    {isTamil
                      ? "உங்கள் கடவுச்சொல்லை மீட்டமைக்க விரும்பும் மின்னஞ்சல் முகவரியை உள்ளிடவும்"
                      : "Please enter the email address you'd like your password reset information sent to"}
                  </p>

                  {!!error && (
                    <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                      <TriangleAlert className="w-5 h-5 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {isTamil ? "மின்னஞ்சல் முகவரி" : "Email"}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled={pending}
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder={isTamil ? "உங்கள் மின்னஞ்சலை உள்ளிடவும்" : "Enter your email"}
                          className={`w-full h-12 px-4 rounded-lg border ${emailError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                            } bg-transparent text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
                        />
                        {emailError && <p className="text-red-500 text-sm mt-1.5">{emailError}</p>}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={pending}
                      className="w-full h-12 rounded-lg bg-[#ffd480] text-gray-900 font-medium text-base hover:bg-[#ffc44d] focus:outline-none focus:ring-2 focus:ring-[#ffd480]/50  transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {pending
                        ? isTamil ? "அனுப்புகிறது..." : "Sending..."
                        : isTamil ? "மீட்டமைக்கும் இணையத்தை அனுப்பு" : "Send Password Reset Link"}
                    </button>

                    <div className="text-center">
                      <Link
                        href="/admin/auth/signin"
                        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium transition-colors dark-text"
                      >
                        {isTamil ? "உள்நுழைவுக்கு மீண்டும் திரும்பு" : "Back to Sign in"}
                      </Link>
                    </div>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
