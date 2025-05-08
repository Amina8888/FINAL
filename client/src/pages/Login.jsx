import { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://localhost:5085/api/Account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border mb-4 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border mb-4 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-accent text-white py-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>

        <div className="my-4">
          <GoogleLoginButton />
        </div>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-accent hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
