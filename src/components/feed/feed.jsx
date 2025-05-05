import { useEffect, useState } from "react";
import { deletePost, editPost, fetchPosts } from "../../services/api";
import { useAuth } from "../../context/authContext";
import { TbTrashXFilled } from "react-icons/tb";
import { HiPencilSquare } from "react-icons/hi2";
import EditModal from "../../modals/edit";
import DeleteModal from "../../modals/delete";
import LikeButton from "../likes/likeButton";
import Comments from "../comments/comments";
import { VscRobot } from "react-icons/vsc";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";

export default function Feed({ refresh }) {
  const { user } = useAuth();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: null,
    title: "",
    content: "",
  });
  const [posts, setPosts] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [page, setPage] = useState(1);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    getPosts();
  }, [refresh]);

  const getPosts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const data = await fetchPosts(page, 10);
      const postsWithImages = data.results.map(post => {
        const image = localStorage.getItem(`postImage_${post.id}`);
        return image ? { ...post, image } : post;
      });

      if (data.results.length < 10) {
        setHasMorePosts(false);
      }

      setPosts(prevPosts => {
        const newPosts = postsWithImages.filter(
          post => !prevPosts.some(existingPost => existingPost.id === post.id)
        );
        return [...prevPosts, ...newPosts];
      });

      setPage(prevPage => prevPage + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = id => {
    setPostIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(postIdToDelete);

      localStorage.removeItem(`postImage_${postIdToDelete}`);
      localStorage.removeItem(`likes_${postIdToDelete}`);
      localStorage.removeItem(`comments_${postIdToDelete}`);

      setDeleteModalOpen(false);

      setPosts(prevPosts =>
        prevPosts.filter(post => post.id !== postIdToDelete)
      );
    } catch (err) {
      console.error("Erro ao excluir post:", err);
    }
  };

  const handleEdit = (id, title, content) => {
    setEditData({ id, title, content });
    setEditModalOpen(true);
  };

  const handleEditSave = async (newTitle, newContent) => {
    try {
      await editPost(editData.id, { title: newTitle, content: newContent });

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === editData.id
            ? { ...post, title: newTitle, content: newContent }
            : post
        )
      );

      setEditModalOpen(false);
    } catch (err) {
      console.error("Erro ao editar post:", err);
    }
  };

  const filteredPosts = posts
    .filter(post =>
      filterType === "mine" ? post.username === user.displayName : true
    )
    .filter(post => {
      const text = filterText.toLowerCase();
      return (
        post.title.toLowerCase().includes(text) ||
        post.content.toLowerCase().includes(text) ||
        post.username.toLowerCase().includes(text)
      );
    })
    .sort((a, b) => b.id - a.id);

  const handleScroll = e => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && hasMorePosts) {
      getPosts();
    }
  };

  const handleImageClick = imageSrc => {
    if (isImageEnlarged && selectedImage === imageSrc) {
      setIsImageEnlarged(false);
      setSelectedImage("");
    } else {
      setIsImageEnlarged(true);
      setSelectedImage(imageSrc);
    }
  };

  const postAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="space-y-6 m-6" onScroll={handleScroll}>
      <div className="mb-4 space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="placeholder:text-[#777777CC] w-full p-2 pl-8 border border-primary rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg
            className="absolute left-2 top-2.5 h-4 w-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-wrap gap-1 mb-6">
          <motion.button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filterType === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200 text-primary"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Todos
          </motion.button>
          <motion.button
            onClick={() => setFilterType("mine")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filterType === "mine"
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200 text-primary"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Meus
          </motion.button>
        </div>
      </div>

      {filteredPosts.map((post, index) => (
        <motion.div
          key={post.id}
          className="rounded-2xl shadow overflow-hidden border border-[#999999]"
          initial="hidden"
          animate="visible"
          variants={postAnimation}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -3 }}
        >
          <div className="flex justify-between items-center bg-primary px-4 py-2">
            <h3 className="text-[22px] font-bold text-white">{post.title}</h3>
            {post.username === user.displayName && (
              <div className="space-x-6">
                <motion.button
                  onClick={() => handleDeleteRequest(post.id)}
                  className="text-white text-[22px] transition-transform transform hover:scale-110 active:scale-90"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <TbTrashXFilled />
                </motion.button>
                <motion.button
                  onClick={() => handleEdit(post.id, post.title, post.content)}
                  className="text-white text-[22px] font-bold transition-transform transform hover:scale-110 active:scale-90"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiPencilSquare />
                </motion.button>
              </div>
            )}
          </div>

          <div className="p-4 bg-white dark:bg-gray-700">
            <div className="flex justify-between">
              <p className="text-[18px] text-[#777777] dark:text-primary font-bold mb-4">
                @{post.username}
              </p>
              <p className="text-[18px] text-[#777777] mt-1">
                {formatDistanceToNow(new Date(post.created_datetime), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <p className="font-normal text-[18px]">{post.content}</p>

            <div className="flex justify-center">
              {post.image && (
                <motion.div className="mt-4" whileHover={{ scale: 1.02 }}>
                  <img
                    src={post.image}
                    alt="uploaded"
                    className="max-w-xs rounded-lg border border-primary cursor-pointer"
                    onClick={() => handleImageClick(post.image)}
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="dark:bg-gray-700">
            <LikeButton postId={post.id} initialLikes={post.likes || []} />
          </div>
          <Comments postId={post.id} postOwner={post.username} />
        </motion.div>
      ))}

      {isImageEnlarged && selectedImage && (
        <motion.div
          className="fixed top-0 left-0 right-0 bottom-0 bg-[#777777CC] bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setIsImageEnlarged(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={selectedImage}
            alt="Enlarged"
            className="w-2xl max-h-full object-contain"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </motion.div>
      )}

      {!hasMorePosts && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex flex-col items-center">
            <VscRobot className="text-primary text-3xl mb-1 animate-[bounce_2s_ease-in-out_infinite]" />
            <p className="text-primary text-sm font-medium">No more posts...</p>
          </div>
        </motion.div>
      )}

      <EditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditData({ id: null, title: "", content: "" });
        }}
        onSave={handleEditSave}
        initialTitle={editData.title}
        initialContent={editData.content}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
