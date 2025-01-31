"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Terms from "@/components/Checkboxes/Terms";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import SelectGroupReligion from "@/components/SelectGroup/SelectGroupReligion";


const SignUp: React.FC = () => {

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
    religion: ""
  });

  const [selected, setselected] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  // Array for religions
  const religions = [
    "Hindu",
    "Muslim",
    "Christian"
  ];

  const validatePassword = (password: string): string | null => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 6 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character.";
    }
    return null; // Valid password
  };

  const validate = () => {
    let newErrors: any = {};

    // Name validation
    if (!form.name) {
      newErrors.name = "First name is required";
    }

    // Lastname validation
    if (!form.lastname) {
      newErrors.lastname = "Last name is required";
    }

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone number validation
    if (!form.phonenumber) {
      newErrors.phonenumber = "Phone number is required";
    } else if (!/^\d+$/.test(form.phonenumber)) {
      newErrors.phonenumber = "Please enter a valid phone number";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password !== form.confirmPassword) {
      newErrors.password = "Passwords don't match";
    } else {
      const passwordError = validatePassword(form.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    // Religion validation
    if (!form.religion) {
      newErrors.religion = "Religion is required";
    }

    // Terms and condition check
    if (!selected) {
      newErrors.selected = "Please accept the Terms and Conditions";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setErrors({});
    setSuccessMessage(""); // Clear any previous success messages

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setPending(false);
      return;
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setPending(false);
      setSuccessMessage(data.message);  // Set the success message

      // Redirect to the login page after 5 seconds
      setTimeout(() => {
        router.push("/frontend/login");
      }, 5000); // Redirect after 5 seconds
    } else if (res.status === 400) {
      setErrors(data.message);
      setPending(false);
    } else if (res.status === 500) {
      setErrors(data.message);
      setPending(false);
    }
  };


  const handleReligionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedReligion = e.target.value;
    setForm({ ...form, religion: selectedReligion });

    if (selectedReligion.toLowerCase() !== "hindu") {
      setError('Registration is not accepted');
    } else {
      setError(null);
    }
  };

  return (

    <div className="flex bg-[#fbeed5]">
      {/* Left Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
        <div className="flex items-center md:w-100">
          <div className="w-full p-4">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 heading-title">
              Register
            </h2>
            {successMessage && (
              <div className="bg-green-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600 mb-6">
                <p>{successMessage}</p>
              </div>
            )}
            {!!error && (
              <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                <TriangleAlert />
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  disabled={pending}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="First name"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  disabled={pending}
                  value={form.lastname}
                  onChange={(e) => setForm({ ...form, lastname: e.target.value })}
                  placeholder="Last name"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                />
                {errors.lastname && (
                  <p className="text-red-600 text-sm">{errors.lastname}</p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="email"
                  disabled={pending}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Email ID"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  disabled={pending}
                  value={form.phonenumber}
                  onChange={(e) =>
                    setForm({ ...form, phonenumber: e.target.value })
                  }
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                />
                {errors.phonenumber && (
                  <p className="text-red-600 text-sm">{errors.phonenumber}</p>
                )}
              </div>

              <div className="mb-4">
                <SelectGroupReligion
                  religions={religions}
                  name="religion"
                  selectedReligion={form.religion}
                  onReligionChange={handleReligionChange}
                />
                {errors.religion && (
                  <p className="text-red-600 text-sm">{errors.religion}</p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  disabled={pending}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Password"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  disabled={pending}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm Password"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="mb-5">
                <Terms
                  selected={selected}
                  setselected={setselected}
                  label="I accept the"
                  linkText=" Terms and Conditions"
                  linkHref="/frontend/terms"
                />
                {errors.selected && (
                  <p className="text-red-600 text-sm">{errors.selected}</p>
                )}
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Create account"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 text-button"
                />
              </div>
            </form>
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


  );
};

export default SignUp;
