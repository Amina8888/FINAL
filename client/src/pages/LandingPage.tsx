import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, VideoCameraIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ModalLoginPage } from '@/screens/ModalLoginPage';
import { ModalRegisterPage } from '@/screens/ModalRegisterPage';

const LandingPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-700">ConsultEase</div>
            <div className="space-x-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Log In
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Expert Consultations, Anytime, Anywhere</h1>
          <p className="text-xl text-gray-600 mb-8">Connect with top consultants in various fields and get the advice you need, when you need it.</p>
          <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 inline-flex items-center">
            Get Started
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <VideoCameraIcon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Video Consultations</h3>
            <p className="text-gray-600">Face-to-face meetings from the comfort of your home or office.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <UserGroupIcon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Consultants</h3>
            <p className="text-gray-600">Access to a wide range of verified professionals in various fields.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <ClockIcon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600">Book consultations at times that suit your busy lifestyle.</p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Consultant Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {['Legal', 'Financial', 'Health', 'Technology'].map((category) => (
              <Link key={category} to={`/user/search?category=${category.toLowerCase()}`} className="bg-gray-200 p-4 rounded-md text-gray-800 hover:bg-gray-300">
                {category}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center">&copy; 2023 ConsultEase. All rights reserved.</p>
        </div>
      </footer>
      {/* Модальное окно логина */}
{showLoginModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <ModalLoginPage
      onClose={() => setShowLoginModal(false)}
      onSwitchToRegister={() => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
      }}
    />
  </div>
)}

{/* Модальное окно регистрации */}
{showRegisterModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <ModalRegisterPage
      onClose={() => setShowRegisterModal(false)}
      onSwitchToLogin={() => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
      }}
    />
  </div>
)}
    </div>
  );
};

export default LandingPage;
