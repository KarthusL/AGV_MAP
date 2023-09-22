import React, { FC, SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

const SelectField: FC<SelectFieldProps> = ({ label, options, ...props }) => {
  return (
    <div className="select-field-container">
      <label className="select-field-label">
        {label}:
        <select className="select-field" {...props}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SelectField;
