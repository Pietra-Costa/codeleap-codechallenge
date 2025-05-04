import { useEffect, useState } from "react";
import { deletePost, editPost, fetchPosts } from "../../services/api";
import { useAuth } from "../../context/authcontext";
import { TbTrashXFilled } from "react-icons/tb";
import { HiPencilSquare } from "react-icons/hi2";
import EditModal from "../../modals/edit";
import DeleteModal from "../../modals/delete";
import LikeButton from "../likes/likeButton";
import Comments from "../comments/comments";

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

  useEffect(() => {
    getPosts();
  }, [refresh]);

  const getPosts = async () => {
    try {
      const data = await fetchPosts();
      const postsWithImages = data.results.map(post => {
        const image = localStorage.getItem(`postImage_${post.id}`);
        return image ? { ...post, image } : post;
      });
      setPosts(postsWithImages);
    } catch (err) {
      console.error(err);
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
      getPosts();
    } catch (err) {
      console.error("Erro ao excluir post:", err);
    }
  };

  const handleEdit = (id, title, content) => {
    setEditData({ id, title, content });
    setEditModalOpen(true);
  };

  const handleEditSave = async (newTitle, newContent) => {
    await editPost(editData.id, { title: newTitle, content: newContent });
    setEditModalOpen(false);
    getPosts();
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
    .sort((a, b) => (filterType === "recent" ? b.id - a.id : 0));

  return (
    <div className="space-y-6 m-6">
      <div className="mb-4 space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="w-full p-2 pl-8 border border-primary rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
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

        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType("mine")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              filterType === "mine"
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Meus
          </button>
        </div>
      </div>

      {filteredPosts.map(post => (
        <div
          key={post.id}
          className="rounded-2xl shadow overflow-hidden border border-[#999999]"
        >
          <div className="flex justify-between items-center bg-primary px-4 py-2">
            <h3 className="text-[22px] font-bold text-white">{post.title}</h3>
            {post.username === user.displayName && (
              <div className="space-x-6">
                <button
                  onClick={() => handleDeleteRequest(post.id)}
                  className="text-white text-[22px]"
                >
                  <TbTrashXFilled />
                </button>
                <button
                  onClick={() => handleEdit(post.id, post.title, post.content)}
                  className="text-white text-[22px] font-bold"
                >
                  <HiPencilSquare />
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-white">
            <p className="text-sm text-[#777777] font-bold mb-4">
              @{post.username}
            </p>
            <p className="font-normal text-[18px]">{post.content}</p>

            {post.image && (
              <div className="mt-4">
                <img
                  src={post.image}
                  alt="uploaded"
                  className="max-w-xs rounded-lg border"
                />
              </div>
            )}
          </div>

          <LikeButton postId={post.id} initialLikes={post.likes || []} />
          <Comments postId={post.id} />
        </div>
      ))}

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
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
