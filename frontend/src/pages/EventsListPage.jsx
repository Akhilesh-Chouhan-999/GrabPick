import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar,
  MapPin,
  ArrowLeft,
  Search,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";
import { eventService } from "../services/eventService";

const EventsListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data } = await eventService.getAll();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold">My Events</h1>
          </div>
          <Link to="/events/create">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition">
              <Plus className="w-4 h-4" />
              New Event
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md pl-11 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Camera className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300">
              {search ? "No matching events" : "No events yet"}
            </h3>
            <p className="text-gray-500 mt-1 text-sm">
              {search
                ? "Try a different search term"
                : "Create your first event to get started"}
            </p>
            {!search && (
              <Link to="/events/create">
                <button className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium transition">
                  Create Event
                </button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={`/events/${event._id}`}>
                  <div className="h-full p-5 bg-gray-900/50 border border-white/5 rounded-2xl hover:border-white/15 transition group">
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
      </main>
    </div>
  );
};

export default EventsListPage;
