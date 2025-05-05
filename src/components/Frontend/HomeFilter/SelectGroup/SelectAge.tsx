"use client";
import React from "react";
import Select from "react-select";

const SelectAge = ({ name, selectedAge, onAgeChange, placeholder }) => {
  // Generate age options from 18 to 50
  const ageOptions = Array.from({ length: 33 }, (_, i) => {
    const age = 18 + i;
    return { value: age, label: age.toString() };
  });

  // Convert selectedAge to react-select format
  const selectedOption = ageOptions.find(option => option.value === selectedAge) || null;

  return (
    <div className="mb-4.5">
      <Select
        name={name}
        value={selectedOption}
        onChange={(selected) => onAgeChange({ target: { name, value: selected?.value || "" } })}
        options={ageOptions}
        placeholder={placeholder}
        isClearable
        className="react-select-container relative z-20 w-full"
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default SelectAge;