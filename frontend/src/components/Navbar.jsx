import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full px-8 py-5 flex justify-between items-center border-b border-white/10 backdrop-blur-md">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        Grab<span className="text-blue-500">Pic</span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
        <a href="#features" className="hover:text-white transition">
          Features
        </a>
        <a href="#pricing" className="hover:text-white transition">
          Pricing
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
      </div>
    </nav>
  );
};

export default Navbar;