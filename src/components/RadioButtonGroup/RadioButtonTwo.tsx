import React from 'react';

interface RadioButtonProps {
  name: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {options.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
            className="form-radio h-5 w-5 text-primary border-primary focus:ring-primary"
          />
          <label className="ml-2 text-sm dark-text">{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default RadioButton;
