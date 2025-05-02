import { useState } from "react";
import { createPost } from "../../services/api";
import { useAuth } from "../../context/authcontext";
import Feed from "../../components/feed/feed";
import { RiLogoutBoxLine } from "react-icons/ri";

export default function Main() {
  const { user, logout } = useAuth();
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [refresh, setRefresh] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return;
    try {
      await createPost({
        username: user.displayName,
        title: newPost.title,
        content: newPost.content,
      });
      setNewPost({ title: "", content: "" });
      setRefresh(!refresh);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center">
      <div></div>
      <div className="bg-white w-[800px]">
        <header className="bg-primary p-[27px] flex justify-between">
          <h1 className="text-white text-[22px] font-bold">CodeLeap Network</h1>
          <button
            onClick={handleLogout}
            className="text-white font-bold w-[40px] h-[40px]p-2 rounded-full flex items-center justify-center"
          >
            <RiLogoutBoxLine className="text-2xl" />
          </button>
        </header>

        <div className="border border-[#999999] m-6 p-6 rounded-2xl">
          <h1 className="font-bold text-[22px] mb-6">What's on your mind?</h1>
          <form>
            <div className="flex flex-col mb-6">
              <label className="font-normal text-[16px] mb-2">Title</label>
              <input
                className="border border-[#777777] rounded-lg p-2 placeholder:text-[#CCCCCC] text-[14px] font-normal"
                type="text"
                placeholder="Hello World"
                value={newPost.title}
                onChange={e =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="font-normal text-[16px] mb-2">Content</label>
              <textarea
                className="border border-[#777777] rounded-lg p-2 placeholder:text-[#CCCCCC] text-[14px] font-normal"
                name="content"
                placeholder="Content Here"
                value={newPost.content}
                onChange={e =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
              ></textarea>
            </div>
          </form>

          <div className="flex justify-end">
            <button
              onClick={handleCreatePost}
              className={`w-[120px] mt-4 rounded-lg text-white font-bold py-1.5 ${
                !newPost.title || !newPost.content
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary"
              }`}
              disabled={!newPost.title || !newPost.content}
            >
              Create
            </button>
          </div>
        </div>

        <Feed refresh={refresh} />
      </div>
    </div>
  );
}
