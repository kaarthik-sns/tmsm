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
    <div className="flex space-x-4">
      {options.map((option) => (
        <label
          key={option.value}
          className="cursor-pointer flex items-center space-x-2"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={onChange}
            className="form-radio text-red-500 focus:ring-red-500"
          />
          <span className="block text-sm font-medium dark:text-white">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioButton;
