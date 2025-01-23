"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import SelectAge from "@/components/Frontend/Fillter/SelectGroup/SelectAge";
import SelectBrideGroom from "@/components/Frontend/Fillter/SelectGroup/SelectBrideGroom";

const FilterForm = ({ onFilterChange }) => {
  const searchParams = useSearchParams(); // Get URL query parameters

  const [formData, setFormData] = useState({
    lookingfor: "",
    fromage: "",
    toage: "",
    subcaste: "",
  });

  // ✅ Populate form fields from URL parameters when component mounts
  useEffect(() => {
    setFormData({
      lookingfor: searchParams.get("lookingfor") || "",
      fromage: searchParams.get("fromage") || "",
      toage: searchParams.get("toage") || "",
      subcaste: searchParams.get("subcaste") || "",
    });
  }, [searchParams]); // Runs whenever searchParams change

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    onFilterChange(formData); // Pass form data to the parent component
  };

  return (
    <div className="dark-bg">
      <div className="container mx-auto flex items-center justify-center p-10">
        <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center gap-9 p-6.5 member-search-form">
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

            <div className="w-full md:w-auto relative">
              <label className="mb-3 block text-sm font-medium text-white">SubCaste</label>
              <div className="mb-4.5">
                <input
                  type="text"
                  name="subcaste"
                  value={formData.subcaste}
                  onChange={handleInputChange}
                  className="relative z-20 md:w-64 w-full appearance-none rounded border border-stroke bg-white px-5 py-3 outline-none transition dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
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
