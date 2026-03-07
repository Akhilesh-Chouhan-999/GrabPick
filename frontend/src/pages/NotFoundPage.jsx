import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <h1 className="text-8xl font-bold text-white/10 select-none">404</h1>
      <h2 className="text-2xl font-semibold text-white -mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-400 mt-2 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center justify-center gap-4 mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
