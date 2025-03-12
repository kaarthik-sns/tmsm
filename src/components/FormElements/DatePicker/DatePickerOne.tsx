"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "@/components/Layouts/sidebar/icons";

const DatePickerOne = ({ dateFormat = "dd-MM-yyyy", placeholder = "mm/dd/yyyy", onChange, value }) => {
  const [selectedDate, setSelectedDate] = useState(value || "");

  // Calculate the max date (18 years ago from today)
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className="mb-4.5">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Date Of Birth <span className="text-meta-1">*</span>
      </label>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          placeholderText={placeholder}
          dateFormat={dateFormat}
          minDate={new Date("1900-01-01")}
          maxDate={maxDate} // Ensures only 18+ users can select a date
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100} // Shows 100 years for easier selection
        />
        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
};

export default DatePickerOne;
