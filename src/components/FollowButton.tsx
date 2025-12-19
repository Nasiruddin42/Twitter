import React, { useState } from 'react';
import { followUser, unfollowUser } from '../api/apiService';

interface Props {
  userId: number;
  initialIsFollowing: boolean;
}

const FollowButton: React.FC<Props> = ({ userId, initialIsFollowing }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleFollow = async (e: React.MouseEvent) => {
    // PREVENT navigation if this button is inside a clickable row/card
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Action failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
      className={`min-w-[100px] px-4 py-1.5 rounded-full font-bold transition-all duration-200 ${
        isFollowing
          ? "bg-white text-black border border-gray-300 hover:border-red-200 hover:text-red-600 hover:bg-red-50"
          : "bg-black text-white hover:bg-gray-800"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? (
        "..."
      ) : isFollowing ? (
        isHovered ? "Unfollow" : "Following"
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default FollowButton;