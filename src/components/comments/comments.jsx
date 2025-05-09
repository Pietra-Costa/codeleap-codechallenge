import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { IoIosArrowDown, IoIosArrowUp, IoMdSend } from "react-icons/io";
import { SiTheconversation } from "react-icons/si";
import { TbTrashXFilled } from "react-icons/tb";
import MentionInput from "../mention/mentionInput";
import { motion, AnimatePresence } from "framer-motion";

function Comments({ postId, postOwner }) {
  const { user } = useAuth();
  const userName = user?.displayName || "Anônimo";
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const localStorageKey = `comments_${postId}`;

  useEffect(() => {
    const storedComments = localStorage.getItem(localStorageKey);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [postId]);

  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(localStorageKey, JSON.stringify(comments));
    }
  }, [comments, localStorageKey]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newCommentData = {
      id: crypto.randomUUID(),
      userName: userName,
      text: newComment,
      timeStamp: new Date().toISOString(),
      avatarColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };

    setComments(prevComments => [newCommentData, ...prevComments]);
    setNewComment("");
    setIsSubmitting(false);
  };

  const handleDeleteComment = async commentId => {
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (commentElement) {
      commentElement.classList.add("opacity-0", "scale-95");
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setComments(prevComments =>
      prevComments.filter(comment => comment.id !== commentId)
    );
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const canDeleteComment = comment => {
    return comment.userName === userName || postOwner === userName;
  };

  return (
    <div className="border-t border-primary p-6 bg-white dark:bg-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] text-[#777777] font-bold">Comments</h2>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="text-lg text-[#7695EC] font-medium hover:underline transition-all"
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <IoIosArrowUp />
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="comments-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-8">
                  <SiTheconversation className="text-3xl text-primary" />
                  <h3 className="mt-2 text-sm font-medium text-primary">
                    No Comments
                  </h3>
                </div>
              ) : (
                comments.map(comment => (
                  <motion.div
                    id={`comment-${comment.id}`}
                    key={comment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 bg-primary/30 rounded-lg border border-gray-200 hover:border-primary transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: comment.avatarColor }}
                      >
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#777777] dark:text-white truncate">
                            @{comment.userName}
                          </p>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.timeStamp).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-1 whitespace-pre-line">{comment.text}</p>
                      </div>
                      {canDeleteComment(comment) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-100 group-hover:opacity-100 text-[20px] dark:text-white text-gray-400 hover:text-primary transition-all"
                          title="Excluir comentário"
                        >
                          <TbTrashXFilled />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="relative">
                <MentionInput
                  value={newComment}
                  onChange={(event, newValue) => setNewComment(newValue)}
                  onKeyDown={handleKeyDown}
                  disabled={isSubmitting}
                  className={"bg-transparent"}
                />

                {/* Loading bar animation */}
                <AnimatePresence>
                  {isSubmitting && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-0.5 bg-[#7695EC] rounded-full"
                    />
                  )}
                </AnimatePresence>

                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className={`absolute right-2 bottom-2 p-2 rounded-full ${!newComment.trim() || isSubmitting
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#7695EC] hover:bg-blue-50"
                    } transition-colors`}
                >
                  <IoMdSend className="text-2xl" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Press Enter to send, Shift+Enter to break the line
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Comments;