'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from "@/components/common/Loader";

export default function VerifyEmailPage() {
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
        <div className="flex items-center justify-center h-screen">
            <div className="w-96 h-40 rounded-lg border-2 flex items-center justify-center">
                {message && (
                    <p className="mt-3 text-gray-700 max-w-xs text-center">
                        {message}
                        <a className="font-medium text-indigo-600" href="auth/signin"> Click to SignIn</a>
                    </p>
                )}
                {error && (
                    <p className="mt-3 text-gray-700 max-w-xs text-center">{error}</p>
                )}
            </div>
        </div>
    );


}
