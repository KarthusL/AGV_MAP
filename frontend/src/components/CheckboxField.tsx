import React, { FC, InputHTMLAttributes } from "react";

// Define interface to specify props structure
interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// Functional Component with FC (Function Component) type from React
const CheckboxField: FC<CheckboxFieldProps> = ({ label, ...inputProps }) => {
  return (
    <div>
      <label>
        {/* Spread the remaining props on the input element */}
        <input type="checkbox" {...inputProps} /> {label}
      </label>
    </div>
  );
};

export default CheckboxField;
