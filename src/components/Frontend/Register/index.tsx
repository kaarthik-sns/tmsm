"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Terms from "@/components/Checkboxes/Terms";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert, Eye, EyeOff } from "lucide-react";
import SelectGroupReligion from "@/components/SelectGroup/SelectGroupReligion";
import SelectGroupCaste from "@/components/SelectGroup/SelectGroupCaste";
import RadioButtonGroup from "@/components/RadioButtonGroup/RadioButtonTwo";
import Swal from 'sweetalert2';
import { validatePassword } from '@/utils/validation.util';


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
    profile_creator_name: "",
    caste: "",
    subcaste: "",
    relation_name: ""
  });

  const lang = localStorage.getItem('lang') || 'en';

  const [remainingTime, setRemainingTime] = useState(10); // 10 seconds countdown
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  // Array for religions
  const religions = lang === 'ta'
    ? [
      { label: "இந்து", value: "Hindu" },
      { label: "முஸ்லிம்", value: "Muslim" },
      { label: "கிறிஸ்துவர்", value: "Christian" },
    ]
    : [
      { label: "Hindu", value: "Hindu" },
      { label: "Muslim", value: "Muslim" },
      { label: "Christian", value: "Christian" },
    ];

  const castes = lang === 'ta'
    ? [
      { label: "முதலியார்", value: "Mudaliyar" },
    ]
    : [
      { label: "Mudaliyar", value: "Mudaliyar" },
    ];

  const profileOptions = lang === 'ta'
    ? [
      { label: 'எனக்கு', value: 'myself' },
      { label: 'மகள்', value: 'daughter' },
      { label: 'மகன்', value: 'son' },
      { label: 'மற்றவர்கள்', value: 'others' },
    ]
    : [
      { label: 'MySelf', value: 'myself' },
      { label: 'Daughter', value: 'daughter' },
      { label: 'Son', value: 'son' },
      { label: 'Others', value: 'others' },
    ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form state
    setForm((prevData) => {
      const updatedForm = { ...prevData, [name]: value };

      setPasswordError(null);

      // Validate password
      if (name === "password") {
        setPasswordError(validatePassword(value, lang));
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
            ? lang === "ta"
              ? {
                name: "முதல் பெயர்",
                lastname: "கடைசி பெயர்",
                phonenumber: "தொலைபேசி எண்",
                email: "மின்னஞ்சல்",
              }
              : {
                name: "First name",
                lastname: "Last name",
                phonenumber: "Phone number",
                email: "Email ID",
              }
            : lang === "ta"
              ? {
                name: "மணமகன்/மணமகள் முதல் பெயர்",
                lastname: "மணமகன்/மணமகள் கடைசி பெயர்",
                phonenumber: "உருவாக்குனரின் தொலைபேசி எண்",
                email: "உருவாக்குனரின் மின்னஞ்சல்",
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


  const validate = () => {
    let newErrors: any = {};

    if (!form.profile_created_for) {
      newErrors.profile_created_for = lang === 'ta' ? "ஏதேனும் ஒன்றை தேர்வு செய்யவும்." : "Select matrimony profile for.";
    }

    if (form.profile_created_for !== 'myself') {
      if (!form.profile_creator_name || form.profile_creator_name.trim() === "") {
        newErrors.profile_creator_name = lang === 'ta'
          ? "கணக்கு உருவாக்குநரின் பெயர் கட்டாயம் உள்ளிடவும்."
          : "Creator Name cannot be empty.";
      }
    }

    if (form.profile_created_for == 'others') {
      if (!form.relation_name || form.relation_name.trim() === "") {
        newErrors.relation_name = lang === 'ta'
          ? "மணமகனுடன் / மணமகளுடன் உள்ள உறவு கட்டாயம் உள்ளிடவும்."
          : "Relationship to Bride/Groom cannot be empty.";
      }
    }

    if (!form.name || form.name.trim() === "") {
      newErrors.name = lang === 'ta' ? "முதல் பெயர் கட்டாயம் உள்ளிடவும்." : "First name cannot be empty.";
    }

    if (!form.lastname || form.lastname.trim() === "") {
      newErrors.lastname = lang === 'ta' ? "கடைசி பெயர் கட்டாயம் உள்ளிடவும்." : "Last name cannot be empty.";
    }

    if (!form.caste || form.caste.trim() === "") {
      newErrors.caste = lang === 'ta' ? "சாதி தேர்வு கட்டாயம் உள்ளிடவும்." : "Caste cannot be empty.";
    }

    if (!form.subcaste || form.subcaste.trim() === "") {
      newErrors.subcaste = lang === 'ta' ? "உட்சாதி தேர்வு கட்டாயம் உள்ளிடவும்." : "Subcaste cannot be empty.";
    }

    if (form.email && form.email.trim() !== "") {
      if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = lang === 'ta' ? "சரியான மின்னஞ்சல் உள்ளிடவும்." : "Enter a valid email address";
      }
    }

    if (!form.phonenumber) {
      newErrors.phonenumber = lang === 'ta' ? "தொலைபேசி எண் கட்டாயம் உள்ளிடவும்." : "Phone number cannot be empty";
    } else if (!/^\d{10}$/.test(form.phonenumber)) {
      newErrors.phonenumber = lang === 'ta' ? "சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்." : "Enter a valid 10-digit phone number";
    }

    const passwordValidationError = validatePassword(form.password, lang);
    if (passwordValidationError) {
      newErrors.password = passwordValidationError;
      setPasswordError(passwordValidationError);
    }

    if (!form.confirmPassword) {
      setConfirmPasswordError(lang === 'ta' ? "கடவுச்சொல்லை உறுதிப்படுத்தவும்." : "Confirm password cannot be empty.");

    } else if (form.password !== form.confirmPassword) {
      setConfirmPasswordError(lang === 'ta' ? "கடவுச்சொல் பொருந்தவில்லை." : "Passwords do not match.");
    }

    if (!form.religion) {
      newErrors.religion = lang === 'ta' ? "மத தேர்வு கட்டாயம்" : "Religion cannot be empty";
    }
    if (form.religion.toLowerCase() !== "hindu" && form.religion.toLowerCase() !== "") {
      newErrors.religion = lang === 'ta'
        ? "தற்போது இந்த மதத்திற்கு பதிவு அனுமதிக்கப்படவில்லை."
        : "Registration is not permitted at this time.";
    }

    if (!selected) {
      newErrors.selected = lang === 'ta'
        ? "விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்கவும்."
        : "Please accept the Terms and Conditions";
    }

    return newErrors;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError(null);
    setSuccessMessage(""); // Clear any previous success messages

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await Swal.fire({
      title: lang === 'ta' ? 'முக்கிய குறிப்பு' : 'Important Note',
      html: lang === 'ta'
        ? `<div class="text-sm text-left mb-4">
             <p class="mb-2">சொத்து விவரம், பொருளாதார எதிர்பார்ப்பு ஆகியவற்றை இத்தளத்தில் பதியக் கூடாது. ஜாதகம், பயோடேட்டா ஆகியவற்றுடனும் இவ்விவரங்களைப் பதிவிடக்கூடாது. அப்படிப் பதிவு செய்தால் அவ்விவரங்கள் நீக்கப்படும்.</p>
             <p>பெண் வரன்களின் புகைப்படங்களை இங்கு ஜாதகத்துடனோ வேறு வகையிலோ பதிவிட வேண்டாம். இவ்வேண்டுகோள் உங்கள் பாதுகாப்புக் கருதி தெரிவிக்கப்படுகிறது. அப்படியும் படங்கள் பதிவிடப்பட்டால் அதற்கு இந்த வெப்சைட் நிர்வாகம் பொறுப்பாகாது.</p>
           </div>
           <p class="font-medium">இந்த நிபந்தனைகளை ஏற்று தொடர விரும்புகிறீர்களா?</p>`
        : `<div class="text-sm text-left mb-4">
             <p class="mb-2">Do not post information of property details or financial expectations. This matrimony platform is for sharing horoscopes and profile-related information only. Restricting such content helps maintain privacy, avoid misuse, and help us to keep the platform focused on matchmaking. Any such information if posted, will be removed.</p>
             <p>Please avoid posting bride girl's photo in this site. Please also avoid bride girl's photo in horoscope too. This is for your safety. If at all you post any photo, it is at your own risk and the site or site management will not be responsible.</p>
           </div>
           <p class="font-medium">Do you agree and wish to proceed?</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: lang === 'ta' ? 'ஆம், நான் ஏற்கிறேன்' : 'I Agree, Proceed',
      cancelButtonText: lang === 'ta' ? 'இல்லை, ரத்து செய்' : 'No, Cancel',
    });

    if (!result.isConfirmed) {
      return;
    }

    setPending(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setPending(false);
      setSuccessMessage(
        lang == 'ta'
          ? "பதிவுசெய்தல் வெற்றிகரமாக முடிந்தது. நிர்வாகியின் ஒப்புதலுக்கு காத்திருக்கவும். மேலும் தகவலுக்கு உங்கள் மின்னஞ்சலை பார்க்கவும்."
          : "Registration successful. Await admin approval. Check your email for updates."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Redirect is handled by useEffect with countdown
    } else if (res.status === 400) {
      setError(data.message);
      setPending(false);
    } else if (res.status === 500) {
      setError(data.message);
      setPending(false);
    }
  };


  const handleReligionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedReligion = e.target.value;
    setForm({ ...form, religion: selectedReligion });

    let newErrors = { ...errors };
    setErrors(null);

    if (!selectedReligion) {
      newErrors.religion =
        lang === "ta"
          ? "மதத்தை தேர்ந்தெடுக்க வேண்டும்."
          : "Religion cannot be empty.";
    } else if (selectedReligion.toLowerCase() !== "hindu") {
      newErrors.religion =
        lang === "ta"
          ? "தற்போது இந்த மதத்திற்கான பதிவு அனுமதிக்கப்படவில்லை."
          : "Registration is not permitted at this time.";
    } else {
      delete newErrors.religion;
    }

    setErrors(newErrors);
  };



  const handleCasteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedcaste = e.target.value;
    setForm({ ...form, caste: selectedcaste });
  };


  // Handle Redirection when countdown reaches 0
  useEffect(() => {
    if (successMessage && remainingTime === 0) {
      router.push("/login");
    }
  }, [remainingTime, successMessage, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (successMessage) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [successMessage]);

  return (

    <div className="flex flex-col justify-center lg:flex-row lg:justify-start md:min-h-screen bg-[#fbeed5] register">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10">
        <div className="flex items-center w-full md:w-100">
          <div className="w-full p-2 sm:p-4">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold text-black lg:text-title-xl2 text-center sm:text-left">
              {lang == 'ta' ? 'புதிய கணக்கு உருவாக்குங்கள்' : 'Register'}
            </h2>
            {successMessage && (
              <div className="bg-green-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600 mb-6">
                <p> {lang == 'ta' ? `வெற்றிகரமாக கணக்கு பதிவு செய்யப்பட்டு, உள்நுழைவுக்கு ${remainingTime} விநாடிகளில் மாற்றப்படுகிறது...` : `${successMessage} Redirecting to login in ${remainingTime} seconds...`}</p>
              </div>
            )}
            {!!error && (
              <div className="bg-red-100 md:bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                <TriangleAlert />
                <p>{error}</p>
              </div>
            )}
            {lang == 'ta' && (<p className="text-sm font-medium dark-text mb-4">Please fill the form in english&nbsp;<span className="text-meta-1">*</span></p>)}
            <form onSubmit={handleSubmit} >
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                  <b>{lang == 'ta' ? 'யாருக்காக கணக்கு உருவாக்கப்படுகிறது?' : 'Matrimony profile for'}</b>
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
                  <div className="mb-4.5">
                    <input
                      type="text"
                      name="profile_creator_name"
                      value={form.profile_creator_name || ""}
                      onChange={handleChange}
                      placeholder={lang == 'ta' ? 'கணக்கு  உருவாக்குநரின் பெயர்' : 'Profile Creator Name'}
                      className={`w-full rounded-lg border ${errors.profile_creator_name ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-6 text-black outline-none focus:border-primary`}

                    />
                    {errors?.profile_creator_name && (
                      <p className="mt-1 text-sm text-red-500">{errors.profile_creator_name}</p>
                    )}
                  </div>
                </>
              )}

              {form.profile_created_for == 'others' && (
                < div className="mb-4">
                  <input
                    type="text"
                    disabled={pending}
                    value={form.relation_name}
                    onChange={(e) => setForm({ ...form, relation_name: e.target.value })}
                    placeholder={lang == 'ta' ? 'மணமகனுடன் / மணமகளுடன் உள்ள உறவு' : 'Relationship to Bride/Groom'}
                    autoComplete="new-email"
                    className={`w-full rounded-lg border ${errors.relation_name ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}
                  />
                  {errors.relation_name && (
                    <p className="text-red-600 text-sm">{errors.relation_name}</p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <input
                  type="text"
                  disabled={pending}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={lang == 'ta' ? 'மணமகள்/மணமகன் முதல் பெயர்' : placeholders.name}
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
                  placeholder={lang == 'ta' ? 'மணமகள்/மணமகன் கடைசி பெயர்' : placeholders.lastname}
                  className={`w-full rounded-lg border ${errors.lastname ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-6 text-black outline-none focus:border-primary`}
                />
                {errors.lastname && (
                  <p className="text-red-600 text-sm">{errors.lastname}</p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  disabled={pending}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={lang == 'ta' ? 'மின்னஞ்சல்' : placeholders.email}
                  autoComplete="new-email"
                  className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-stroke'} bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                {form.profile_created_for !== "myself" && (
                  <label className="mb-1 block text-sm font-medium dark-text dark:text-white">
                    {lang == 'ta' ? 'மணமகள்/மணமகன் தொலைபேசி எண் தெரிவிக்க வேண்டாம்.' : "Don't mention the bride/groom's phone number."}
                  </label>
                )}
                <input
                  type="text"
                  maxLength={10}
                  disabled={pending}
                  value={form.phonenumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, phonenumber: value });
                  }}
                  placeholder={lang == 'ta' ? 'தொலைபேசி எண்' : placeholders.phonenumber}
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
                <SelectGroupCaste
                  castes={castes}
                  name="caste"
                  selectedcaste={form.caste}
                  oncasteChange={handleCasteChange}
                />
                {errors.caste && (
                  <p className="text-red-600 text-sm">{errors.caste}</p>
                )}
              </div>


              <div className="mb-4.5">
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    name="subcaste"
                    value={form.subcaste}
                    onChange={(e) => setForm({ ...form, subcaste: e.target.value })}
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="" disabled className="text-body dark:text-bodydark">
                      {lang == 'ta' ? 'உட்சாதியை தேர்ந்தெடுக்கவும்' : 'Select subcaste'}
                    </option>
                    <option value="Thondai mandala saiva mudaliyar" className="text-body dark:text-bodydark">
                      {lang == 'ta' ? "தொண்டை மண்டல சைவ முதலியார்" : "Thondai mandala saiva mudaliyar"}
                    </option>
                  </select>

                  <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
                {errors.subcaste && (
                  <p className="text-red-600 text-sm">{errors.subcaste}</p>
                )}
              </div>

              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder={lang == 'ta' ? 'கடவுச்சொல்' : 'Password'}
                    className={`w-full rounded-lg border ${passwordError ? "border-red-500" : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-12 text-black outline-none focus:border-primary`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
              </div>
              {/* Confirm Password Field */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword" // ✅ Ensure this matches state key
                    value={form.confirmPassword} // ✅ Ensure correct state binding
                    onChange={handleChange}
                    autoComplete="new-password"
                    placeholder={lang == 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm Password'}
                    className={`w-full rounded-lg border ${confirmPasswordError ? "border-red-500" : "border-stroke"
                      } bg-transparent py-4 pl-6 pr-12 text-black outline-none focus:border-primary`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {confirmPasswordError && <p className="text-red-600 text-sm">{confirmPasswordError}</p>}
              </div>

              <div className="mb-5">
                <Terms
                  selected={selected}
                  setselected={setselected}
                  label={lang === 'ta' ? 'நான் ஏற்கிறேன்' : 'I accept the'}
                  linkText={lang === 'ta' ? 'விதிமுறைகள் மற்றும் நிபந்தனைகளை.' : 'Terms and Conditions.'}
                  linkHref="/terms"
                />

                {errors.selected && (
                  <p className="text-red-600 text-sm">{errors.selected}</p>
                )}
              </div>

              <div className="mb-5">
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 text-button flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-opacity-70"
                >
                  {pending ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                      <span>{lang == 'ta' ? 'செயலாக்கப்படுகின்றன...' : 'Processing...'}</span>
                    </>
                  ) : (
                    lang == 'ta' ? 'கணக்கை உருவாக்கவும்' : 'Create account'
                  )}
                </button>
              </div>
              <div className="mt-6 text-center">
                {/* <p className="text-sm font-medium text-center dark-text mb-4">
                  {lang === 'ta' ? 'பதிவுக்கான கட்டணம் ₹500 முதல்.' : 'Registration amount is ₹500 onwards.'}
                </p> */}
                <p>
                  {lang == 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'}{" "}
                  <Link href="/login" className="text-primary dark-terms">
                    {lang == 'ta' ? 'உள்நுழைக' : 'Sign in'}
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div >

      {/* Right Section - Image with Overlay */}
      <div className="w-full lg:w-1/2 relative hidden lg:block">
        <Image
          width={1000}
          height={1000}
          src="/images/login/login.svg"
          alt="Couple"
          className="w-full h-full object-cover"
        />
      </div >
    </div >


  );
};

export default SignUp;
