// import { headers } from 'next/headers';

// export default async function VerifyEmailPage() {
//     const searchParams = new URLSearchParams(headers().get('referer')?.split('?')[1]);
//     const code = searchParams.get('code');

//     if (!code) {
//         return <div>Invalid verification code</div>;
//     }

//     try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-email?code=${code}`, {
//             cache: 'no-store',
//         });
//         const data = await res.json();

//         if (res.ok) {
//             return <div>{data.message}</div>;
//         } else {
//             return <div>{data.message}</div>;
//         }
//     } catch (error) {
//         console.error(error);
//         return <div>An error occurred while processing your request</div>;
//     }
// }

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const [message, setMessage] = useState('Loading...');
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
                    setMessage(data.message);
                }
            } catch (error) {
                console.error(error);
                setMessage('An error occurred while processing your request');
            }
        }

        verifyEmail();
    }, [code]);

    return <div>{message}</div>;
}
