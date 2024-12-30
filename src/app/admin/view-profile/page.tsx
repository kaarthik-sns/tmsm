'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CheckboxTwo from "@/components/Checkboxes/CheckboxTwo";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import { useSearchParams } from 'next/navigation';

const viewProfile = () => {

  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const user_id = searchParams.get('user_id');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return; // Ensure session and user ID exist

      try {
        const res = await fetch("/api/get-user-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user_id, is_admin: false }),
        });

        if (res.ok) {
          const data = await res.json();

        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

    };

    fetchUserData();
  }, [session]);


  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="View Profile" />

      </div>
    </DefaultLayout>

  );
};

export default viewProfile;
