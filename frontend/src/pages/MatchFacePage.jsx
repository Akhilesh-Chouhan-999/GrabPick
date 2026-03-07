import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ScanFace,
  Upload,
  X,
  Loader2,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Percent,
} from "lucide-react";
import toast from "react-hot-toast";
import { imageService } from "../services/imageService";
import { getImageUrl } from "../utils/image";

const MatchFacePage = () => {
  const { eventId } = useParams();
  const fileInputRef = useRef(null);

  const [selfie, setSelfie] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [matching, setMatching] = useState(false);
  const [results, setResults] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelfie(file);
    setSelfiePreview(URL.createObjectURL(file));
    setResults(null);
  };

  const handleMatch = async () => {
    if (!selfie) {
      toast.error("Please upload a selfie first");
      return;
    }

    setMatching(true);
    const formData = new FormData();
    formData.append("image", selfie);

    try {
      const { data } = await imageService.matchFace(eventId, formData);
      setResults(data.matches);
      if (data.matches?.totalMatches === 0) {
        toast("No matching photos found", { icon: "🔍" });
      } else {
        toast.success(`Found ${data.matches.totalMatches} matching photo(s)!`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Face matching failed. Make sure your selfie has a clear face.",
      );
    } finally {
      setMatching(false);
    }
  };

  const clearSelfie = () => {
    setSelfie(null);
    setSelfiePreview(null);
    setResults(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const matchedImages = results?.results || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            to={`/events/${eventId}`}
            className="text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <ScanFace className="w-5 h-5 text-pink-400" />
            Find Your Photos
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Upload Selfie Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/60 border border-white/5 rounded-2xl p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl font-semibold mb-2">Upload Your Selfie</h2>
          <p className="text-gray-400 text-sm mb-6">
            Upload a clear photo of your face. Our AI will find all event photos
            containing you.
          </p>

          {selfiePreview ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={selfiePreview}
                  alt="Selfie preview"
                  className="w-40 h-40 object-cover rounded-2xl border-2 border-pink-500/30"
                />
                <button
                  onClick={clearSelfie}
                  className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-gray-300 font-medium mb-1">{selfie?.name}</p>
                <p className="text-gray-500 text-sm mb-4">
                  {(selfie?.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMatch}
                  disabled={matching}
                  className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 rounded-xl text-white font-medium flex items-center gap-2 transition mx-auto sm:mx-0"
                >
                  {matching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scanning faces...
                    </>
                  ) : (
                    <>
                      <ScanFace className="w-5 h-5" />
                      Find My Photos
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="selfie-upload"
              />
              <label
                htmlFor="selfie-upload"
                className="flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed border-white/10 hover:border-pink-500/40 rounded-2xl cursor-pointer transition hover:bg-pink-500/5"
              >
                <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-pink-400" />
                </div>
                <div className="text-center">
                  <p className="text-gray-300 font-medium">
                    Click to upload a selfie
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    JPEG, PNG, WebP - Must contain a clear face
                  </p>
                </div>
              </label>
            </>
          )}
        </motion.div>

        {/* Matching Animation */}
        {matching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-pink-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-4 border-purple-500/30 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <ScanFace className="w-10 h-10 text-pink-400" />
              </div>
            </div>
            <p className="text-gray-300 font-medium">
              Scanning event photos...
            </p>
            <p className="text-gray-500 text-sm mt-1">This may take a moment</p>
          </motion.div>
        )}

        {/* Results */}
        {results && !matching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {results.totalMatches > 0
                  ? `Found ${results.totalMatches} Photo${results.totalMatches !== 1 ? "s" : ""}`
                  : "No Matches Found"}
              </h2>
            </div>

            {matchedImages.length === 0 ? (
              <div className="text-center py-16 bg-gray-900/30 border border-white/5 rounded-2xl">
                <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  No photos matched your face in this event.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Try with a clearer selfie or different angle.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {matchedImages.map((match, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative group aspect-square rounded-xl overflow-hidden bg-gray-800 cursor-pointer"
                    onClick={() => setLightboxIdx(i)}
                  >
                    <img
                      src={getImageUrl(match.imageUrl)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <Percent className="w-3 h-3" />
                        {(match.similarity * 100).toFixed(1)}% match
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx >= 0 && matchedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(-1)}
          >
            <button
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition z-10"
              onClick={() => setLightboxIdx(-1)}
            >
              <X className="w-6 h-6" />
            </button>
            {lightboxIdx > 0 && (
              <button
                className="absolute left-4 p-2 text-white/70 hover:text-white transition z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(lightboxIdx - 1);
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            {lightboxIdx < matchedImages.length - 1 && (
              <button
                className="absolute right-4 p-2 text-white/70 hover:text-white transition z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIdx(lightboxIdx + 1);
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
            <div className="flex flex-col items-center gap-3">
              <motion.img
                key={lightboxIdx}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={getImageUrl(matchedImages[lightboxIdx].imageUrl)}
                alt=""
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="text-sm text-green-400 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" />
                {(matchedImages[lightboxIdx].similarity * 100).toFixed(1)}%
                match
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchFacePage;
