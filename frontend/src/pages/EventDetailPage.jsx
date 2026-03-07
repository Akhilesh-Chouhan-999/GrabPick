import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Upload,
  Trash2,
  Images,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  ScanFace,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { eventService } from "../services/eventService";
import { imageService } from "../services/imageService";
import { getImageUrl } from "../utils/image";
import ConfirmModal from "../components/ConfirmModal";

const EventDetailPage = () => {
  "use no memo";
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, isOrganizer } = useAuth();
  const fileInputRef = useRef(null);

  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lightboxIdx, setLightboxIdx] = useState(-1);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [copied, setCopied] = useState(false);
  const [totalImages, setTotalImages] = useState(0);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });

  const loadEvent = useCallback(async () => {
    try {
      const { data } = await eventService.getOne(eventId);
      const evt = data.event || data;
      setEvent(evt);
      setEditForm({
        title: evt.title,
        description: evt.description || "",
        location: evt.location || "",
        eventDate: evt.eventDate ? evt.eventDate.split("T")[0] : "",
      });
    } catch {
      toast.error("Event not found");
      navigate("/events");
    }
  }, [eventId, navigate]);

  const loadImages = useCallback(
    async (p = 1) => {
      try {
        const { data } = await imageService.getEventImages(eventId, p, 12);
        const imgData = data.images || data;
        setImages(imgData.images || []);
        setTotalPages(imgData.totalPages || 1);
        setTotalImages(imgData.total || 0);
        setPage(imgData.page || p);
      } catch {
        // ignore
      }
    },
    [eventId],
  );

  useEffect(() => {
    let active = true;
    Promise.all([loadEvent(), loadImages()]).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [loadEvent, loadImages]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });
    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        await imageService.upload(eventId, formData);
        successCount++;
      } catch {
        failCount++;
      }
      setUploadProgress({
        done: successCount + failCount,
        total: files.length,
      });
    }

    if (successCount > 0) toast.success(`${successCount} image(s) uploaded`);
    if (failCount > 0)
      toast.error(`${failCount} upload(s) failed (no face detected?)`);

    setUploading(false);
    setUploadProgress({ done: 0, total: 0 });
    loadImages(page);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await imageService.delete(imageId);
      toast.success("Image deleted");
      loadImages(page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
    setConfirmDelete(null);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await eventService.update(eventId, editForm);
      toast.success("Event updated");
      setShowEdit(false);
      loadEvent();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteEvent = async () => {
    setDeleting(true);
    setConfirmDelete(null);
    try {
      await eventService.delete(eventId);
      toast.success("Event deleted");
      navigate("/events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
      setDeleting(false);
    }
  };

  const copyEventId = () => {
    navigator.clipboard.writeText(eventId);
    setCopied(true);
    toast.success("Event ID copied! Share it with attendees.");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isOwner = isOrganizer && event?.organizerId === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/events"
              className="text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold truncate">{event?.title}</h1>
            <button
              onClick={copyEventId}
              className="p-1.5 text-gray-500 hover:text-white transition"
              title="Copy event ID"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/events/${eventId}/match`}>
              <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                <ScanFace className="w-4 h-4" />
                <span className="hidden sm:inline">Find Face</span>
              </button>
            </Link>
            {isOwner && (
              <button
                onClick={() => setShowEdit(!showEdit)}
                className="p-2 text-gray-400 hover:text-white transition"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Event Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-2">
            {event?.eventDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {event?.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            )}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                event?.isActive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-gray-500/10 text-gray-400"
              }`}
            >
              {event?.isActive ? "Active" : "Ended"}
            </span>
          </div>
          {event?.description && (
            <p className="text-gray-400 max-w-2xl">{event.description}</p>
          )}
        </motion.div>

        {/* Edit Panel */}
        <AnimatePresence>
          {showEdit && isOwner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Event</h3>
                <form onSubmit={handleUpdateEvent} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                  <textarea
                    placeholder="Description"
                    rows={2}
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={editForm.eventDate || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, eventDate: e.target.value })
                      }
                      className="px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition [color-scheme:dark]"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={editForm.location || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      className="px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete("event")}
                      disabled={deleting}
                      className="px-6 py-2.5 bg-red-600/10 border border-red-500/30 hover:bg-red-600/20 text-red-400 rounded-xl text-sm font-medium transition"
                    >
                      {deleting ? "Deleting..." : "Delete Event"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Section (Organizer only) */}
        {isOwner && (
          <div className="mb-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-2xl cursor-pointer transition ${
                uploading
                  ? "border-blue-500/30 bg-blue-500/5"
                  : "border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                  <span className="text-blue-400 font-medium">
                    Uploading {uploadProgress.done}/{uploadProgress.total}...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-gray-400" />
                  <div>
                    <span className="text-gray-300 font-medium">
                      Click to upload event photos
                    </span>
                    <p className="text-gray-500 text-xs mt-0.5">
                      JPEG, PNG, WebP - Max 5MB each - Must contain faces
                    </p>
                  </div>
                </>
              )}
            </label>
          </div>
        )}

        {/* Image Gallery */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Images className="w-5 h-5 text-gray-400" />
            Event Photos
            {totalImages > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({totalImages})
              </span>
            )}
          </h2>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/30 border border-white/5 rounded-2xl">
            <Images className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No photos uploaded yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative group aspect-square rounded-xl overflow-hidden bg-gray-800 cursor-pointer"
                  onClick={() => setLightboxIdx(i)}
                >
                  <img
                    src={getImageUrl(img)}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {isOwner && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(img._id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {img.faces && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-xs">
                      {img.faces.length} face{img.faces.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => loadImages(page - 1)}
                  disabled={page <= 1}
                  className="p-2 border border-white/10 rounded-lg disabled:opacity-30 hover:border-white/30 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => loadImages(page + 1)}
                  disabled={page >= totalPages}
                  className="p-2 border border-white/10 rounded-lg disabled:opacity-30 hover:border-white/30 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx >= 0 && (
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
            {lightboxIdx < images.length - 1 && (
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
            <motion.img
              key={lightboxIdx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={getImageUrl(images[lightboxIdx])}
              alt=""
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        title={confirmDelete === "event" ? "Delete Event" : "Delete Image"}
        message={
          confirmDelete === "event"
            ? "This will permanently delete the event and all its photos."
            : "This image will be permanently deleted."
        }
        confirmText="Delete"
        danger
        onConfirm={() => {
          if (confirmDelete === "event") {
            handleDeleteEvent();
          } else {
            handleDeleteImage(confirmDelete);
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default EventDetailPage;
