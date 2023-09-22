import React, { FC, InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextField: FC<TextFieldProps> = ({ label, ...props }) => {
  return (
    <div>
      <label>
        {label}: <input {...props} />
      </label>
    </div>
  );
};

export default TextField;
