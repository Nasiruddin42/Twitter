import React, { useEffect, useState } from 'react';
import { getGlobalFeed, createMurmur, likeMurmur, unlikeMurmur, deleteMurmur } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import { Heart, Trash2, MessageCircle, Share } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [murmurs, setMurmurs] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);

  const formatTimestamp = (dateString: string) => {
  const postDate = new Date(dateString);
  const now = new Date();

  // Calculate difference in seconds
  let diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  // Handle server/client clock drift (if diff is negative or very small)
    diffInSeconds += 10800 ;
    if (diffInSeconds < 30) return `Just now`;
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    
    return postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const fetchFeed = async () => {
    try {
      const res = await getGlobalFeed();
      setMurmurs(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchFeed(); }, [page]);

  const handlePost = async () => {
    if (!content.trim()) return;
    await createMurmur(content);
    setContent('');
    fetchFeed();
  };

  return (
    <div className="bg-white">
      <div className="p-4 border-b border-gray-100 font-bold text-xl sticky top-0 bg-white/80 backdrop-blur-md">Home</div>
      
      {/* Composer */}
      <div className="p-4 border-b border-gray-100 flex space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">N</div>
        <div className="flex-1">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?" 
            className="w-full text-xl border-none focus:ring-0 placeholder-gray-500 resize-none pt-2"
          />
          <div className="flex justify-end mt-2 pt-2 border-t border-gray-50">
            <button onClick={handlePost} className="bg-blue-500 text-white px-5 py-1.5 rounded-full font-bold hover:bg-blue-600 transition">Post</button>
          </div>
        </div>
      </div>

      {/* Murmur List */}
      <div className="divide-y divide-gray-100">
        {murmurs.map((m) => (
          <div key={m.id} className="p-4 hover:bg-gray-50/50 transition flex space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="flex items-center space-x-1">
                  <span className="font-bold">@{m.user.username}</span>
                  <span className="text-gray-500 text-sm">· {formatTimestamp(m.createdAt)}</span>
                </div>
                {user?.id === m.user.id && (
                  <button onClick={() => deleteMurmur(m.id).then(fetchFeed)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="mt-1 text-[15px]">{m.content}</p>
              <div className="flex justify-between mt-3 text-gray-500 max-w-xs">
                <MessageCircle size={18} />
                <button className="flex items-center space-x-2 hover:text-pink-500 transition">
                  <Heart size={18} /> <span className="text-xs">{m.likeCount || 0}</span>
                </button>
                <Share size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (10 per page as per spec) */}
      <div className="flex justify-center space-x-4 p-6 border-t border-gray-100">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} className="text-blue-500 font-bold">Previous</button>
        <span className="text-gray-500">Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} className="text-blue-500 font-bold">Next</button>
      </div>
    </div>
  );
};

export default HomePage;