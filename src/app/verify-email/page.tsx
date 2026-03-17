'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from "@/components/common/Loader";
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, MailCheck, LogIn } from "lucide-react";


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
            <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] p-6">
                <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
                    <div className="p-8 md:p-12 text-center">
                        {message && (
                            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="flex justify-center">
                                    <div className="bg-green-100 p-4 rounded-full">
                                        <CheckCircle2 className="w-16 h-16 text-green-600" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800">Verified!</h2>
                                <p className="text-lg text-gray-600">
                                    {message || "Your email has been successfully verified. You can now access all features of our matrimony service."}
                                </p>
                                <button
                                    className="w-full flex items-center justify-center gap-2 bg-[#be3144] hover:bg-[#a32a3a] text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 mt-4"
                                    onClick={() => router.push("/login")}
                                >
                                    <LogIn className="w-5 h-5" />
                                    Continue to Login
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="flex justify-center">
                                    <div className="bg-red-100 p-4 rounded-full">
                                        <XCircle className="w-16 h-16 text-red-600" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800">Verification Failed</h2>
                                <p className="text-lg text-gray-600">
                                    {error || "The verification link might be invalid or has already expired."}
                                </p>
                                <button
                                    className="w-full border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200 mt-4"
                                    onClick={() => router.push("/register")}
                                >
                                    Back to Registration
                                </button>
                            </div>
                        )}

                        {!message && !error && !loading && (
                            <div className="space-y-6">
                                <MailCheck className="w-20 h-20 text-gray-400 mx-auto animate-pulse" />
                                <h2 className="text-2xl font-semibold text-gray-600">Processing...</h2>
                            </div>
                        )}
                    </div>
                    <div className="bg-gray-50 py-4 px-8 border-t border-gray-100 italic text-sm text-gray-500">
                        Join families, unite hearts.
                    </div>
                </div>
            </div>
        </FrontendLayouts>
    );


}
