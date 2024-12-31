"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Updated import for query parameter extraction
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SelectGroupReligion from "@/components/SelectGroup/SelectGroupReligion";
import SelectGroupCaste from "@/components/SelectGroup/SelectGroupCaste";
import SelectGroupSubCaste from "@/components/SelectGroup/SelectGroupSubCaste ";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";
import NextImage from "next/image"; // Rename the import to avoid conflict

const FormElements = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [profilePic, setProfilePic] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    religion: "",
    caste: "",
    subcaste: "",
    birthdate: "",
    age: "",
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
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


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
          setFormData(data);
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
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setFormData((prevData) => ({ ...prevData, profile_photo: file }));
    }
  };

  // Array for religions
  const religions = [
    "Hindu",
    "Muslim",
    "Christian"
  ];
  // Array for castes
  const castes = [
    "Mudaliyar"
  ];

  // Array for Subcastes
  const subcastes = [
    "Mudaliyar"
  ];
 // Handle form submission to update user data
 const handleSubmit = async (e) => {
  e.preventDefault();
 
  try {
    const res = await fetch("/api/update-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData, // Include all form data
        id: userId,  // Pass the userId to the API to identify which user to update
        profile_photo: formData.profile_photo,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to update user data.");
    }

    const data = await res.json();
    toast.success("User updated successfully!");
  } catch (err) {
    setError(err.message);
    toast.error("Failed to update User");
  }
};

if (isLoading) {
  return <p>Loading...</p>;
}      
  return (
    <>
      <Breadcrumb pageName="Edit User" />
      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
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
            {profilePic && (
              <NextImage
                src={profilePic || ""}
                alt="Profile Preview"
                width={64}
                height={64}
                quality={100}
                unoptimized={true}
                className="w-full h-full object-cover"
                name="profile_photo"
              />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      First name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                      Last name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastname || ""}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
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
                <div>
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                SubCaste
                </label>
                <SelectGroupSubCaste
                  subcastes={subcastes}
                  name="subcaste"
                  selectedsubcaste={formData.subcaste}
                  onsubcasteChange={(e) =>
                    setFormData({ ...formData, subcaste: e.target.value })
                  }
                />
                </div>
                <div>
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                Date Of Birth
                </label>
                <DatePickerOne
                  name="birthdate"
                  dateFormat="d-m-Y" // Format for the date
                  placeholder="Select your birth date" // Placeholder for the date picker
                  value={formData.birthdate} // Pass the current value of birthDate from formData
                  onChange={(dates) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      birthdate: dates[0]?.toISOString().split("T")[0], // Update birthDate with the selected value
                    }))
                  }
                />
                </div>
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Age <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, age: value });
                      if (value < 18) {
                        setError("Age must be at least 18 years.");
                      } else {
                        setError("");
                      }
                    }}
                    placeholder="Enter your age"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {error && <p className="text-sm text-meta-1 mt-1">{error}</p>}
                </div>
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                    Place of birth  <span className="text-meta-1">*</span>
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
                  religions={religions}
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
                  religions={religions}
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


              <div>
                <label className="mb-3 block text-sm font-medium dark-text dark:text-white">
                Address 
                </label>
                <textarea
                  rows={6}
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                ></textarea>
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
                      if (value < 18) {
                        setError("Age must be at least 18 years.");
                      } else {
                        setError("");
                      }
                    }}
                    placeholder="Enter your age"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 dark-text outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {error && <p className="text-sm text-meta-1 mt-1">{error}</p>}
              </div>
            </div>
          </div>
          </div>

            <button
              type="submit"
              className="mt-6 w-full rounded bg-primary py-2 px-4 text-white transition hover:bg-primary-dark"
            >
              Submit
            </button>
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </>
  );
};

export default FormElements;
