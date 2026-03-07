import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({ open, title, message, confirmText = "Confirm", cancelText = "Cancel", danger = false, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${danger ? "bg-red-500/10" : "bg-blue-500/10"}`}>
                <AlertTriangle className={`w-5 h-5 ${danger ? "text-red-400" : "text-blue-400"}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-gray-400 text-sm mt-1">{message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-5 py-2.5 border border-white/10 hover:border-white/20 rounded-xl text-gray-300 text-sm transition"
              >
                {cancelText}
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className={`px-5 py-2.5 rounded-xl text-white text-sm font-medium transition ${danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
