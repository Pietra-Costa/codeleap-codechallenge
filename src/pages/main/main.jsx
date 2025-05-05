import { useEffect, useState } from "react";
import { createPost } from "../../services/api";
import { useAuth } from "../../context/authContext";
import Feed from "../../components/feed/feed";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FiMoon, FiPaperclip, FiSun } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket } from "react-icons/fa";

export default function Main() {
  const { user, logout } = useAuth();
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [refresh, setRefresh] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [postStatus, setPostStatus] = useState(null);
  const [theme, setTheme] = useState("light");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return;

    setPostStatus("posting");

    try {
      const response = await createPost({
        username: user.displayName,
        title: newPost.title,
        content: newPost.content,
      });

      const postId = response.id;

      if (imagePreview && postId) {
        localStorage.setItem(`postImage_${postId}`, imagePreview);
      }

      setPostStatus("success");
      setTimeout(() => {
        setPostStatus(null);
        setNewPost({ title: "", content: "" });
        setImagePreview(null);
        setRefresh(!refresh);
      }, 1500);
    } catch (err) {
      console.error(err);
      setPostStatus(null);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPreferDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPreferDark) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex justify-center">
      <div
        className={`bg-white w-[800px] main transition-colors duration-300 dark:bg-gray-800 dark:text-gray-100`}
      >
        <header className="bg-primary p-[27px] flex justify-between items-center">
          <h1 className="text-white text-[22px] font-bold">CodeLeap Network</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"
                } theme`}
            >
              {theme === "light" ? (
                <FiMoon className="w-6 h-6 text-white" />
              ) : (
                <FiSun className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="text-white font-bold w-[40px] h-[40px] p-2 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <RiLogoutBoxLine className="text-2xl" />
            </button>
          </div>
        </header>

        <div className="border border-[#999999] m-6 p-6 rounded-2xl">
          <h1 className="font-bold text-[22px] mb-6">What's on your mind?</h1>
          <form>
            <div className="flex flex-col mb-6">
              <label className="font-normal text-[16px] mb-2">Title</label>
              <input
                className="border border-[#777777] rounded-lg p-2 placeholder:text-[#CCCCCC] text-[14px] font-normal dark:bg-gray-700 dark:border-gray-600 
             focus:outline-none focus:border-primary focus:ring-0"
                type="text"
                placeholder="Hello World"
                value={newPost.title}
                onChange={e =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="font-normal text-[16px] mb-2">Content</label>
              <textarea
                className="border border-[#777777] rounded-lg p-2 placeholder:text-[#CCCCCC] text-[14px] font-normal dark:bg-gray-700 dark:border-gray-600 
             focus:outline-none focus:border-primary focus:ring-0"
                name="content"
                placeholder="Content Here"
                value={newPost.content}
                onChange={e =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
              ></textarea>
            </div>
          </form>

          <div className="flex justify-center">
            {imagePreview && (
              <div className="w-60 h-60 flex items-center justify-center rounded-lg bg-gray-50 border border-primary mr-4 dark:bg-gray-700">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain p-2"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 relative">
            <div className="flex justify-between items-end mt-3">
              <label className="cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FiPaperclip className="text-2xl text-primary" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setImagePreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </motion.div>
              </label>
            </div>

            <AnimatePresence>
              {postStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute left-0 flex mt-4 sm:mt-5 items-center bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mr-2"
                  >
                    ✓
                  </motion.div>
                  Posted!
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleCreatePost}
              whileHover={{
                scale: !newPost.title || !newPost.content ? 1 : 1.05,
                boxShadow:
                  !newPost.title || !newPost.content
                    ? "none"
                    : "0 4px 15px rgba(0,0,0,0.2)",
              }}
              whileTap={{
                scale: !newPost.title || !newPost.content ? 1 : 0.95,
              }}
              className={`w-[120px] h-[32px] mt-4 rounded-lg text-white font-bold  relative overflow-hidden ${!newPost.title || !newPost.content
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark"
                }`}
              disabled={
                !newPost.title || !newPost.content || postStatus === "posting"
              }
            >
              <AnimatePresence mode="wait">
                {postStatus === "posting" ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-center items-center"
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2"
                    >
                      Posting...
                    </motion.span>
                  </motion.div>
                ) : postStatus === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { type: "spring", stiffness: 500 },
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center justify-center"
                  >
                    <motion.div
                      animate={{
                        y: [0, -15, 0],
                        rotate: [0, 0, 360],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 0.8,
                        ease: "easeInOut",
                      }}
                    >
                      <FaRocket className="text-xl" />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2"
                    >
                      Success!
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.2 },
                    }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              {!newPost.title || !newPost.content ? null : (
                <motion.span
                  className="absolute inset-0 bg-white opacity-0 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={postStatus === null ? { scale: 3, opacity: 0 } : {}}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          </div>
        </div>

        <Feed refresh={refresh} />
      </div>
    </div>
  );
}
