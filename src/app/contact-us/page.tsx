"use client";

import React from "react";
import Link from "next/link";
import AuthLayout from '@/components/Layouts/AuthLayout';

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";


const Contact: React.FC = () => {

    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        lastname: "",
        email: "",
        message: "",
        interest: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Set pending state while submitting
        setPending(true);
        setError(null); // Reset any previous error message

        try {
            const res = await fetch("/api/contact-us", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                // On success, show success message
                setPending(false);

                toast.success(data.message, {
                    className: "sonner-toast-success",
                    cancel: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                });

                // Optionally, reset form after successful submission
                setForm({
                    name: "",
                    lastname: "",
                    email: "",
                    message: "",
                    interest: "",
                    phone: "",
                });
            } else {
                // On error, set the error state
                setError(data.message || "Something went wrong!");
                setPending(false);
            }
        } catch (err) {
            // Catch any errors from the fetch itself
            setPending(false);
            setError("An error occurred while submitting the form. Please try again.");
        }
    };


    return (
        <AuthLayout>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex flex-wrap items-center">
                    <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                                Sign Up to TMSM
                            </h2>
                            {!!error && (
                                <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                                    <TriangleAlert />
                                    <p>{error}</p>
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>

                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled={pending}
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                            placeholder="Enter your first name"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

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
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled={pending}
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            required
                                            placeholder="Enter your Phone Number"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Interest In
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled={pending}
                                            value={form.interest}
                                            onChange={(e) => setForm({ ...form, interest: e.target.value })}
                                            required
                                            placeholder="Enter Interest In"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Message
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            disabled={pending}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            required
                                            placeholder="Enter Message"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>




                                <div className="mb-5">
                                    <input
                                        type="submit"
                                        value="Submit"
                                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                    />
                                </div>


                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Contact;
