'use client';

import { useEffect, useState } from 'react';
import FrontendLayouts from "@/components/Layouts/Frontendlayout";
import { useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {

  const searchParams = useSearchParams();
  // const userId = searchParams.get('userid') || '';
  const userId = '67b4277b59f09818c1d94140';

  const [amount, setAmount] = useState<number>(500);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/get-user-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId, is_admin: false }),
        });

        if (res.ok) {
          const { data } = await res.json();
          setPhone(data?.phonenumber);
          setEmail(data?.email);
          setName(data?.name + ' ' + data?.lastname);

        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

  }, [userId]);

  const handlePayment = async () => {
    if (!userId) {
      alert('User ID is missing in URL');
      return;
    }

    const res = await fetch('/api/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: order.currency,
      name: 'TMSM',
      description: 'Subscription',
      order_id: order.id,
      handler: async function (response: any) {
        const verify = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount,
            userId,
          }),
        });

        const data = await verify.json();
        alert(data.message || 'Payment completed');
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      theme: {
        color: '#F37254',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (!userId) {
    return <p>User ID missing in URL</p>;
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  return (
    <FrontendLayouts>
      <div className="flex bg-[#fbeed5]">
        {/* Left Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
          <div className="flex items-center md:w-100">
            <div className="w-full p-4">
              <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Subscribe</h1>

              <div className="space-y-3 text-base text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{phone}</span>
                </div>
              </div>

              <hr className="my-6 border-gray-300" />

              <div className="space-y-3 text-base text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span>₹{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Start Date:</span>
                  <span>{startDate.toDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">End Date:</span>
                  <span>{endDate.toDateString()}</span>
                </div>
              </div>

              <p className="text-sm text-red-600 mt-5 font-semibold text-center">
                * Subscription is non-refundable.
              </p>

              <button
                onClick={handlePayment}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                Pay ₹{amount}
              </button>

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
    </FrontendLayouts>
  );
}
