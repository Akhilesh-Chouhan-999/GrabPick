import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ScanFace, Search, ArrowRight } from "lucide-react";

const FindPhotosPage = () => {
  const [eventId, setEventId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (eventId.trim()) {
      navigate(`/events/${eventId.trim()}/match`);
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
          <h1 className="text-lg font-semibold">Find My Photos</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <ScanFace className="w-10 h-10 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Find Your Photos</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Enter the event ID shared by the organizer, then upload a selfie to
            find all your photos using AI face recognition.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder="Enter Event ID"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition text-center"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!eventId.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-medium flex items-center justify-center gap-2 transition"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="mt-12 p-6 bg-gray-900/30 border border-white/5 rounded-2xl text-left max-w-md mx-auto">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              How it works
            </h3>
            <ol className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Enter the event ID provided by the event organizer
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Upload a clear selfie showing your face
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Our AI matches your face against event photos
              </li>
            </ol>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default FindPhotosPage;
