'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import React from "react";
import AuthLayout from '@/components/Layouts/AuthLayout';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ChangePassword: React.FC = () => {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
        is_admin: true,
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

        setError(null);

        if (form.password == '' || form.confirmPassword == '') {
            setError("Please fill the password fields");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setPending(true);

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
        }
    };

    return (
        <AuthLayout>
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
                                    <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4 dark-text">
                                        Change Password
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-base mb-8">
                                        Please enter your new password below
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
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    disabled={pending}
                                                    value={form.password}
                                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                    placeholder="Enter your password"
                                                    className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    disabled={pending}
                                                    value={form.confirmPassword}
                                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                                    placeholder="Re-enter your password"
                                                    className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={pending}
                                            className="w-full h-12 rounded-lg bg-[#ffd480] text-gray-900 font-medium text-base hover:bg-[#ffc44d] focus:outline-none focus:ring-2 focus:ring-[#ffd480]/50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {pending ? "Changing..." : "Change Password"}
                                        </button>

                                        <div className="text-center">
                                            <Link
                                                href="/admin/auth/signin"
                                                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium transition-colors dark-text"
                                            >
                                                Back to Sign in
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

export default ChangePassword;
