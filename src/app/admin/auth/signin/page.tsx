
import AuthLayout from '@/components/Layouts/AuthLayout';



import { Metadata } from "next";
import Admin from "@/components/AdminLogin/page";


export const metadata: Metadata = {
  title: "Admin Sign In - TMSM",
  description: "",
};


export default async function SignIn() {

  return (
    <>
      <AuthLayout>
        <Admin />
      </AuthLayout>
    </>
  );
}

