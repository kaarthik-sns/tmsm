"use client";
import React from "react";

interface UpdateStatusProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const UpdateStatus: React.FC<UpdateStatusProps> = ({ value, onChange, className }) => {

  // Handle the change event when a new option is selected
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value); // Pass the updated value back to the parent component
  };

  const lang = localStorage.getItem('lang') || 'en';
  const isTamil = lang === 'ta';

  return (
    <div className="relative z-20 bg-transparent dark:bg-form-input">
      <select
        value={value}
        onChange={handleChange}
        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-3 pr-8 py-1.5 text-sm outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${value ? "text-black dark:text-white" : ""} ${className || ""}`}
      >
        <option value="" disabled className="text-body dark:text-bodydark">
          {isTamil ? "நிலை தேர்வுசெய்க" : "Select Status"}
        </option>
        <option value="pending" className="text-body dark:text-bodydark">
          {isTamil ? "கோரிக்கை அனுப்பப்பட்டது" : "Request sent"}
        </option>
        <option value="accepted" className="text-body dark:text-bodydark">
          {isTamil ? "ஏற்றுக்கொள்ளப்பட்டது" : "Accepted"}
        </option>
        <option value="rejected" className="text-body dark:text-bodydark">
          {isTamil ? "நிராகரிக்கப்பட்டது" : "Declined"}
        </option>
        <option value="cancel" className="text-body dark:text-bodydark">
          {isTamil ? "நீக்கம்செய்" : "Cancel"}
        </option>
      </select>

      <span className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.8">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
              fill="#637381"
            ></path>
          </g>
        </svg>
      </span>
    </div>
  );
};


export default UpdateStatus;
