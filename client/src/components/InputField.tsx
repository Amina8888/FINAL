"use client";

import React from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  placeholder = "Type here...",
  name,
  value,
  onChange,
}) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="text-sm leading-none text-gray-800">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="overflow-hidden w-full px-3 py-2 mt-1 text-xs leading-none bg-white rounded-lg border border-solid border-slate-300 shadow-[0px_2px_2px_rgba(255,255,255,0.15)] text-slate-700 placeholder:text-slate-300"
      />
    </div>
  );
};

export default InputField;