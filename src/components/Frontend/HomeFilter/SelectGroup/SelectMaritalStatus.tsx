"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";

interface SelectMaritalStatusProps {
  name: string;
  selectedMaritalStatus: string;
  onMaritalStatusChange: (e: { target: { name: string; value: string } }) => void;
  placeholder?: string;
}

const SelectMaritalStatus: React.FC<SelectMaritalStatusProps> = ({
  name,
  selectedMaritalStatus,
  onMaritalStatusChange,
  placeholder,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setLang(localStorage.getItem("lang") || "en");
    }
  }, []);

  const options = [
    {
      value: "nevermarried",
      label: lang === "ta" ? "திருமணம் செய்யவில்லை" : "Never Married",
    },
    {
      value: "widowed",
      label: lang === "ta" ? "விதவையானவர்" : "Widowed",
    },
    {
      value: "divorced",
      label: lang === "ta" ? "விவாகரத்து பெற்றவர்" : "Divorced",
    },
    {
      value: "awaitingdivorce",
      label: lang === "ta" ? "விவாகரத்துக்காக காத்திருக்கிறேன்" : "Awaiting Divorce",
    },
  ];

  const selectedOption =
    options.find(
      (option) =>
        option.value.toLowerCase() === (selectedMaritalStatus || "").toLowerCase()
    ) || null;

  return (
    <div className="mb-4.5 w-full">
      <Select
        name={name}
        value={selectedOption}
        onChange={(selected) =>
          onMaritalStatusChange({
            target: { name, value: selected?.value || "" },
          })
        }
        options={options}
        placeholder={placeholder || (lang === "ta" ? "தேர்வு செய்க" : "Select")}
        isClearable
        className="react-select-container relative z-20 w-full"
        classNamePrefix="react-select"
        menuPortalTarget={isMounted ? document.body : null}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
};

export default SelectMaritalStatus;
