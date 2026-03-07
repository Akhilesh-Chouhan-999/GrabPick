import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  MapPin,
  Images,
  ChevronRight,
  ScanFace,
  Settings,
  LogOut,
  Camera,
  LayoutDashboard,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../features/authSlice";
import { eventService } from "../services/eventService";

const DashboardPage = () => {
  const { user, isOrganizer } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOrganizer) {
      loadEvents();
    } else {
      setLoading(false);
    }
  }, [isOrganizer]);

  const loadEvents = async () => {
    try {
      const { data } = await eventService.getAll();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            GrabPick
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="hidden sm:inline">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-400 mt-1">
            {isOrganizer
              ? "Manage your events and photos"
              : "Find your photos from events"}
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {isOrganizer && (
            <>
              <Link to="/events/create">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-5 bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/20 rounded-2xl hover:border-blue-500/40 transition cursor-pointer"
                >
                  <Plus className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="font-semibold">Create Event</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Start a new event
                  </p>
                </motion.div>
              </Link>
              <Link to="/events">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-5 bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/20 rounded-2xl hover:border-purple-500/40 transition cursor-pointer"
                >
                  <LayoutDashboard className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="font-semibold">My Events</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {events.length} events
                  </p>
                </motion.div>
              </Link>
            </>
          )}
          <Link to="/find-photos">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-5 bg-gradient-to-br from-pink-600/20 to-pink-600/5 border border-pink-500/20 rounded-2xl hover:border-pink-500/40 transition cursor-pointer"
            >
              <ScanFace className="w-8 h-8 text-pink-400 mb-3" />
              <h3 className="font-semibold">Find My Photos</h3>
              <p className="text-gray-400 text-sm mt-1">Match face in events</p>
            </motion.div>
          </Link>
          <Link to="/profile">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-5 bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/20 rounded-2xl hover:border-green-500/40 transition cursor-pointer"
            >
              <Settings className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="font-semibold">Profile</h3>
              <p className="text-gray-400 text-sm mt-1">Settings & account</p>
            </motion.div>
          </Link>
        </div>

        {/* Organizer: Recent Events */}
        {isOrganizer && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Events</h2>
              <Link
                to="/events"
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-gray-900/30 border border-white/5 rounded-2xl"
              >
                <Camera className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300">
                  No events yet
                </h3>
                <p className="text-gray-500 mt-1 text-sm">
                  Create your first event to get started
                </p>
                <Link to="/events/create">
                  <button className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium transition">
                    Create Event
                  </button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.slice(0, 6).map((event, i) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/events/${event._id}`}>
                      <div className="p-5 bg-gray-900/50 border border-white/5 rounded-2xl hover:border-white/15 transition group">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition truncate pr-2">
                            {event.title}
                          </h3>
                          <span
                            className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
                              event.isActive
                                ? "bg-green-500/10 text-green-400"
                                : "bg-gray-500/10 text-gray-400"
                            }`}
                          >
                            {event.isActive ? "Active" : "Ended"}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {event.eventDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(event.eventDate).toLocaleDateString()}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Regular User: Find Photos CTA */}
        {!isOrganizer && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-gray-900/30 border border-white/5 rounded-2xl"
          >
            <ScanFace className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Find Your Event Photos</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Enter an event code, upload a selfie, and our AI will find all
              your photos instantly.
            </p>
            <Link to="/find-photos">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition">
                Find My Photos
              </button>
            </Link>
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
