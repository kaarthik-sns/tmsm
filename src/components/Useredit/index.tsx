"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/UserBreadcrumb";
import SelectGroupReligion from "@/components/SelectGroup/SelectGroupReligion";
import SelectGroupStates from "@/components/SelectGroup/SelectGroupStates";
import SelectGroupCities from "@/components/SelectGroup/SelectGroupCities";
import SelectGroupCaste from "@/components/SelectGroup/SelectGroupCaste";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { toast } from "sonner";
import NextImage from "next/image";
import RadioButtonGroup from "@/components/RadioButtonGroup/RadioButtonTwo";
import { useRouter, useSearchParams } from "next/navigation";

const FormElements = () => {

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
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

  const router = useRouter();


  // Array for religions
  const religions = [
    "Hindu",
  ];

  const freligions = [
    "Hindu",
    "Muslim",
    "Christian"
  ];
  // Array for castes
  const castes = [
    "Mudaliyar"
  ];

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    religion: "",
    caste: "",
    subcaste: "",
    email: "",
    phonenumber: "",
    birthdate: "",
    age: 0,
    state_id: "",
    city_id: "",
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
    partner_pref_age: "",
    partner_pref_education: "",
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
    partner_pref_subcaste: "",
    gender: "",
    bride_groom_detail: ""
  });
  // Set selected state and city based on formData
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value;
    setSelectedState(newState);
    setFormData({ ...formData, state_id: newState, city_id: "" }); // Reset city when state changes
    setSelectedCity("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = event.target.value;
    setSelectedCity(newCity);
    setFormData({ ...formData, city_id: newCity });
  };
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/get-user-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }

          const { data } = await response.json();
          console.log("data----", data);
          setFormData(data);
          setSelectedState(data.state_id);
          setSelectedCity(data.city_id);
          if (data?.profile_created_for != 'myself') {
            setProfileCreator(true);
          }

          setProfilePic(data.profile_photo);
          setPhoto1(data.photo1);
          setPhoto2(data.photo2);
          setPhoto3(data.photo3);
          setPhoto4(data.photo4);
          setProfileCreatorPic(data.profile_creator_photo);
          setHoroscope(data.horoscope);

        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId]);

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

    if (!formData.bride_groom_detail || formData.bride_groom_detail.trim() === "") {
      errors.bride_groom_detail = "Fill about short deatils.";
    }

    if (!formData.gender || formData.gender.trim() === "") {
      errors.gender = "Gender for is required.";
    }

    if (!formData.name || formData.name.trim() === "") {
      errors.name = "First name is required.";
    }

    if (!formData.lastname || formData.lastname.trim() === "") {
      errors.lastname = "Last name is required.";
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "A valid email is required.";
    }

    if (!formData.phonenumber || !/^\d{10}$/.test(formData.phonenumber)) {
      errors.phonenumber = "A valid 10-digit phone number is required.";
    }

    if (!formData.name || formData.name.trim() === "") {
      errors.name = "First name is required.";
    }

    if (!formData.profile_photo || formData.profile_photo.trim() === "") {
      errors.profile_photo = "Profile Photo is required.";
    }

    if (!formData.birthdate || formData.birthdate.trim() === "") {
      errors.birthdate = "Date Of Birth is required.";
    }

    if (!formData.maritalstatus || formData.maritalstatus.trim() === "") {
      errors.maritalstatus = "Marital Status is required.";
    }

    if (!formData.profile_created_for || formData.profile_created_for.trim() === "") {
      errors.profile_created_for = "Profile created for is required.";
    }

    if (!formData.state_id) {
      errors.state_id = "State is required.";
    }
    if (!formData.city_id) {
      errors.city_id = "City is required.";
    }

    if (!formData.address) {
      errors.address = "Address is required.";
    }

    if (!formData.lookingfor || formData.lookingfor.trim() === "") {
      errors.lookingfor = "Looking for is required.";
    }

    if (formData.profile_created_for != 'myself') {

      if (!formData.profile_creator_name || formData.profile_creator_name.trim() === "") {
        errors.profile_creator_name = "Name is required.";
      }

      if (!formData.profile_creator_photo || formData.profile_creator_photo.trim() === "") {
        errors.profile_creator_photo = "Picture is required.";
      }

      if (!formData.profile_creator_aadhar || formData.profile_creator_aadhar.trim() === "") {
        errors.profile_creator_aadhar = "Aadhar number is required.";
      }

      if (!formData.profile_creator_phonenumber || formData.profile_creator_phonenumber.trim() === "") {
        errors.profile_creator_phonenumber = "Phone number is required.";
      }
    }

    // If there are validation errors, show error messages and stop submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); // Assume `setError` updates the UI to display error messages
      toast.error('Please fix the highlighted errors.', {
        className: "sonner-toast-error",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });
      return;
    }

    // Reset errors if validation passes
    setFormErrors({});

    // Prepare the FormData for upload
    for (const [key, value] of Object.entries(formData)) {
      const excludedKeys = ["profile_photo", "photo1", "photo2", "photo3", "photo4", "horoscope", "profile_creator_photo"];
      if (!excludedKeys.includes(key)) {
        if (typeof value === "number") {
          formData_upload.append(key, value.toString());
        } else {
          formData_upload.append(key, value);
        }
      }
    }
    console.log("formData_upload", formData);
    if (profilePic) formData_upload.append("profile_photo", profilePic);
    if (photo1) formData_upload.append("photo1", photo1);
    if (photo2) formData_upload.append("photo2", photo2);
    if (photo3) formData_upload.append("photo3", photo3);
    if (photo4) formData_upload.append("photo4", photo4);
    if (horoscope) formData_upload.append("horoscope", horoscope);
    if (profileCreatorPic) formData_upload.append("profile_creator_photo", profileCreatorPic);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        body: formData_upload,
      });

      if (!res.ok) {
        throw new Error("Failed to Update user data.");
      }

      toast.success('User updated successfully!', {
        className: "sonner-toast-success",
        cancel: {
          label: 'Close',
          onClick: () => console.log('Close'),
        },
      });

      // Redirect
      router.push(`/admin/users/userlist`);

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

  const profileOptions = [
    { label: 'MySelf', value: 'myself' },
    { label: 'Daughter', value: 'daughter' },
    { label: 'Son', value: 'son' },
    { label: 'Others', value: 'others' },
  ];

  const maritalstatusOptions = [
    { label: 'Never Married', value: 'nevermarried' },
    { label: 'Widowed', value: 'widowed' },
    { label: 'Divorced', value: 'divorced' },
    { label: 'Awaiting Divorce', value: 'awaitingdivorce' },
  ];

  const lookingforOptions = [
    { label: 'Bride', value: 'bride' },
    { label: 'Groom', value: 'groom' },
  ];
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Breadcrumb pageName="Edit User" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">

            {/* <!-- Reference start --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Profile Creator Details
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Profile created for <span className="text-meta-1">*</span>
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
                    < div className="mb-4.5">
                      <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                        Name <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="profile_creator_name"
                        value={formData.profile_creator_name || ""}
                        onChange={handleChange}
                        placeholder="Enter Profile Creator Name"
                        className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.profile_creator_name
                          ? "border-red-500 focus:border-red-500"
                          : "border-stroke focus:border-primary"
                          } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                      />
                      {formErrors?.profile_creator_name && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.profile_creator_name}</p>
                      )}
                    </div>


                    <div className="mb-4.5">
                      <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                        Picture <span className="text-meta-1">*</span>
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                          {formData.profile_creator_photo && (
                            <NextImage
                              src={formData.profile_creator_photo || ""}
                              alt="Profile Creator Picture"
                              width={64}
                              height={64}
                              quality={100}
                              unoptimized={true}
                              className={`w-full h-full object-cover ${formErrors?.profile_creator_photo
                                ? "border-red-500 focus:border-red-500"
                                : "border-stroke focus:border-primary"
                                }`}
                            />
                          )}
                        </div>
                        <input
                          type="file"
                          name="profile_creator_photo"
                          accept="image/*"
                          onChange={handleChange}
                          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                        />
                      </div>
                      {formErrors?.profile_creator_photo && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.profile_creator_photo}</p>
                      )}
                    </div>


                    <div className="mb-4.5">
                      <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                        Aadhar Number <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="profile_creator_aadhar"
                        value={formData.profile_creator_aadhar || ""}
                        onChange={handleChange}
                        placeholder="Enter your Aadhar Number"
                        className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.profile_creator_aadhar
                          ? "border-red-500 focus:border-red-500"
                          : "border-stroke focus:border-primary"
                          } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                      />
                      {formErrors?.profile_creator_aadhar && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.profile_creator_aadhar}</p>
                      )}
                    </div>

                    <div className="mb-4.5">
                      <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                        Phone Number <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="profile_creator_phonenumber"
                        value={formData.profile_creator_phonenumber || ""}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.profile_creator_phonenumber
                          ? "border-red-500 focus:border-red-500"
                          : "border-stroke focus:border-primary"
                          } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                      />
                      {formErrors?.profile_creator_phonenumber && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.profile_creator_phonenumber}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Detail about groom / bride <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    rows={6}
                    name="bride_groom_detail"
                    value={formData.bride_groom_detail || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  ></textarea>
                  {formErrors?.bride_groom_detail && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.bride_groom_detail}</p>
                  )}
                </div>
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Gender <span className="text-meta-1">*</span>
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
              </div>
            </div>

            {/* <!-- Reference end--> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Groom / Bride Details
                </h3>
              </div>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Profile Picture <span className="text-meta-1">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                      {formData.profile_photo && (
                        <NextImage
                          src={formData.profile_photo || ""}
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          quality={100}
                          unoptimized={true}
                          className={`w-full h-full object-cover ${formErrors?.profile_photo
                            ? "border-red-500 focus:border-red-500"
                            : "border-stroke focus:border-primary"
                            }`}
                        />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      name="profile_photo"
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                  {formErrors?.profile_photo && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.profile_photo}</p>
                  )}
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      First Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.name
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
                      Last Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname || ""}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.lastname
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
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    readOnly
                    placeholder="Enter your email address"
                    className=" list-text w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Phone Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="phonenumber"
                    value={formData.phonenumber || ""}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.phonenumber
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  />
                  {formErrors?.phonenumber && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.phonenumber}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Marital Status <span className="text-meta-1">*</span>
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

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Looking For <span className="text-meta-1">*</span>
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

                {/* Render SelectGroupReligion with dynamic castes */}
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Religion
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
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Caste
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
                    SubCaste
                  </label>
                  <input
                    type="text"
                    name="subcaste"
                    value={formData.subcaste || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <DatePickerOne
                    dateFormat="d-m-Y" // Format for the date
                    placeholder="Select your birth date" // Placeholder for the date picker
                    value={formData.birthdate} // Pass the current value of birthDate from formData
                    onChange={(dates) => {
                      const selectedDate = dates[0];
                      if (selectedDate) {
                        const birthDate = new Date(selectedDate);
                        // Format the date manually to avoid timezone issues
                        const localISODate = `${birthDate.getFullYear()}-${String(
                          birthDate.getMonth() + 1
                        ).padStart(2, "0")}-${String(birthDate.getDate()).padStart(2, "0")}`;

                        const today = new Date();
                        const age = today.getFullYear() - birthDate.getFullYear();
                        const isBeforeBirthday =
                          today.getMonth() < birthDate.getMonth() ||
                          (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

                        const calculatedAge = isBeforeBirthday ? age - 1 : age;

                        setFormData((prevData) => ({
                          ...prevData,
                          birthdate: localISODate, // Use the manually formatted local date
                          age: calculatedAge, // Update the age dynamically
                        }));

                        if (calculatedAge < 18) {
                          setError("Age must be at least 18 years.");
                        } else {
                          setError("");
                        }
                      }

                    }}
                  />
                  {formErrors?.birthdate && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.birthdate}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ""} // Display the calculated age
                    readOnly // Make this input read-only since it's calculated
                    placeholder="Your age will be calculated automatically"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Place of birth
                  </label>
                  <input
                    type="text"
                    name="place_of_birth"
                    value={formData.place_of_birth || ""}
                    onChange={handleChange}
                    placeholder="Place of birth"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Location Details
                </h3>
              </div>
              <div className="p-6.5">

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    State <span className="text-meta-1">*</span>
                  </label>
                  <SelectGroupStates
                    selectedState={selectedState}
                    onStateChange={handleStateChange}
                  />
                  {formErrors?.state_id && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.state_id}</p>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    City <span className="text-meta-1">*</span>
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

                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Address <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    rows={6}
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className={`w-full rounded border-[1.5px] px-5 py-3 outline-none transition ${formErrors?.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-stroke focus:border-primary"
                      } dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                  ></textarea>
                  {formErrors?.address && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>
                  )}
                </div>

              </div>
            </div>

            {/* <!-- Other Details --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Other Details
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">

                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Education for Groom / Bride
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Complexation for Groom / Bride (Dark/Wheat/Fair)
                  </label>
                  <input
                    type="text"
                    name="complexion"
                    value={formData.complexion || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Profession
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Income
                  </label>
                  <input
                    type="text"
                    name="income"
                    value={formData.income || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Job of Groom / Bride  (Company, job etc)
                  </label>
                  <input
                    type="text"
                    name="job"
                    value={formData.job || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Place of work
                  </label>
                  <input
                    type="text"
                    name="place_of_work"
                    value={formData.place_of_work || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Kuladeivam
                  </label>
                  <input
                    type="text"
                    name="kuladeivam"
                    value={formData.kuladeivam || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Place of Kuladeivam temple
                  </label>
                  <input
                    type="text"
                    name="place_of_kuladeivam_temple"
                    value={formData.place_of_kuladeivam_temple || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Gothram
                  </label>
                  <input
                    type="text"
                    name="gothram"
                    value={formData.gothram || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

              </div>
            </div>

            {/* <!-- horoscope upload start --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Horoscope Upload
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  name="horoscope"
                  onChange={handleChange}
                  className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                />
                {formData.horoscope && (
                  <button
                    onClick={handlePreview} style={{ width: "200px", padding: "8px 0" }}
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 text-custom"
                  >
                    Preview
                  </button>
                )
                }
              </div>
            </div>
            {/* <!-- horoscope upload end--> */}

            {/* <!-- Reference start --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Reference Details
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Reference 1
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
                    Reference 2
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
            {/* <!-- Parents Details --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Parents Details
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Father's Phone Number
                  </label>
                  <input
                    type="text"
                    name="father_phonenumber"
                    value={formData.father_phonenumber || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Father's Occupation
                  </label>
                  <input
                    type="text"
                    name="father_occupation"
                    value={formData.father_occupation || ""}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Father's Religion
                  </label>
                  {/* Render SelectGroupReligion with dynamic castes */}
                  <SelectGroupReligion
                    religions={freligions}
                    name="father_religion"
                    selectedReligion={formData.father_religion}
                    onReligionChange={(e) =>
                      setFormData({ ...formData, father_religion: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Father's Profession
                  </label>
                  <input
                    type="text"
                    name="father_profession"
                    value={formData.father_profession || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Father's place of work

                  </label>
                  <input
                    type="text"
                    name="father_placeOfWork"
                    value={formData.father_placeOfWork || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    name="mother_name"
                    value={formData.mother_name || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Mother's Phone Number
                  </label>
                  <input
                    type="text"
                    name="mother_phonenumber"
                    value={formData.mother_phonenumber || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Mother's Occupation
                  </label>
                  <input
                    type="text"
                    name="mother_occupation"
                    value={formData.mother_occupation || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Mother's Religion
                  </label>
                  {/* Render SelectGroupReligion with dynamic castes */}
                  <SelectGroupReligion
                    religions={freligions}
                    name="mother_religion"
                    selectedReligion={formData.mother_religion}
                    onReligionChange={(e) =>
                      setFormData({ ...formData, mother_religion: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Mother's Profession
                  </label>
                  <input
                    type="text"
                    name="mother_profession"
                    value={formData.mother_profession || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Mother's place of work

                  </label>
                  <input
                    type="text"
                    name="mother_placeOfWork"
                    value={formData.mother_placeOfWork || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
            </div>
            {/* <!-- Partner Preference  --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Partner Preference
                </h3>
              </div>
              <div className="flex flex-col gap-5.5 p-6.5">
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Education
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
                    Age
                  </label>
                  <input
                    type="number"
                    name="partner_pref_age"
                    value={formData.partner_pref_age || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, partner_pref_age: value });
                      if (parseInt(value as string) < 18) {
                        setError("Age must be at least 18 years.");
                      } else {
                        setError("");
                      }
                    }}
                    placeholder="Enter your age"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Caste
                  </label>
                  <SelectGroupCaste
                    castes={castes}
                    name="partner_pref_caste"
                    selectedcaste={formData.caste}
                    oncasteChange={(e) =>
                      setFormData({ ...formData, caste: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    SubCaste
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

            {/* <!-- Photo upload start --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium dark-text dark:text-white">
                  Additional  Pictures
                </h3>
              </div>

              <div className="flex flex-col gap-5.5 p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Picture1
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                      {formData.photo1 && (
                        <NextImage
                          src={formData.photo1 || ""}
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          quality={100}
                          unoptimized={true}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      name="photo1"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Picture2
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                      {formData.photo2 && (
                        <NextImage
                          src={formData.photo2 || ""}
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          quality={100}
                          unoptimized={true}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      name="photo2"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Picture3
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                      {formData.photo3 && (
                        <NextImage
                          src={formData.photo3 || ""}
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          quality={100}
                          unoptimized={true}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      name="photo3"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                </div>


                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Picture4
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                      {formData.photo4 && (
                        <NextImage
                          src={formData.photo4 || ""}
                          alt="Profile Preview"
                          width={64}
                          height={64}
                          quality={100}
                          unoptimized={true}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      name="photo4"
                      onChange={handleChange}
                      className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:dark-text file:dark-text hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Photo upload end--> */}

            <div className="text-right">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 text-custom"
              >
                Submit
              </button>

            </div>
          </div>


        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form >
    </>
  );
};

export default FormElements;
