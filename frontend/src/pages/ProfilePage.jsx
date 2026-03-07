import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Trash2,
  Shield,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { setUser, logoutUser } from "../features/authSlice";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { getImageUrl } from "../utils/image";

const ProfilePage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { data: res } = await userService.updateProfile(data);
      dispatch(setUser({ ...user, ...res.user }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const { data } = await userService.updateAvatar(formData);
      dispatch(setUser({ ...user, profileImage: data.user?.profileImage }));
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleResendVerification = async () => {
    try {
      await authService.resendVerification();
      toast.success("Verification email sent!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send verification email",
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteAccount();
      await dispatch(logoutUser());
      toast.success("Account deleted");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const getAvatarUrl = () => {
    if (!user?.profileImage) return null;
    return getImageUrl(user.profileImage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Profile Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/60 border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              {getAvatarUrl() ? (
                <img
                  src={getAvatarUrl()}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 hover:bg-blue-700 rounded-full cursor-pointer transition"
              >
                {avatarLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </label>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <p className="text-gray-400 text-sm">{user?.phone}</p>
              <span
                className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                  user?.role === "ORGANIZER"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-purple-500/10 text-purple-400"
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Email Verification */}
        {user?.email && !user?.isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-yellow-300">
                  Email not verified
                </p>
                <p className="text-xs text-yellow-400/70">
                  Verify your email to unlock all features
                </p>
              </div>
            </div>
            <button
              onClick={handleResendVerification}
              className="px-4 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm transition"
            >
              Resend
            </button>
          </motion.div>
        )}

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gray-900/60 border border-white/5 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 3, message: "Min 3 characters" },
                  })}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  {...register("email", {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Invalid phone number",
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
              disabled={saving}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Danger Zone
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          {showDelete ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-white text-sm font-medium transition"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="px-6 py-2.5 border border-white/10 rounded-xl text-gray-300 text-sm transition hover:border-white/20"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDelete(true)}
              className="px-6 py-2.5 border border-red-500/30 hover:bg-red-600/10 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;
