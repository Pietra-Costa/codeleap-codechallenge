import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  initialTitle,
  initialContent,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = () => {
    onSave(title, content);
    onClose();
  };

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
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-gray-700 sm:m-4 m-2 p-4 sm:p-6 rounded-xl w-full sm:w-[660px] max-w-[660px] shadow-xl"
          >
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[22px] font-bold mb-6"
            >
              Edit Item
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="font-normal text-base">Title</label>
              <motion.input
                className="placeholder:text-[14px] w-full border border-[#777777] mt-2 mb-6 p-2 rounded-lg dark:bg-gray-600 dark:border-gray-500"
                placeholder="Hello World"
                value={title}
                onChange={e => setTitle(e.target.value)}
                whileFocus={{
                  borderColor: "#47B960",
                  boxShadow: "0 0 0 2px rgba(71, 185, 96, 0.2)",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="font-normal text-base mb-2">Content</label>
              <motion.textarea
                className="placeholder:text-[14px] w-full border border-[#777777] mt-2 mb-6 p-2 rounded-lg dark:bg-gray-600 dark:border-gray-500"
                value={content}
                placeholder="Content Here"
                onChange={e => setContent(e.target.value)}
                whileFocus={{
                  borderColor: "#47B960",
                  boxShadow: "0 0 0 2px rgba(71, 185, 96, 0.2)",
                }}
              />
            </motion.div>

            <motion.div
              className="flex justify-end gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{
                  scale: 1.03,
                  backgroundColor: "#f0f0f0",
                  borderColor: "#999",
                }}
                whileTap={{ scale: 0.98 }}
                className="border border-black rounded-lg font-bold text-base h-8 w-[120px] px-8 dark:border-gray-500 dark:text-gray-200"
                onClick={onClose}
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={
                  !title || !content
                    ? {}
                    : {
                        scale: 1.05,
                        boxShadow: "0 4px 8px rgba(71, 185, 96, 0.3)",
                      }
                }
                whileTap={!title || !content ? {} : { scale: 0.95 }}
                className={`rounded-lg font-bold text-base h-8 w-[120px] px-8 ${
                  !title || !content
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#47B960] text-white"
                }`}
                disabled={!title || !content}
                onClick={handleSubmit}
              >
                {!title || !content ? (
                  "Save"
                ) : (
                  <motion.span
                    key="save-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Save
                  </motion.span>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
