"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import SelectGroupStates from "@/components/SelectGroup/SelectGroupStates";
import SelectGroupCities from "@/components/SelectGroup/SelectGroupCities";
import SelectGroupReligion from "@/components/SelectGroup/SelectGroupReligion";
import SelectGroupCountries from "@/components/SelectGroup/SelectGroupCountries";
import SelectGroupCaste from "@/components/SelectGroup/SelectGroupCaste";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import RadioButtonGroup from "@/components/RadioButtonGroup/RadioButtonTwo";
import ImageUpload from "@/components/FormElements/ImageUpload";
import FileUpload from "@/components/FormElements/FileUpload";
import NextImage from "next/image";

const UserProfile = (user_data) => {

  const searchParams = useSearchParams();
  // const userId = searchParams.get("userId");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profileCreatorPic, setProfileCreatorPic] = useState<File | null>(null);
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photo3, setPhoto3] = useState<File | null>(null);
  const [photo4, setPhoto4] = useState<File | null>(null);
  const [horoscope, setHoroscope] = useState<File | null>(null);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [profileCreator, setProfileCreator] = useState(false);
  const formData_upload = new FormData();
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const errorRef = useRef(null);

  const router = useRouter();

  const lang = localStorage.getItem('lang') || 'en';

  // Array for religions
  const religions = lang === 'ta'
    ? [
      { label: "இந்து", value: "Hindu" }
    ]
    : [
      { label: "Hindu", value: "Hindu" }
    ];

  const freligions = lang === 'ta'
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
      { label: "தொண்டை மண்டல சைவ முதலியார்", value: "Thondai mandala saiva mudaliyar" },
      { label: "முதலியார்", value: "Mudaliyar" },
      { label: "சைவ முதலியார்", value: "Saiva mudaliyar" },
    ]
    : [
      { label: "Thondai mandala saiva mudaliyar", value: "Thondai mandala saiva mudaliyar" },
      { label: "Mudaliyar", value: "Mudaliyar" },
      { label: "Saiva mudaliyar", value: "Saiva mudaliyar" },
    ];

  const profileOptions = [
    { label: lang === 'ta' ? 'எனக்காக' : 'MySelf', value: 'myself' },
    { label: lang === 'ta' ? 'மகள்' : 'Daughter', value: 'daughter' },
    { label: lang === 'ta' ? 'மகன்' : 'Son', value: 'son' },
    { label: lang === 'ta' ? 'மற்றவர்கள்' : 'Others', value: 'others' },
  ];

  const maritalstatusOptions = [
    { label: lang === 'ta' ? 'திருமணம் செய்யவில்லை' : 'Never Married', value: 'nevermarried' },
    { label: lang === 'ta' ? 'விதவையானவர்' : 'Widowed', value: 'widowed' },
    { label: lang === 'ta' ? 'விவாகரத்து பெற்றவர்' : 'Divorced', value: 'divorced' },
    { label: lang === 'ta' ? 'விவாகரத்துக்காக காத்திருக்கிறேன்' : 'Awaiting Divorce', value: 'awaitingdivorce' },
  ];

  const lookingforOptions = [
    { label: lang === 'ta' ? 'மணமகள்' : 'Bride', value: 'bride' },
    { label: lang === 'ta' ? 'மணமகன்' : 'Groom', value: 'groom' },
  ];

  const genderOptions = [
    { label: lang === 'ta' ? 'ஆண்' : 'Male', value: 'male' },
    { label: lang === 'ta' ? 'பெண்' : 'Female', value: 'female' },
  ];

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phonenumber: "",
    religion: "",
    caste: "",
    subcaste: "",
    birthdate: "",
    age: 0,
    place_of_birth: "",
    education: "",
    complexion: "",
    profession: "",
    income: "",
    job: "",
    place_of_work: "",
    kuladeivam: "",
    place_of_kuladeivam_temple: "",
    gothram: "",
    reference1: "",
    reference2: "",
    father_name: "",
    father_phonenumber: "",
    father_occupation: "",
    father_religion: "",
    father_profession: "",
    father_placeOfWork: "",
    mother_name: "",
    mother_phonenumber: "",
    mother_occupation: "",
    mother_religion: "",
    mother_profession: "",
    mother_placeOfWork: "",
    address: "",
    profile_photo: "",
    photo1: "",
    photo2: "",
    photo3: "",
    photo4: "",
    horoscope: "",
    maritalstatus: "",
    profile_created_for: "",
    profile_creator_name: "",
    profile_creator_photo: "",
    profile_creator_aadhar: "",
    profile_creator_phonenumber: "",
    lookingfor: "",
    partner_pref_caste: "",
    partner_pref_subcaste: "",
    partner_pref_age: "",
    partner_pref_education: "",
    gender: "",
    bride_groom_detail: "",
    state: { name: "" },
    city: { name: "" },
    state_id: '',
    city_id: '',
    country_id: "",
    relation_name: "",
  });

  // Set selected state and city based on formData
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value;
    setSelectedState(newState);
    setFormData({ ...formData, state_id: newState, city_id: "" }); // Reset city when state changes
    setSelectedCity("");
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = event.target.value;
    setSelectedCountry(newCountry);
    setFormData({ ...formData, country_id: newCountry, state_id: "", city_id: "" }); // Reset city when state changes
    setSelectedCity("");
    setSelectedState("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = event.target.value;
    setSelectedCity(newCity);
    setFormData({ ...formData, city_id: newCity });
  };

  useEffect(() => {
    if (user_data && !formData.email) { // Only update if formData is empty
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/get-user-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user_data.userId }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }

          const { data } = await response.json();

          setFormData((prevData) => ({
            ...prevData,
            ...data, // Merge existing data without overwriting user input
          }));

          if (data?.profile_created_for !== 'myself') {
            setProfileCreator(true);
          }

          setProfilePic(data.profile_photo);
          setPhoto1(data.photo1);
          setPhoto2(data.photo2);
          setPhoto3(data.photo3);
          setPhoto4(data.photo4);
          setProfileCreatorPic(data.profile_creator_photo);
          setHoroscope(data.horoscope);
          setSelectedState(data.state_id);
          setSelectedCity(data.city_id);
          setSelectedCountry(data.country_id);

          setFormData((prevFormData) => ({
            ...prevFormData, // Spread existing form data to keep other fields
            photo1: data?.photo1 ? `/api${data.photo1}` : '',
            photo2: data?.photo2 ? `/api${data.photo2}` : '',
            photo3: data?.photo3 ? `/api${data.photo3}` : '',
            photo4: data?.photo4 ? `/api${data.photo4}` : '',
            profile_photo: data?.profile_photo ? `/api${data.profile_photo}` : '',
            profile_creator_photo: data?.profile_creator_photo ? `/api${data.profile_creator_photo}` : '',
            horoscope: data?.horoscope ? `/api${data.horoscope}` : ''
          }));


        } catch (err) {
          //console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user_data, formData.email]); // Removed formData dependency to avoid overwriting changes


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      // Handle file input
      const file = files[0];

      if (name == 'profile_photo') setProfilePic(file);
      if (name == 'photo1') setPhoto1(file);
      if (name == 'photo2') setPhoto2(file);
      if (name == 'photo3') setPhoto3(file);
      if (name == 'photo4') setPhoto4(file);
      if (name == 'profile_creator_photo') setProfileCreatorPic(file);
      if (name == 'horoscope') setHoroscope(file);

      const fileURL = URL.createObjectURL(file);
      setFormData((prevData) => ({ ...prevData, [name]: fileURL }));
    } else {

      if (name == 'profile_created_for' && value != 'myself') {
        setProfileCreator(true);
      } else if (name == 'profile_created_for' && value == 'myself') {
        setProfileCreator(false);
      }

      // Handle regular input fields
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handlePreview = () => {
    if (formData.horoscope) {
      // Open the file in a new tab
      window.open(formData.horoscope, "_blank");
    } else {
      toast.error('No file uploaded to preview!', {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const errors: Record<string, string> = {};

    const isTamil = lang === 'ta';

    if (!formData.bride_groom_detail || formData.bride_groom_detail.trim() === "") {
      errors.bride_groom_detail = isTamil
        ? "மணமகன்/மணமகளின் விவரங்களை பதிவு செய்யவும்."
        : "Please provide a short detail about the bride or groom.";
    }

    if (!formData.gender || formData.gender.trim() === "") {
      errors.gender = isTamil ? "பாலினத்தை தேர்வு செய்யவும்." : "Gender cannot be empty.";
    }

    if (!formData.name || formData.name.trim() === "") {
      errors.name = isTamil ? "முதற் பெயரை உள்ளிடவும்." : "First name cannot be empty.";
    }

    if (!formData.lastname || formData.lastname.trim() === "") {
      errors.lastname = isTamil ? "கடைசி பெயரை உள்ளிடவும்." : "Last name cannot be empty.";
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = isTamil
        ? "தயவு செய்து சரியான மின்னஞ்சலை உள்ளிடவும்."
        : "Please enter a valid email address.";
    }

    if (!formData.phonenumber || !/^\d{10}$/.test(formData.phonenumber)) {
      errors.phonenumber = isTamil
        ? "சரியான 10 எண்கள் கொண்ட தொலைபேசி எண்ணை உள்ளிடவும்."
        : "Please enter a valid 10-digit phone number";
    }

    if (!formData.gothram || formData.gothram.trim() === "") {
      errors.gothram = isTamil ? "கோத்ரம் வெறுமையாக இருக்க முடியாது." : "Gothram cannot be empty.";
    }

    if (!formData.country_id) {
      errors.country_id = isTamil ? "நாடு தேர்வு கட்டாயம்" : "Country cannot be empty.";
    }

    if (!formData.profile_photo || formData.profile_photo.trim() === "") {
      errors.profile_photo = isTamil
        ? "சுயவிவர புகைப்படம் கட்டாயம்"
        : "Profile Photo cannot be empty.";
    }

    if (!formData.birthdate || formData.birthdate.trim() === "") {
      errors.birthdate = isTamil ? "பிறந்த தேதி கட்டாயம்" : "Date Of Birth cannot be empty.";
    }

    if (!formData.maritalstatus || formData.maritalstatus.trim() === "") {
      errors.maritalstatus = isTamil ? "திருமண நிலையை தேர்வு செய்யவும்." : "Marital Status cannot be empty.";
    }

    if (!formData.profile_created_for || formData.profile_created_for.trim() === "") {
      errors.profile_created_for = isTamil
        ? "விவரத்தை உருவாக்கியவர் யார் என்பதை தெரிவிக்கவும்."
        : "Profile created for cannot be empty.";
    }

    if (!formData.state_id) {
      errors.state_id = isTamil ? "மாநிலம் தேர்வு கட்டாயம்" : "State cannot be empty.";
    }

    if (!formData.city_id) {
      errors.city_id = isTamil ? "நகரம் தேர்வு கட்டாயம்" : "City cannot be empty.";
    }

    if (!formData.address || formData.address.trim() === "") {
      errors.address = isTamil ? "முகவரி கட்டாயம்" : "Address cannot be empty.";
    }

    if (!formData.lookingfor || formData.lookingfor.trim() === "") {
      errors.lookingfor = isTamil
        ? "யாரை தேடுகிறீர்கள் தேர்வு செய்யவும்."
        : "Looking for cannot be empty.";
    }

    if (formData.profile_created_for !== 'myself') {
      if (!formData.profile_creator_name || formData.profile_creator_name.trim() === "") {
        errors.profile_creator_name = isTamil ? "பெயரை உள்ளிடவும்." : "Name cannot be empty.";
      }

      if (!formData.profile_creator_photo || formData.profile_creator_photo.trim() === "") {
        errors.profile_creator_photo = isTamil ? "படத்தை பதிவேற்றவும்." : "Picture cannot be empty.";
      }

      if (
        !formData.profile_creator_aadhar ||
        !/^\d{16}$/.test(formData.profile_creator_aadhar)
      ) {
        errors.profile_creator_aadhar = isTamil
          ? "16 எண்கள் கொண்ட சரியான ஆதார் எண்ணை உள்ளிடவும்."
          : "Please enter a valid 16-digit Aadhar number.";
      }

      if (
        formData.profile_creator_phonenumber &&
        formData.profile_creator_phonenumber.trim() !== "" &&
        !/^\d{10}$/.test(formData.profile_creator_phonenumber)
      ) {
        errors.profile_creator_phonenumber = isTamil
          ? "சரியான 10 எண்கள் கொண்ட தொலைபேசி எண்ணை உள்ளிடவும்."
          : "Enter a valid 10-digit phone number.";
      }
    }

    if (formData.profile_created_for == 'others') {
      if (!formData.relation_name || formData.relation_name.trim() === "") {
        errors.relation_name = isTamil
          ? "மணமகனுடன் / மணமகளுடன் உள்ள உறவு கட்டாயம் உள்ளிடவும்."
          : "Relationship to Bride/Groom cannot be empty.";
      }
    }


    setErrorMessage("");
    // If there are validation errors, show error messages and stop submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setErrorMessage("Please fix the highlighted errors.");

      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100); // Small delay to wait for state update

      return;
    }

    setErrorMessage(""); // Clear message if validation passes

    // Reset errors if validation passes
    setFormErrors({});

    // Prepare the FormData for upload
    for (const [key, value] of Object.entries(formData)) {
      const excludedKeys = ["profile_photo", "photo1", "photo2", "photo3", "photo4", "horoscope", "profile_creator_photo"];
      if (!excludedKeys.includes(key)) {
        formData_upload.append(key, value != null ? value.toString() : "");
      }
    }

    if (profilePic) formData_upload.append("profile_photo", profilePic);
    if (photo1) formData_upload.append("photo1", photo1);
    if (photo2) formData_upload.append("photo2", photo2);
    if (photo3) formData_upload.append("photo3", photo3);
    if (photo4) formData_upload.append("photo4", photo4);
    if (horoscope) formData_upload.append("horoscope", horoscope);
    if (profileCreatorPic) formData_upload.append("profile_creator_photo", profileCreatorPic);
    setSuccessMessage("");
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        body: formData_upload,
      });

      if (!res.ok) {
        throw new Error("Failed to Update user data.");
      }



      setSuccessMessage(
        lang == 'ta'
          ? "சுயவிவரம் புதுப்பிக்கப்பட்டது!."
          : "Profile updated successfully!."
      );

      // Redirect
      router.push(`/dashboard`);

    } catch (err) {
      setError(err.message);
      toast.error('Failed to update User', {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
    }
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(""); // Clear the message after 5 seconds
      }, 5000);

      return () => clearTimeout(timer); // Cleanup timer when component unmounts or message changes
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(""); // Clear the message after 5 seconds
      }, 5000);

      return () => clearTimeout(timer); // Cleanup timer when component unmounts or message changes
    }
  }, [successMessage]);


  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="bg-light text-white py-8" >
          <div className="container mx-auto flex flex-col items-center" ref={errorRef} >
            {/* Show profile update success message */}
            {successMessage && (
              <div className="bg-green-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600 mb-6">
                <p>{successMessage}</p>
              </div>
            )}
            {/* Show profile update error message */}
            {errorMessage && (
              <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
                <p>{errorMessage}</p>
              </div>
            )}
            {lang == 'ta' && (<p className="text-sm font-medium dark-text mb-4">Please fill the form in english&nbsp;<span className="text-meta-1">*</span></p>)}
            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 mt-5 views">

                <div className="flex flex-col gap-9">

                  {/* <!-- Reference start --> */}
                  <div className="rounded-sm border border-1 bg-light shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium dark-text dark:text-white">
                        {lang === 'ta' ? 'சுயவிவரத்தை உருவாக்கியவர் விவரங்கள்' : 'Profile Creator Details'}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">

                      <div className="mb-4.5 text-black">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'யாருக்காக கணக்கு உருவாக்கப்பட்டது ?' : 'Profile created for'} <span className="text-meta-1">*</span>
                        </label>
                        <RadioButtonGroup
                          name="profile_created_for"
                          options={profileOptions}
                          selectedValue={formData.profile_created_for}
                          onChange={handleChange}
                        />
                        {formErrors?.profile_created_for && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.profile_created_for}</p>
                        )}
                      </div>

                      {profileCreator && (
                        <>
                          <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                              {lang === 'ta' ? 'உருவாக்குநரின் பெயர்' : 'Creator Name'} <span className="text-meta-1">*</span>
                            </label>
                            <input
                              type="text"
                              name="profile_creator_name"
                              value={formData.profile_creator_name || ""}
                              onChange={handleChange}
                              placeholder={lang === 'ta' ? 'உருவாக்குநரின் பெயரை உள்ளிடவும்' : 'Enter Profile Creator Name'}
                              className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition bg-transparent dark-text ${formErrors?.profile_creator_name
                                ? "border-red-500 focus:border-red-500"
                                : "border-stroke focus:border-primary"
                                } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                            />
                            {formErrors?.profile_creator_name && (
                              <p className="mt-1 text-sm text-red-500">{formErrors.profile_creator_name}</p>
                            )}
                          </div>
                        </>
                      )}

                      {formData.profile_created_for == 'others' && (
                        < div className="mb-4">
                          <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                            {lang == 'ta' ? 'மணமகனுடன் / மணமகளுடன் உள்ள உறவு' : 'Relationship to Bride/Groom'} <span className="text-meta-1">*</span>
                          </label>
                          <input
                            type="text"
                            name="relation_name"
                            value={formData.relation_name}
                            onChange={handleChange}
                            placeholder={lang == 'ta' ? 'மணமகனுடன் / மணமகளுடன் உள்ள உறவு' : 'Relationship to Bride/Groom'}
                            className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition bg-transparent dark-text ${formErrors?.relation_name
                              ? "border-red-500 focus:border-red-500"
                              : "border-stroke focus:border-primary"
                              } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                          />
                          {formErrors.relation_name && (
                            <p className="text-red-600 text-sm">{formErrors.relation_name}</p>
                          )}
                        </div>
                      )}

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          readOnly
                          placeholder={lang === 'ta' ? 'மின்னஞ்சல்' : 'Enter your email address'}
                          className=" list-text w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark"
                        />
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-1 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'} <span><b className="no_text">{lang === 'ta' ? '(மணமகன்/மணமகளின் எண்களை குறிப்பிட வேண்டாம்.)' : "(Don't mention the bride/groom's phone number.)"}</b></span> <span className="text-meta-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="phonenumber"
                          value={formData.phonenumber || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'தொலைபேசி எண்' : 'Enter your phone number'}
                          className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition bg-transparent dark-text ${formErrors?.phonenumber
                            ? "border-red-500 focus:border-red-500"
                            : "border-stroke focus:border-primary"
                            } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                        />
                        {formErrors?.phonenumber && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.phonenumber}</p>
                        )}
                      </div>

                      {profileCreator && (
                        <>
                          <div className="mb-4.5">
                            <ImageUpload
                              name="profile_creator_photo"
                              label={lang === 'ta' ? 'உருவாக்குநரின் புகைப்படம்' : 'Profile creator picture'}
                              formData={formData}
                              formErrors={formErrors}
                              handleChange={handleChange}
                              required={true}
                            />
                          </div>

                          <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                              {lang === 'ta' ? 'ஆதார் எண்' : 'Creator Aadhar Number'} <span className="text-meta-1">*</span>
                            </label>
                            <input
                              type="text"
                              name="profile_creator_aadhar"
                              value={formData.profile_creator_aadhar || ""}
                              onChange={handleChange}
                              placeholder={lang === 'ta' ? 'உங்கள் ஆதார் எண்ணை உள்ளிடவும்' : 'Enter your Aadhar Number'}
                              className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition bg-transparent dark-text ${formErrors?.profile_creator_aadhar
                                ? "border-red-500 focus:border-red-500"
                                : "border-stroke focus:border-primary"
                                } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                            />
                            {formErrors?.profile_creator_aadhar && (
                              <p className="mt-1 text-sm text-red-500">{formErrors.profile_creator_aadhar}</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* <!-- Reference end--> */}


                  {/* <!-- Groom / Bride Details start --> */}
                  <div className="rounded-sm border border-1 bg-light shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium dark-text dark:text-white">
                        {lang === 'ta' ? 'மணமகன் / மணமகளின் விவரங்கள்' : 'Groom / Bride Details'}
                      </h3>
                    </div>
                    <div className="p-6.5">

                      <div className="mb-6.5">
                        <ImageUpload
                          name="profile_photo"
                          label={lang === 'ta' ? 'ப்ரொஃபைல் புகைப்படம்' : 'Profile Picture'}
                          formData={formData}
                          formErrors={formErrors}
                          handleChange={handleChange}
                          required={true}
                        />
                      </div>

                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row ">
                        <div className="w-full xl:w-1/2">
                          <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                            {lang === 'ta' ? 'முதல் பெயர்' : 'First Name'} <span className="text-meta-1">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleChange}
                            placeholder={lang === 'ta' ? 'முதல் பெயரை உள்ளிடவும்' : 'Enter your first name'}
                            className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition bg-transparent dark-text ${formErrors?.name
                              ? "border-red-500 focus:border-red-500"
                              : "border-stroke focus:border-primary"
                              } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                          />
                          {formErrors?.name && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                          )}
                        </div>

                        <div className="w-full xl:w-1/2">
                          <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                            {lang === 'ta' ? 'கடைசி பெயர்' : 'Last Name'} <span className="text-meta-1">*</span>
                          </label>
                          <input
                            type="text"
                            name="lastname"
                            value={formData.lastname || ""}
                            onChange={handleChange}
                            placeholder={lang === 'ta' ? 'கடைசி பெயரை உள்ளிடவும்' : 'Enter your last name'}
                            className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition bg-transparent dark-text ${formErrors?.lastname
                              ? "border-red-500 focus:border-red-500"
                              : "border-stroke focus:border-primary"
                              } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                          />
                          {formErrors?.lastname && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.lastname}</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'மணமகன் / மணமகள் பற்றிய விவரம்' : 'Detail about (Bride / Groom)'} <span className="text-meta-1">*</span>
                        </label>
                        <textarea
                          rows={6}
                          name="bride_groom_detail"
                          value={formData.bride_groom_detail || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'விவரங்களை உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                        ></textarea>
                        {formErrors?.bride_groom_detail && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.bride_groom_detail}</p>
                        )}
                      </div>

                      <div className="mb-4.5 text-black">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'பாலினம்' : 'Gender of (Bride / Groom)'} <span className="text-meta-1">*</span>
                        </label>
                        <RadioButtonGroup
                          name="gender"
                          options={genderOptions}
                          selectedValue={formData.gender}
                          onChange={handleChange}
                        />
                        {formErrors?.gender && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>
                        )}
                      </div>

                      <div className="mb-4.5 text-black">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'திருமண நிலை' : 'Marital Status'} <span className="text-meta-1">*</span>
                        </label>
                        <RadioButtonGroup
                          name="maritalstatus"
                          options={maritalstatusOptions}
                          selectedValue={formData.maritalstatus}
                          onChange={handleChange}
                        />
                        {formErrors?.maritalstatus && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.maritalstatus}</p>
                        )}
                      </div>

                      <div className="mb-4.5 text-black">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'யாரை தேடுகிறீர்கள்' : 'Looking For'} <span className="text-meta-1">*</span>
                        </label>
                        <RadioButtonGroup
                          name="lookingfor"
                          options={lookingforOptions}
                          selectedValue={formData.lookingfor}
                          onChange={handleChange}
                        />
                        {formErrors?.lookingfor && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.lookingfor}</p>
                        )}
                      </div>

                      {/* Religion & caste */}
                      <div className="text-black">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'மதம்' : 'Religion'}
                        </label>
                        <SelectGroupReligion
                          religions={religions}
                          name="religion"
                          selectedReligion={formData.religion}
                          onReligionChange={(e) =>
                            setFormData({ ...formData, religion: e.target.value })
                          }
                        />
                      </div>

                      <div className="text-black">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'சாதி' : 'Caste'}
                        </label>
                        <SelectGroupCaste
                          castes={castes}
                          name="caste"
                          selectedcaste={formData.caste}
                          oncasteChange={(e) =>
                            setFormData({ ...formData, caste: e.target.value })
                          }
                        />
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'முதலியார் உட்சாதி' : 'Subcaste in Mudaliyar'}
                        </label>
                        <input
                          type="text"
                          name="subcaste"
                          value={formData.subcaste || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'உட்சாதி உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div className="text-black">
                        <DatePickerOne
                          dateFormat="dd-MM-yyyy"
                          placeholder={lang === 'ta' ? 'பிறந்த தேதியை தேர்வு செய்யவும்' : 'Select your birth date'}
                          value={formData.birthdate}
                          onChange={(selectedDate) => {
                            if (selectedDate) {
                              const dateObject = new Date(selectedDate);
                              const localISODate = dateObject.toISOString().split("T")[0];
                              const today = new Date();
                              let age = today.getFullYear() - dateObject.getFullYear();
                              const isBeforeBirthday =
                                today.getMonth() < dateObject.getMonth() ||
                                (today.getMonth() === dateObject.getMonth() && today.getDate() < dateObject.getDate());
                              if (isBeforeBirthday) {
                                age -= 1;
                              }
                              setFormData((prevData) => ({
                                ...prevData,
                                birthdate: localISODate,
                                age: age,
                              }));
                              setError(age < 18 ? (lang === 'ta' ? "வயது குறைந்தது 18 இருக்க வேண்டும்." : "Age must be at least 18 years.") : "");
                            }
                          }}
                        />
                        {formErrors?.birthdate && <p className="mt-1 text-sm text-red-500">{formErrors.birthdate}</p>}
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'வயது' : 'Age'}
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age || ""}
                          readOnly
                          placeholder={lang === 'ta' ? 'வயது தானாக கணக்கிடப்படும்' : 'Your age will be calculated automatically'}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'பிறந்த இடம்' : 'Place of birth'}
                        </label>
                        <input
                          type="text"
                          name="place_of_birth"
                          value={formData.place_of_birth || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'பிறந்த இடத்தை உள்ளிடவும்' : 'Place of birth'}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'கூடுதல் தொலைபேசி எண்' : 'Additional Phone Number'}
                        </label>
                        <input
                          type="text"
                          name="profile_creator_phonenumber"
                          value={formData.profile_creator_phonenumber || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'தொலைபேசி எண்' : 'Enter additional phone number'}
                          className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition bg-transparent dark-text ${formErrors?.profile_creator_phonenumber
                            ? "border-red-500 focus:border-red-500"
                            : "border-stroke focus:border-primary"
                            } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                        />
                        {formErrors?.profile_creator_phonenumber && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.profile_creator_phonenumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <!-- Groom / Bride Details end --> */}


                  {/* <!-- Other Details start--> */}
                  <div className="rounded-sm border border-1 bg-light shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium dark-text dark:text-white">
                        {lang === 'ta' ? 'பிற விவரங்கள்' : 'Other Details'}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">

                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'மணமகன்/மணமகளின் கல்வி' : 'Education of Groom / Bride'}
                        </label>
                        <input
                          type="text"
                          name="education"
                          value={formData.education || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'கல்வியை உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'மணமகனின்/மணமகளின் தோற்றம் (கருப்பு, மாநிறம், அல்லது வெள்ளை)' : 'Complexion of Groom/Bride: (Dark, Wheatish, or Fair)'}
                        </label>
                        <input
                          type="text"
                          name="complexion"
                          value={formData.complexion || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'தோற்றத்தை உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'தொழில்' : 'Profession'}
                        </label>
                        <input
                          type="text"
                          name="profession"
                          value={formData.profession || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'தொழிலை உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'வருமானம்' : 'Income'}
                        </label>
                        <input
                          type="text"
                          name="income"
                          value={formData.income || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'வருமானத்தை உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'மணமகன்/மணமகளின் வேலை (நிறுவனம், வேலை வகை)' : 'Job of Groom / Bride  (Company, job etc)'}
                        </label>
                        <input
                          type="text"
                          name="job"
                          value={formData.job || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'வேலை விவரங்களை உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'வேலை செய்யும் இடம்' : 'Place of work'}
                        </label>
                        <input
                          type="text"
                          name="place_of_work"
                          value={formData.place_of_work || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'வேலை இடத்தை உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'குலதெய்வம்' : 'Kuladeivam'}
                        </label>
                        <input
                          type="text"
                          name="kuladeivam"
                          value={formData.kuladeivam || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'குலதெய்வத்தை உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'குலதெய்வக் கோவிலின் இடம்' : 'Place of Kuladeivam temple'}
                        </label>
                        <input
                          type="text"
                          name="place_of_kuladeivam_temple"
                          value={formData.place_of_kuladeivam_temple || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'கோவிலின் இடத்தை உள்ளிடவும்' : ''}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'கோத்திரம்' : 'Gothram'} <span className="text-meta-1">*</span>
                        </label>
                        <input
                          type="text"
                          name="gothram"
                          value={formData.gothram || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? 'கோத்திரத்தை உள்ளிடவும்' : ''}
                          className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition bg-transparent dark-text ${formErrors?.gothram
                            ? "border-red-500 focus:border-red-500"
                            : "border-stroke focus:border-primary"
                            } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                        />
                        {formErrors?.gothram && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.gothram}</p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* <!-- Other Details end --> */}


                  {/* <!-- horoscope upload start --> */}
                  <div className="rounded-sm border border-1 bg-light shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium dark-text dark:text-white">
                        {lang === 'ta' ? 'ஜாதகத்தை பதிவேற்றுக' : 'Horoscope Upload'}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                      <FileUpload
                        name="horoscope"
                        handleChange={handleChange}
                      />
                      {formData.horoscope && (
                        <button
                          type="button"
                          onClick={handlePreview}
                          style={{ width: "200px", padding: "8px 0" }}
                          className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 text-custom"
                        >
                          {lang === 'ta' ? 'ஜாதகத்தை பார்க்க' : 'Preview'}
                        </button>
                      )}
                    </div>
                  </div>
                  {/* <!-- horoscope upload end--> */}


                  {/* <!-- Reference start --> */}
                  <div className="rounded-sm border border-1 bg-light shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium dark-text dark:text-white">
                        {lang === 'ta' ? 'பரிந்துரையாளர் விவரங்கள்' : 'Referral Details'}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'பரிந்துரையாளர் 1' : 'Referrer 1'}
                        </label>
                        <input
                          type="text"
                          name="reference1"
                          value={formData.reference1 || ""}
                          onChange={handleChange}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'பரிந்துரையாளர் 2' : 'Referrer 2'}
                        </label>
                        <input
                          type="text"
                          name="reference2"
                          value={formData.reference2 || ""}
                          onChange={handleChange}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                  {/* <!-- Reference end--> */}

                </div>



                <div className="flex flex-col gap-9">

                  {/* <!-- Parents Details start--> */}
                  <div className="rounded-sm border border-1 bg-light shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium dark-text dark:text-white">
                        {lang === 'ta' ? 'பெற்றோர் விவரங்கள்' : 'Parents Details'}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                      {/* Father's Name */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அப்பாவின் பெயர்" : "Father's Name"}
                        </label>
                        <input
                          type="text"
                          name="father_name"
                          value={formData.father_name || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "அப்பாவின் பெயர் உள்ளிடவும்" : "Enter Father's Name"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {/* Father's Phone Number */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அப்பாவின் தொலைபேசி எண்" : "Father's Phone Number"}
                        </label>
                        <input
                          type="text"
                          name="father_phonenumber"
                          value={formData.father_phonenumber || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "தொலைபேசி எண்" : "Enter Father's Phone Number"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {/* Father's Occupation */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அப்பாவின் தொழில்" : "Father's Occupation"}
                        </label>
                        <input
                          type="text"
                          name="father_occupation"
                          value={formData.father_occupation || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "தொழிலை உள்ளிடவும்" : "Enter Father's Occupation"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {/* Father's Religion */}
                      <div className="text-black">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அப்பாவின் மதம்" : "Father's Religion"}
                        </label>
                        <SelectGroupReligion
                          religions={freligions}
                          name="father_religion"
                          selectedReligion={formData.father_religion}
                          onReligionChange={(e) =>
                            setFormData({ ...formData, father_religion: e.target.value })
                          }
                        />
                      </div>

                      {/* Father's Profession */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அப்பாவின் தொழில்முறை" : "Father's Profession"}
                        </label>
                        <input
                          type="text"
                          name="father_profession"
                          value={formData.father_profession || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "தொழில்முறையை உள்ளிடவும் " : "Enter Father's Profession"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {/* Father's Place of Work */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அப்பாவின் வேலை இடம்" : "Father's place of work"}
                        </label>
                        <input
                          type="text"
                          name="father_placeOfWork"
                          value={formData.father_placeOfWork || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "வேலை இடத்தை உள்ளிடவும்" : "Enter Father's Place of Work"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {/* Mother's Name */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அம்மாவின் பெயர்" : "Mother's Name"}
                        </label>
                        <input
                          type="text"
                          name="mother_name"
                          value={formData.mother_name || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "அம்மாவின் பெயரை உள்ளிடவும்" : "Enter Mother's Name"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {/* Mother's Phone Number */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அம்மாவின் தொலைபேசி எண்" : "Mother's Phone Number"}
                        </label>
                        <input
                          type="text"
                          name="mother_phonenumber"
                          value={formData.mother_phonenumber || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "தொலைபேசி எண் உள்ளிடவும்" : "Enter Mother's Phone Number"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {/* Mother's Occupation */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அம்மாவின் தொழில்" : "Mother's Occupation"}
                        </label>
                        <input
                          type="text"
                          name="mother_occupation"
                          value={formData.mother_occupation || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "அம்மாவின் தொழிலை உள்ளிடவும்" : "Enter Mother's Occupation"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {/* Mother's Religion */}
                      <div className="text-black">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அம்மாவின் மதம்" : "Mother's Religion"}
                        </label>
                        <SelectGroupReligion
                          religions={freligions}
                          name="mother_religion"
                          selectedReligion={formData.mother_religion}
                          onReligionChange={(e) =>
                            setFormData({ ...formData, mother_religion: e.target.value })
                          }
                        />
                      </div>

                      {/* Mother's Profession */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அம்மாவின் தொழில்முறை" : "Mother's Profession"}
                        </label>
                        <input
                          type="text"
                          name="mother_profession"
                          value={formData.mother_profession || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "அம்மாவின் தொழில்முறையை உள்ளிடவும்" : "Enter Mother's Profession"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>

                      {/* Mother's Place of Work */}
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? "அம்மாவின் வேலை இடம்" : "Mother's place of work"}
                        </label>
                        <input
                          type="text"
                          name="mother_placeOfWork"
                          value={formData.mother_placeOfWork || ""}
                          onChange={handleChange}
                          placeholder={lang === 'ta' ? "அம்மாவின் வேலை இடத்தை உள்ளிடவும்" : "Enter Mother's Place of Work"}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                  {/* <!-- Parents Details end--> */}

                  {/* <!-- Location upload start--> */}
                  <div className="rounded-sm border border-stroke  shadow-default dark:border-strokedark dark-text">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium dark-text dark:text-white">
                        {lang === 'ta' ? 'இடம் விவரங்கள்' : 'Location Details'}
                      </h3>
                    </div>
                    <div className="p-6.5">

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'நாடு' : 'Country'} <span className="text-meta-1">*</span>
                        </label>
                        <SelectGroupCountries
                          selectedCountry={selectedCountry}
                          onCountryChange={handleCountryChange}
                        />
                        {formErrors?.country_id && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.country_id}</p>
                        )}
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'மாநிலம்' : 'State'} <span className="text-meta-1">*</span>
                        </label>
                        <SelectGroupStates
                          selectedCountry={selectedCountry}
                          selectedState={selectedState}
                          onStateChange={handleStateChange}
                        />
                        {formErrors?.state_id && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.state_id}</p>
                        )}
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'நகரம்' : 'City'} <span className="text-meta-1">*</span>
                        </label>
                        <SelectGroupCities
                          selectedState={selectedState}
                          selectedCity={selectedCity}
                          onCityChange={handleCityChange}
                        />
                        {formErrors?.city_id && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.city_id}</p>
                        )}
                      </div>

                      <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'முகவரி' : 'Address'} <span className="text-meta-1">*</span>
                        </label>
                        <textarea
                          rows={6}
                          name="address"
                          value={formData.address || ""}
                          onChange={handleChange}
                          className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition dark-text ${formErrors?.email
                            ? "border-red-500 focus:border-red-500"
                            : "border-stroke focus:border-primary"
                            } dark:border-form-strokedark dark:bg-form-input dark:text-white bg-transparent`}
                        ></textarea>
                        {formErrors?.address && (
                          <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>
                        )}
                      </div>

                    </div>
                  </div>
                  {/* <!-- Location upload end--> */}


                  {/* <!-- Partner Preference  start --> */}
                  <div className="rounded-sm border border-1 bg-light shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium dark-text dark:text-white">
                        {lang === 'ta' ? 'திருமண இணை எதிர்பார்ப்பு' : 'Partner Preference'}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-5.5 p-6.5">
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'கல்வி' : 'Education'}
                        </label>
                        <input
                          type="text"
                          name="partner_pref_education"
                          value={formData.partner_pref_education || ""}
                          onChange={handleChange}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'வயது' : 'Age'}
                        </label>
                        <input
                          type="number"
                          name="partner_pref_age"
                          value={formData.partner_pref_age || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({ ...formData, partner_pref_age: value });
                            if (parseInt(value) < 18) {
                              setError("Age must be at least 18 years.");
                            } else {
                              setError("");
                            }
                          }}
                          placeholder={lang === 'ta' ? 'வயது' : 'Enter age'}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                      <div className="text-black">
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'சாதி' : 'Caste'}
                        </label>
                        <SelectGroupCaste
                          castes={castes}
                          name="partner_pref_caste"
                          selectedcaste={formData.partner_pref_caste}
                          oncasteChange={(e) =>
                            setFormData({ ...formData, partner_pref_caste: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                          {lang === 'ta' ? 'முதலியார் உட்சாதி' : 'Subcaste in Mudaliyar'}
                        </label>
                        <input
                          type="text"
                          name="partner_pref_subcaste"
                          value={formData.partner_pref_subcaste || ""}
                          onChange={handleChange}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                  {/* <!-- Partner Preference end --> */}


                  {/* <!-- Photo upload start --> */}
                  <div className="rounded-sm border border-1 bg-light shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                      <h3 className="font-medium dark-text dark:text-white">
                        {lang === 'ta' ? 'கூடுதல் படங்கள்' : 'Additional  Pictures'}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-5.5 p-6.5">

                      <div className="mb-4.5">
                        <ImageUpload
                          name="photo1"
                          label=""
                          formData={formData}
                          formErrors={formErrors}
                          handleChange={handleChange}
                        />
                      </div>

                      <div className="mb-4.5">
                        <ImageUpload
                          name="photo2"
                          label=""
                          formData={formData}
                          formErrors={formErrors}
                          handleChange={handleChange}
                        />
                      </div>

                      <div className="mb-4.5">
                        <ImageUpload
                          name="photo3"
                          label=""
                          formData={formData}
                          formErrors={formErrors}
                          handleChange={handleChange}
                        />
                      </div>

                      <div className="mb-4.5">
                        <ImageUpload
                          name="photo4"
                          label=""
                          formData={formData}
                          formErrors={formErrors}
                          handleChange={handleChange}
                        />
                      </div>

                    </div>
                  </div>
                  {/* <!-- Photo upload end--> */}

                  <div className="text-right">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 text-custom"
                    >
                      {lang == 'ta' ? 'சமர்ப்பிக்கவும் ' : 'Submit'}
                    </button>

                  </div>
                </div>


              </div>
              {error && <p className="mt-4 text-red-500">{error}</p>}
            </form >
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
