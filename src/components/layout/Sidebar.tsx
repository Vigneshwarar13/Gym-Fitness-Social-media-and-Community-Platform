import { Link, useLocation } from 'react-router-dom';
import { Home, User, Activity, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '../../utils/utils';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Fitness Tracker', href: '/tracker', icon: Activity },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-dark-900 border-r border-gray-800 transition-transform duration-200 ease-in-out md:static md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center px-6 font-bold text-xl text-primary md:hidden">
          GymSocial
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
                onClick={() => onClose()}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-300")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-500" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
