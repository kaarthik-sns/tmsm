'use client';

import React, { useState } from "react";
// FilterForm.jsx
import SelectGroupCaste from "@/components/Frontend/Fillter/SelectGroup/SelectGroupCaste";
import SelectGroupSubCaste from "@/components/Frontend/Fillter/SelectGroup/SelectGroupSubCaste"; // Remove the extra space here
import SelectAge from "@/components/Frontend/Fillter/SelectGroup/SelectAge"; // Remove the extra space here
import SelectBrideGroom  from "@/components/Frontend/Fillter/SelectGroup/SelectBrideGroom "; // Remove the extra space here

const FilterForm = () => {
  const [formData, setFormData] = useState({
    lookingfor: "",
    fromage: "",
    toage: "",
    caste: "",
    subcaste: "", 
  });

  // Array for castes
  const castes = ["Mudaliyar"];

  // Array for Subcastes
  const subcastes = ["Mudaliyar"];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAgeChange = (e) => {
    setFormData({ ...formData, fromage: e.target.value });
  };
  const handleAgeChangesto = (e) => {
    setFormData({ ...formData, toage: e.target.value });
  };
  const handleBrideGroomChange = (e) => {
    setFormData({ ...formData, lookingfor: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submit logic here
  };

  return (
    <div className="dark-bg">
      <div className="container mx-auto flex items-center fillter-text justify-center">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-center gap-9 p-6.5">
            <div className="w-full md:w-auto">
                <label className="mb-3 block text-sm font-medium text-white">
                  Looking For
                </label>
                <SelectBrideGroom
                  name="lookingfor"
                  selectedBrideGroom={formData.lookingfor}
                  onBrideGroomChange={handleBrideGroomChange}
            />
            </div>

            <div className="w-full md:w-auto">
              <label className="mb-3 block text-sm font-medium text-white">
                Age
              </label>
              <SelectAge
                name="fromage"
                selectedAge={formData.fromage}
                onAgeChange={handleAgeChange}
              />
            </div>
            <div className="hidden w-full md:w-auto md:mt-4 md:block">
              <label className="mb-3 block text-sm font-medium text-white">
                To
              </label>
            </div>
            <div className="w-full md:w-auto">
              <label className="mb-3 block text-sm font-medium text-white visibility">
                To
              </label>
              <SelectAge
                name="toage"
                selectedAge={formData.toage}
                onAgeChange={handleAgeChangesto}
              />
            </div>

            <div className="w-full md:w-auto">
              <label className="mb-3 block text-sm font-medium text-white">
                Caste
              </label>
              <SelectGroupCaste
                castes={castes}
                name="caste"
                selectedcaste={formData.caste}
                oncasteChange={(e) => setFormData({ ...formData, caste: e.target.value })}
              />
            </div>

            <div className="w-full md:w-auto">
              <label className="mb-3 block text-sm font-medium text-white">
                SubCaste
              </label>
              <SelectGroupSubCaste
                subcastes={subcastes}
                name="subcaste"
                selectedsubcaste={formData.subcaste}
                onsubcasteChange={(e) => setFormData({ ...formData, subcaste: e.target.value })}
              />
            </div>

            <div className="w-full md:w-auto flex justify-between gap-4 mt-5 md:mt-5">
              <button
                className="inline-block px-10 py-4 text-white duration-150 rounded-full  md:text-sm ftext-custom"
                type="submit"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    
  );
};

export default FilterForm;
