
import React, { useState } from "react";
import type { JSX } from "react";

interface Props {
  className?: string;
}

export const LoginForm = ({ className }: Props): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConsultantOptions, setShowConsultantOptions] = useState(false);

  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  return (
    <div
      className={\`relative w-[415px] h-auto bg-white rounded-[10px] border border-solid border-[#007aff45] p-6 flex flex-col gap-4 \${className}\`}
    >
      <label className="text-sm font-medium text-gray-700">Email address</label>
      <input
        type="email"
        placeholder="Type here..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      />

      <label className="text-sm font-medium text-gray-700">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Type here..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <label className="text-sm font-medium text-gray-700">Confirm password</label>
      <input
        type="password"
        placeholder="Type here..."
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2"
      />
      {!passwordsMatch && (
        <p className="text-red-500 text-xs mt-1">Password is incorrect.</p>
      )}

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="consultant"
          checked={showConsultantOptions}
          onChange={() => setShowConsultantOptions(!showConsultantOptions)}
        />
        <label htmlFor="consultant" className="text-sm text-gray-700">
          Register as a Consultant
        </label>
      </div>

      {showConsultantOptions && (
        <select className="border border-gray-300 rounded-md px-3 py-2 mt-2">
          <option>Select area of expertise</option>
          <option>Legal</option>
          <option>Medical</option>
          <option>IT</option>
        </select>
      )}
    </div>
  );
};
