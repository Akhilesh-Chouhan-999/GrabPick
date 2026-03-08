import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      await authService.resetPassword(token, values.password);
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Reset failed. The link may have expired.",
      );
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white">Password Reset!</h2>
          <p className="text-gray-400 mt-2">Redirecting you to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-1">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Min 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
                    message: "Must include upper, lower, number & special char",
                  },
                })}
                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === getValues("password") || "Passwords do not match",
                })}
                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
