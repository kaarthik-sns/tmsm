"use client";
import React from "react";

interface UpdateStatusProps {
  value: string;
  onChange: (value: string) => void;
}

const UpdateStatus: React.FC<UpdateStatusProps> = ({ value, onChange }) => {

  // Handle the change event when a new option is selected
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value); // Pass the updated value back to the parent component
  };
  return (
    <div className="w-64 md:w-64">
      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          value={value}
          onChange={handleChange}
          className={`w-full md:w-64 relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary md:text-sm ${value ? "text-black dark:text-white" : ""
            }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            Select Status
          </option>
          <option value="pending" className="text-body dark:text-bodydark">
            Request sent
          </option>
          <option value="accepted" className="text-body dark:text-bodydark">
            Accepted
          </option>
          <option value="rejected" className="text-body dark:text-bodydark">
            Declined
          </option>
          <option value="cancel" className="text-body dark:text-bodydark">
            Cancel
          </option>
        </select>

        <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
          <svg
            width="24"
            height="24"
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
    </div>
  );
};


export default UpdateStatus;
