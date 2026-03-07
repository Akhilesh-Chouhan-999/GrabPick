import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, LogIn } from "lucide-react";
import { authService } from "../services/authService";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await authService.verifyEmail(token);
        setMessage(data.message || "Email verified successfully!");
        setStatus("success");
      } catch (err) {
        setMessage(
          err.response?.data?.message ||
            "Verification failed. The link may have expired.",
        );
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 max-w-md w-full text-center"
      >
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white">
              Verifying your email...
            </h2>
            <p className="text-gray-400 mt-2">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white">{message}</h2>
            <p className="text-gray-400 mt-2">
              You can now log in to your account.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium"
            >
              <LogIn className="w-4 h-4" /> Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white">
              Verification Failed
            </h2>
            <p className="text-gray-400 mt-2">{message}</p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition font-medium"
            >
              Back to Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
