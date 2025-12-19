import React, { useEffect, useState } from 'react';
import { getExploreUsers, followUser } from '../api/apiService';

const WhoToFollow: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    try {
      const res = await getExploreUsers();
      setUsers(res.data.slice(0, 3)); // Show only 3 suggestions
    } catch (err) {
      console.error("Failed to load explore users", err);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleFollow = async (id: number) => {
    await followUser(id);
    setUsers(users.filter(u => u.id !== id)); // Remove from list after following
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>
      <div className="space-y-4">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                {u.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm">{u.username}</p>
                <p className="text-gray-500 text-xs">@{u.username.toLowerCase()}</p>
              </div>
            </div>
            <button 
              onClick={() => handleFollow(u.id)}
              className="bg-black text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-gray-800 transition"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhoToFollow;