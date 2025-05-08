
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold mb-6">Добро пожаловать в Consultation Platform</h1>
      <p className="text-lg mb-6">Онлайн-платформа, где вы можете найти и связаться с консультантами по разным направлениям.</p>
      <img src="https://source.unsplash.com/featured/?consulting,technology" alt="Consultation" className="mx-auto mb-6 rounded shadow-lg max-w-xl" />
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign In</Link>
        <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Sign Up</Link>
      </div>
    </div>
  );
};

export default Home;
