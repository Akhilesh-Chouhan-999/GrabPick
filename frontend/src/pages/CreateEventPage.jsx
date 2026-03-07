import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, FileText, Type } from "lucide-react";
import toast from "react-hot-toast";
import { eventService } from "../services/eventService";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await eventService.create(data);
      toast.success("Event created!");
      navigate("/events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-lg font-semibold">Create Event</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/60 border border-white/5 rounded-2xl p-6 md:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Event Title <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="e.g. Annual Tech Conference 2026"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  {...register("title", { required: "Title is required" })}
                />
              </div>
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <textarea
                  rows={3}
                  placeholder="Describe your event..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
                  {...register("description")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Event Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition [color-scheme:dark]"
                    {...register("eventDate")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="e.g. Convention Center, NYC"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                    {...register("location")}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-white/10 hover:border-white/20 rounded-xl text-gray-300 transition"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Event"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateEventPage;
