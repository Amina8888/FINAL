import React from "react";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/account/google-login";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full border text-black py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;