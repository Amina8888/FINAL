"use client";

import React, { useState } from "react";
import InputField from "../components/InputField";
import InteractiveButton from "../components/InteractiveButton";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt with:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex overflow-hidden flex-col justify-center items-center pt-12 pr-12 pb-5 pl-12 max-w-full bg-white rounded-xl border-[0.27] min-h-[306px] w-[404px] max-md:px-5"
    >
      <div className="w-full max-w-[305px] min-h-[57px]">
        <InputField
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="mt-3 w-full max-w-[300px]">
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-center items-center mt-3 max-w-full min-h-[77px] w-[113px]">
        <InteractiveButton>Login</InteractiveButton>
      </div>

      <a
        href="#"
        className="mt-3 text-xs font-light leading-none text-gray-800 underline"
      >
        Forgot password?
      </a>
    </form>
  );
};

export default LoginForm;