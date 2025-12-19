import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Hash, User, Search } from 'lucide-react';
import WhoToFollow from './WhoToFollow';
import FollowButton from './FollowButton';

const Layout: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const location = useLocation();

  // Helper to determine if the "Profile" link should be bold
  // This checks if we are on /profile/:id
  const isProfileActive = location.pathname.startsWith('/profile');

  return (
    <div className="min-h-screen bg-white flex justify-center w-full">
      <div className="flex w-full max-w-[1250px]">
        
        {/* --- LEFT COLUMN: FIXED NAVIGATION --- */}
        <aside className="w-[275px] hidden md:flex flex-col sticky top-0 h-screen px-4 border-r border-gray-100 shrink-0">
          <div className="p-3 mb-2 font-bold text-2xl text-blue-600">M</div>
          <nav className="flex-1 space-y-1">
            <Link 
              to="/" 
              className={`flex items-center w-fit p-3 pr-8 rounded-full hover:bg-gray-100 transition ${location.pathname === '/' ? 'font-bold' : ''}`}
            >
              <Home size={28} /> <span className="ml-5 text-xl">Home</span>
            </Link>
            
            <div className="flex items-center w-fit p-3 pr-8 rounded-full hover:bg-gray-100 transition cursor-pointer">
              <Hash size={28} /> <span className="ml-5 text-xl">Explore</span>
            </div>

            {/* UPDATED: Dynamic Link to YOUR specific profile using user.id */}
            <Link 
              to={user ? `/profile/${user.id}` : '/login'} 
              className={`flex items-center w-fit p-3 pr-8 rounded-full hover:bg-gray-100 transition ${isProfileActive ? 'font-bold' : ''}`}
            >
              <User size={28} /> <span className="ml-5 text-xl">Profile</span>
            </Link>
          </nav>
          
          {/* User Profile / Logout section */}
          <div onClick={handleLogout} className="mb-4 p-3 flex items-center justify-between hover:bg-gray-100 rounded-full cursor-pointer transition" title="Click to Logout">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold uppercase">
                {user?.username?.[0] || 'N'}
              </div>
              <div className="ml-3">
                <p className="font-bold text-[15px]">{user?.username || 'Nasir'}</p>
                <p className="text-gray-500 text-sm">@{user?.username?.toLowerCase() || 'nasir'}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* --- MIDDLE COLUMN: SCROLLABLE FEED --- */}
        <main className="flex-1 max-w-[600px] border-r border-gray-100 min-h-screen">
          <Outlet />
        </main>

        {/* --- RIGHT COLUMN: TRENDS PANEL --- */}
        <aside className="w-[350px] hidden lg:block ml-8 py-2 sticky top-0 h-fit space-y-4 shrink-0">
          {/* Search Bar */}
          <div className="bg-gray-100 rounded-full flex items-center px-4 py-2 mt-2 border border-transparent focus-within:bg-white focus-within:border-blue-500 transition-all">
            <Search className="text-gray-500" size={18} />
            <input type="text" placeholder="Search Murmur" className="bg-transparent border-none focus:ring-0 ml-3 w-full" />
          </div>

          {/* Trends Section */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">What's happening</h2>
            <div className="space-y-4">
              <TrendItem category="Trending in Bangladesh" title="Season 6" posts="25.9K" />
              <TrendItem category="Trending in Bangladesh" title="Deposit" posts="37.3K" />
            </div>
          </div>

          {/* Who to Follow Section */}
          <WhoToFollow /> 
        </aside>

      </div>
    </div>
  );
};

const TrendItem = ({ category, title, posts }: any) => (
  <div className="cursor-pointer hover:bg-gray-100 p-1 rounded-lg transition">
    <p className="text-gray-500 text-xs">{category}</p>
    <p className="font-bold">{title}</p>
    <p className="text-gray-500 text-xs">{posts} posts</p>
  </div>
);

export default Layout;