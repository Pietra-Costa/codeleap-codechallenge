import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authcontext";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

function LikeButton({ postId, initialLikes = [], onPostDeleted }) {
  const { user } = useAuth();
  const userId = user?.uid;
  const localStorageKey = `likes_${postId}`;

  const [likes, setLikes] = useState(() => {
    const storedLikes = localStorage.getItem(localStorageKey);
    return storedLikes ? JSON.parse(storedLikes) : initialLikes;
  });

  const hasLiked = likes.includes(userId);

  const toggleLike = () => {
    const updatedLikes = hasLiked
      ? likes.filter(id => id !== userId)
      : [...likes, userId];
    setLikes(updatedLikes);
    localStorage.setItem(localStorageKey, JSON.stringify(updatedLikes));
  };

  useEffect(() => {
    if (onPostDeleted) {
      onPostDeleted(postId);
    }
  }, [onPostDeleted, postId]);

  useEffect(() => {
    const storedLikes = localStorage.getItem(localStorageKey);
    if (storedLikes) {
      setLikes(JSON.parse(storedLikes));
    }
  }, [localStorageKey]);

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
