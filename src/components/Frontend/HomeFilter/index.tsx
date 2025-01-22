'use client';

import React, { useState } from "react";
import SelectAge from "@/components/Frontend/Fillter/SelectGroup/SelectAge"; // Remove the extra space here
import SelectBrideGroom from "@/components/Frontend/Fillter/SelectGroup/SelectBrideGroom"; // Remove the extra space here
import { useRouter } from "next/navigation";

const FilterForm = () => {

  const router = useRouter();
  const [formData, setFormData] = useState({
    lookingfor: "",
    fromage: "",
    toage: "",
    subcaste: "",
  });

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Example data array of subcastes
  const subcastes = ['Brahmin', 'Rajput', 'Jat', 'Kayastha', 'Yadav', 'Gupta', 'Vaishya'];

  // Handle input change and filter suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, subcaste: value });

    if (value.length > 0) {
      // Filter the suggestions based on the user's input
      const filtered = subcastes.filter((subcaste) =>
        subcaste.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]); // Clear suggestions if input is empty
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setFormData({ ...formData, subcaste: suggestion });
    setFilteredSuggestions([]); // Clear suggestions after selection
  };

  // Array for Subcastes
  // const subcastes = ["Mudaliyar"];


  const handleAgeChange = (e) => {
    setFormData({ ...formData, fromage: e.target.value });
  };
  const handleAgeChangesto = (e) => {
    setFormData({ ...formData, toage: e.target.value });
  };
  const handleBrideGroomChange = (e) => {
    setFormData({ ...formData, lookingfor: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const queryParams = new URLSearchParams();
  
    // Only add non-empty values to the query
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim()) {
        queryParams.append(key, value);
      }
    });
  
    // Redirect only if there are valid query parameters
    if (queryParams.toString()) {
      router.push(`/frontend/member?${queryParams.toString()}`);
    } else {
      router.push(`/frontend/member`); // Fallback if no parameters exist
    }
  };
  

  return (
    <div className="dark-bg">
      <div className="container mx-auto flex items-center fillter-text justify-center p-10">
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
                {filteredSuggestions.length > 0 && formData.subcaste.length > 0 && (
                  <ul className="absolute w-full bg-white border shadow-md z-30 max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
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
