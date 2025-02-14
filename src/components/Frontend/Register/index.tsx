"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Terms from "@/components/Checkboxes/Terms";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import SelectGroupReligion from "@/components/SelectGroup/SelectGroupReligion";
import RadioButtonGroup from "@/components/RadioButtonGroup/RadioButtonTwo";



const SignUp: React.FC = () => {

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
    religion: "",
    profile_created_for: "",
    profile_creator_name: ""
  });
  const [remainingTime, setRemainingTime] = useState(9); // 5 seconds initially
  const [selected, setselected] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProfileCreator, setIsProfileCreator] = useState(false);
  const [placeholders, setPlaceholders] = useState({
    name: "First name",
    lastname: "Last name",
    phonenumber: "Phone number",
    email: "Email ID",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const router = useRouter();

  // Array for religions
  const religions = [
    "Hindu",
    "Muslim",
    "Christian"
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form state
    setForm((prevData) => {
      const updatedForm = { ...prevData, [name]: value };

      // Validate password
      if (name === "password") {
        setPasswordError(validatePassword(value));
      }

      // Validate confirm password
      if (name === "confirmPassword") {
        setConfirmPasswordError(updatedForm.password !== value ? "Passwords do not match." : null);
      }

      // Handle "Profile created for" specific logic
      if (name === "profile_created_for") {
        setIsProfileCreator(value !== "myself");

        // Update placeholders dynamically
        setPlaceholders(
          value === "myself"
            ? {
              name: "First name",
              lastname: "Last name",
              phonenumber: "Phone number",
              email: "Email ID",
            }
            : {
              name: "Bride/Groom First name",
              lastname: "Bride/Groom Last name",
              phonenumber: "Creator Phone number",
              email: "Creator Email ID",
            }
        );
      }

      return updatedForm;
    });
  };


  const validatePassword = (password: string): string | null => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!password) return "Password cannot be empty.";

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
    let valid = true;

    if (!form.profile_created_for) {
      newErrors.profile_created_for = "Select a Matrimony profile.";
    }


    if (form.profile_created_for != 'myself') {

      if (!form.profile_creator_name || form.profile_creator_name.trim() === "") {
        newErrors.profile_creator_name = "Creator Name cannot be empty..";
      }

    }

    // Name validation
    if (!form.name || form.name.trim() === "") {
      newErrors.name = "First name cannot be empty.";
    }

    // Lastname validation
    if (!form.lastname || form.lastname.trim() === "") {
      newErrors.lastname = "Last name cannot be empty.";
    }

    // Email validation
    if (!form.email || form.email.trim() === "") {
      newErrors.email = "Email cannot be empty.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Phone number validation
    if (!form.phonenumber) {
      newErrors.phonenumber = "Phone number cannot be empty";
    } else if (!/^\d{10}$/.test(form.phonenumber)) {
      newErrors.phonenumber = "Enter a valid 10-digit phone number";
    }

    // Validate password
    const passwordValidationError = validatePassword(form.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      valid = false;
    }


    // Validate confirm password
    if (!form.confirmPassword) {
      setConfirmPasswordError("Confirm Password cannot be empty.");
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    }

    // Religion validation
    if (!form.religion) {
      newErrors.religion = "Religion cannot be empty";
    }
    if (form.religion.toLowerCase() !== "hindu" && form.religion.toLowerCase() !== "") {
      newErrors.religion = "Registration is not permitted at this time.";
    }

    // Terms and condition check
    if (!selected) {
      newErrors.selected = "Accept the Terms and Conditions";
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
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Redirect to the login page after 5 seconds
      setTimeout(() => {
        router.push("/login");
      }, 5000); // Redirect after 5 seconds
    } else if (res.status === 400) {
      setErrors(data.message);
      setPending(false);
    } else if (res.status === 500) {
      setErrors(data.message);
      setPending(false);
    }
  };

  const profileOptions = [
    { label: 'MySelf', value: 'myself' },
    { label: 'Daughter', value: 'daughter' },
    { label: 'Son', value: 'son' },
    { label: 'Others', value: 'others' },
  ];




  const handleReligionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedReligion = e.target.value;
    setForm({ ...form, religion: selectedReligion });

    let newErrors = { ...errors };

    if (!selectedReligion) {
      newErrors.religion = "Religion cannot be empty.";
    } else if (selectedReligion.toLowerCase() !== "hindu") {
      newErrors.religion = "Registration is not permitted at this time.";
    } else {
      delete newErrors.religion;
    }

    setErrors(newErrors);
  };



  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (successMessage) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 1) {
            clearInterval(timer as NodeJS.Timeout);  // Stop the timer
            router.push("/login");  // Redirect after countdown finishes
          }
          return prevTime - 1;
        });
      }, 1000); // 1000ms = 1 second
    }

    return () => {
      if (timer) clearInterval(timer); // Clean up the interval if the component unmounts or successMessage changes
    };
  }, [successMessage, router]);

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
                <p>{successMessage} Redirecting to login in {remainingTime} seconds... </p>
              </div>
            )}
            {!!error && (
              <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                <TriangleAlert />
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} >
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  <b>Matrimony profile for</b>
                </label>
                <RadioButtonGroup
                  name="profile_created_for"
                  options={profileOptions}
                  selectedValue={form.profile_created_for}
                  onChange={handleChange}
                />
                {errors?.profile_created_for && (
                  <p className="mt-1 text-red-600 text-sm">{errors.profile_created_for}</p>
                )}
              </div>

              {isProfileCreator && (
                <>
                  < div className="mb-4.5">
                    <input
                      type="text"
                      name="profile_creator_name"
                      value={form.profile_creator_name || ""}
                      onChange={handleChange}
                      placeholder="Profile Creator Name"
                      className={`w-full rounded-lg border ${errors.profile_creator_name ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}

                    />
                    {errors?.profile_creator_name && (
                      <p className="mt-1 text-sm text-red-500">{errors.profile_creator_name}</p>
                    )}
                  </div>
                </>
              )}
              <div className="mb-4">
                <input
                  type="text"
                  disabled={pending}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={placeholders.name}
                  className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}

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
                  placeholder={placeholders.lastname}
                  className={`w-full rounded-lg border ${errors.lastname ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}
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
                  placeholder={placeholders.email}
                  autoComplete="off" // Disable browser autofill
                  className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}
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
                  placeholder={placeholders.phonenumber}
                  className={`w-full rounded-lg border ${errors.phonenumber ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full rounded-lg border ${passwordError ? "border-red-500" : "border-stroke"
                    } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}
                />
                {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
              </div>
              {/* Confirm Password Field */}
              <div className="mb-4">
                <input
                  type="password"
                  name="confirmPassword" // ✅ Ensure this matches state key
                  value={form.confirmPassword} // ✅ Ensure correct state binding
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`w-full rounded-lg border ${confirmPasswordError ? "border-red-500" : "border-stroke"
                    } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}
                />
                {confirmPasswordError && <p className="text-red-600 text-sm">{confirmPasswordError}</p>}
              </div>

              <div className="mb-5">
                <Terms
                  selected={selected}
                  setselected={setselected}
                  label="I accept the"
                  linkText=" Terms and Conditions"
                  linkHref="/terms"
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
              <div className="mt-6 text-center">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary dark-terms">
                    Sign in
                  </Link>
                </p>
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
