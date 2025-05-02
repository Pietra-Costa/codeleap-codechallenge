import { useEffect, useState } from "react";
import { deletePost, editPost, fetchPosts } from "../../services/api";
import { useAuth } from "../../context/authcontext";
import { TbTrashXFilled } from "react-icons/tb";
import EditModal from "../../modals/edit";
import { HiPencilSquare } from "react-icons/hi2";
import DeleteModal from "../../modals/delete";

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

  useEffect(() => {
    getPosts();
  }, [refresh]);

  const getPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRequest = id => {
    setPostIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deletePost(postIdToDelete);
    setDeleteModalOpen(false);
    getPosts();
  };

  const handleEdit = (id, title, content) => {
    setEditData({ id, title, content });
    setEditModalOpen(true);
  };

  const handleEditSave = async (newTitle, newContent) => {
    await editPost(editData.id, { title: newTitle, content: newContent });
    getPosts();
  };

  return (
    <div className="space-y-6 m-6">
      {posts.map(post => (
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
          </div>
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
