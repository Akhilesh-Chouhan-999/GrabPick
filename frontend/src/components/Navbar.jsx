import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { logoutUser } from "../features/authSlice";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-6 md:px-8 py-4 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/10">
      <Link
        to="/"
        className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      >
        GrabPick
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="hover:text-white transition flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400 text-xs">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/10 hover:border-red-500/50 hover:text-red-400 rounded-lg transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <Link to="/login" className="hover:text-white transition">
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Icon */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl flex flex-col items-center gap-4 py-8 md:hidden border-b border-white/10">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-blue-600 rounded-lg text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
