import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide">
        ConsultHub
      </Link>
      <div className="space-x-4">
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
