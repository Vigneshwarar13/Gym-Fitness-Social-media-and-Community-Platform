import { Search, Bell, MessageSquare, Menu } from 'lucide-react';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-800 bg-dark-900/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-dark-900/60">
      <button className="md:hidden text-gray-400 hover:text-white" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex items-center gap-2 font-bold text-xl text-primary">
        <span className="hidden md:inline">GymSocial</span>
      </div>

      <div className="flex-1 md:ml-auto md:max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search users, trainers, gyms..."
            className="pl-9 bg-gray-800 border-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-secondary" />
        </button>
        <button className="text-gray-400 hover:text-white">
          <MessageSquare className="h-5 w-5" />
        </button>
        
        <Link to="/profile" className="h-8 w-8 rounded-full bg-gray-700 overflow-hidden">
           <img src={user?.avatar || user?.profilePic || "https://github.com/shadcn.png"} alt="Profile" className="h-full w-full object-cover" />
        </Link>
      </div>
    </header>
  );
}
