"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, CreditCard, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isAuthenticated, userRole, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getNavLinks = () => {
    switch (userRole) {
      case 'User':
        return ['Dashboard', 'My Consultations', 'Search Experts', 'Messages'];
      case 'Specialist':
        return ['Dashboard', 'My Consultations', 'Schedule', 'Messages'];
      default:
        return ['Home', 'About', 'Search Experts', 'Contact'];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">ConsultEase</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-blue-200">
                {link}
              </Link>
            ))}
          </div>

          {/* Auth Buttons / Profile Dropdown */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center space-x-2"
              >
                <User className="w-6 h-6" />
                <span>Profile</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl z-50">
                <Link
                  to={userRole === 'Specialist' ? '/consultant/profile' : '/user/profile'}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <User className="inline-block w-4 h-4 mr-2" /> Profile
                </Link>
              
                {userRole === 'User' && (
                  <Link to="/payments" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <CreditCard className="inline-block w-4 h-4 mr-2" /> Payments
                  </Link>
                )}
              
                <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  <Settings className="inline-block w-4 h-4 mr-2" /> Settings
                </Link>
              
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <LogOut className="inline-block w-4 h-4 mr-2" /> Logout
                </button>
              </div>
              )}
            </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="px-4 py-2 rounded hover:bg-blue-700">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-blue-100">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden space-y-1 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link}
                to={`/${link.toLowerCase().replace(' ', '-')}`}
                className="block py-2 px-2 hover:bg-blue-700 rounded"
                onClick={toggleMenu}
              >
                {link}
              </Link>
            ))}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block py-2 px-2 hover:bg-blue-700 rounded" onClick={toggleMenu}>Login</Link>
                <Link to="/register" className="block py-2 px-2 hover:bg-blue-700 rounded" onClick={toggleMenu}>Register</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="block py-2 px-2 hover:bg-blue-700 rounded" onClick={toggleMenu}>Profile</Link>
                {userRole === 'User' && (
                  <Link to="/payments" className="block py-2 px-2 hover:bg-blue-700 rounded" onClick={toggleMenu}>Payments</Link>
                )}
                {userRole === 'Specialist' && (
                  <Link to="/documents" className="block py-2 px-2 hover:bg-blue-700 rounded" onClick={toggleMenu}>Documents</Link>
                )}
                <Link to="/settings" className="block py-2 px-2 hover:bg-blue-700 rounded" onClick={toggleMenu}>Settings</Link>
                <button className="w-full text-left py-2 px-2 hover:bg-blue-700 rounded" onClick={() => {
                  toggleMenu();
                  logout();
                }}>
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
