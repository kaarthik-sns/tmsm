'use client';

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useSearchParams } from 'next/navigation';
import FaqElements from "@/components/Cms/Faq/view";

const Viewfaq = () => {

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {

      try {
        const res = await fetch("/api/faq/get-faq-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId, is_admin: false }),
        });


        if (res.ok) {
          const data = await res.json();
          console.log(data.data.caste);

        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

    };

    fetchUserData();
  }, [userId]);


  return (
    <DefaultLayout>
        <FaqElements />
    </DefaultLayout>

  );
};

export default Viewfaq;
