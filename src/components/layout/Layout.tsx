import { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col md:flex-row">
       <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
       
       <div className="flex-1 flex flex-col min-w-0">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-6 overflow-y-auto">
             <Outlet />
          </main>
       </div>
    </div>
  );
}
