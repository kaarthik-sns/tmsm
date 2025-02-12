'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from "@/components/common/Loader";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import { useRouter } from "next/navigation"; // For Next.js 13+


export default function VerifyEmailPage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(1);


    const code = searchParams.get('code');

    useEffect(() => {
        if (!code) {
            setMessage('Invalid verification code');
            return;
        }

        async function verifyEmail() {
            try {
                const res = await fetch(`/api/verify-email?code=${code}`);
                const data = await res.json();

                if (res.ok) {
                    setMessage(data.message);
                } else {
                    setError(data.message);
                }

                setLoading(0);

            } catch (error) {
                console.error(error);
                setMessage('An error occurred while processing your request');
            }
        }

        verifyEmail();
    }, [code]);

    if (loading) {
        return <Loader />
    }

    return (
        <FrontendLayouts>
            <div className="flex bg-[#fbeed5] h-verify max-h-screen">
                {/* Left Section - Login Form */}
                <div className="w-full  flex flex-col justify-center items-center p-6 md:p-10">
                    <div className="items-center md:w-100">
                        <div className="w-full p-4">
                            {message && (
                                <p className="mt-3 text-gray-700 max-w-xs text-center">
                                    {message}
                                    <button
                                        className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom mt-5 mb-5"
                                        onClick={() => router.push("/login")}
                                    >
                                        Click to Login
                                    </button>
                                </p>
                            )}
                            {error && (
                                <p className="mt-3 text-gray-700 max-w-xs text-center">{error}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayouts>

    );


}
