import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Send } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.phone);
      setSent(true);
      toast.success("Password reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <h1 className="text-2xl font-bold text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Enter your phone number and we'll send a password reset link to your
            registered email.
          </p>

          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Send className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-400 text-sm">
                We've sent a password reset link to your registered email
                address.
              </p>
              <Link to="/login">
                <button className="mt-6 px-6 py-2.5 border border-white/10 hover:border-white/20 rounded-xl transition text-sm">
                  Back to Login
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    placeholder="Enter your registered phone number"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Enter a valid phone number",
                      },
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
