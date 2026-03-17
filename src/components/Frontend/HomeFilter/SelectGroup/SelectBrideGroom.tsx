"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const SelectBrideGroom = ({ selectedBrideGroom, name, onBrideGroomChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const lang = localStorage.getItem('lang') || 'en';

  const options = [
    {
      value: "female",
      label: lang == "ta" ? "மணமகள்" : "Bride",
    },
    {
      value: "male",
      label: lang == "ta" ? "மணமகன்" : "Groom",
    },
  ];

  const selectedOption =
    options.find((option) => option.value === selectedBrideGroom) || null;

  return (
    <div className="mb-4.5">
      <Select
        name={name}
        value={selectedOption}
        onChange={(selected) =>
          onBrideGroomChange({ target: { name, value: selected?.value || "" } })
        }
        options={options}
        placeholder={lang == "ta" ? "தேர்வு செய்க" : "Select"}
        isClearable
        className="react-select-container relative z-20"
        classNamePrefix="react-select"
        menuPortalTarget={isMounted ? document.body : null}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
};

export default SelectBrideGroom;
