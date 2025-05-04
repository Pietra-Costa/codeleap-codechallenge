import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-[#777777CC] bg-opacity-80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-700 rounded-xl w-[90%] sm:w-[660px] max-w-[660px] h-auto sm:h-[146px] p-6 shadow-xl"
          >
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[22px] font-bold mb-[40px] sm:text-left"
            >
              Are you sure you want to delete this item?
            </motion.h2>

            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#f0f0f0" }}
                whileTap={{ scale: 0.98 }}
                className="border border-[#999999] h-[32px] rounded-lg px-6 sm:px-8 text-base font-bold dark:border-gray-500 dark:text-gray-200"
                onClick={onClose}
              >
                Cancel
              </motion.button>

              <motion.button
                initial={{ scale: 1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 4px 8px rgba(255, 81, 81, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="border border-[#FF5151] h-[32px] bg-[#FF5151] rounded-lg text-white px-6 sm:px-8 text-base font-bold"
                onClick={onConfirm}
              >
                <motion.span
                  key="delete-text"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                >
                  Delete
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
