import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { 
  followUser, 
  unfollowUser, 
  getMyProfile 
} from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); 
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [murmurs, setMurmurs] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch User Info
      // Note: Since apiService doesn't have a generic 'getUser', we use the base api instance
      const profileRes = await api.get(`/users/${userId}`);
      
      // 2. Fetch that user's specific Murmurs
      const murmursRes = await api.get(`/murmurs/user/${userId}`);
      
      setProfile(profileRes.data);
      setMurmurs(murmursRes.data);
      setIsFollowing(profileRes.data.isFollowing); 
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchProfileData();
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    try {
      if (isFollowing) {
        // Matches your apiService: api.delete(`/api/users/${userId}/follow`)
        // NOTE: Remove the extra '/api' in your apiService.ts if the baseURL already has it!
        await unfollowUser(profile.id);
      } else {
        await followUser(profile.id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Follow action failed:", error);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;
  if (!profile) return <div className="p-10 text-center">User not found.</div>;

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="border-x border-gray-100 min-h-screen">
      {/* Top Navigation */}
      <div className="flex items-center p-3 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div className="ml-6">
          <h1 className="text-xl font-bold">{profile.username}</h1>
          <p className="text-gray-500 text-xs">{murmurs.length} Murmurs</p>
        </div>
      </div>

      {/* Profile Header */}
      <div className="h-32 bg-gray-200" />
      <div className="px-4 relative">
        <div className="absolute -top-16 left-4 w-32 h-32 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
          {profile.username[0].toUpperCase()}
        </div>
        
        <div className="flex justify-end py-4">
          {isOwnProfile ? (
            <button className="px-4 py-1.5 rounded-full border border-gray-300 font-bold hover:bg-gray-50">Edit profile</button>
          ) : (
            <button 
              onClick={handleFollowToggle}
              className={`px-6 py-1.5 rounded-full font-bold transition ${
                isFollowing 
                  ? "bg-white text-black border border-gray-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50" 
                  : "bg-black text-white"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-gray-500">@{profile.username.toLowerCase()}</p>
        </div>

        <div className="flex space-x-4 mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-1"><MapPin size={16}/> Dhaka</div>
          <div className="flex items-center gap-1"><Calendar size={16}/> Joined Dec 2025</div>
        </div>

        <div className="flex space-x-4 mt-4 pb-4">
          <div className="text-sm"><span className="font-bold">120</span> <span className="text-gray-500">Following</span></div>
          <div className="text-sm"><span className="font-bold">450</span> <span className="text-gray-500">Followers</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <div className="flex-1 py-4 text-center font-bold border-b-4 border-blue-500">Murmurs</div>
        <div className="flex-1 py-4 text-center text-gray-500 font-bold hover:bg-gray-50">Replies</div>
        <div className="flex-1 py-4 text-center text-gray-500 font-bold hover:bg-gray-50">Likes</div>
      </div>

      {/* Feed */}
      <div className="divide-y divide-gray-100">
        {murmurs.map((m) => (
          <div key={m.id} className="p-4 flex space-x-3 hover:bg-gray-50 transition">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold shrink-0">
              {profile.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <span className="font-bold">{profile.username}</span>
              <p className="mt-1">{m.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;