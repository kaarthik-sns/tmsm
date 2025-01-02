'use client';

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import { useSearchParams } from 'next/navigation';

const ViewProfile = () => {

  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  // Fetch user data on component mount
  useEffect(() => {
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
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="View Profile" />

      </div>
    </DefaultLayout>

  );
};

export default ViewProfile;
