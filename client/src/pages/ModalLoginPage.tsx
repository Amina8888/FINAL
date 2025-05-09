"use client";

import React from "react";
import LoginForm from "../forms/LoginForm";

const ModalLoginPage: React.FC = () => {
  return (
    <section className="flex overflow-hidden flex-col justify-center items-center px-20 py-96 bg-blue-600 bg-opacity-30 max-md:px-5 max-md:py-24">
      <LoginForm />
    </section>
  );
};

export default ModalLoginPage;