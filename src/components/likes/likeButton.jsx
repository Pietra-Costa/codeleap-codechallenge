import React from "react";
import { useState } from "react";
import { useAuth } from "../../context/authcontext";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

function LikeButton({ postId, initialLikes = [] }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const userId = user?.uid;

  const hasLiked = likes.includes(userId);

  const toggleLike = () => {
    setLikes(prev =>
      hasLiked ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="ml-4 py-2">
      <button
        onClick={toggleLike}
        className={`flex items-center gap-1 mt-2 text-lg font-semibold transition duration-150 ${
          hasLiked ? "text-primary" : "text-gray-400"
        } hover:scale-105`}
      >
        {hasLiked ? <FaHeart /> : <CiHeart />} {likes.length} Like
        {likes.length !== 1 ? "s" : ""}
      </button>
    </div>
  );
}

export default LikeButton;
