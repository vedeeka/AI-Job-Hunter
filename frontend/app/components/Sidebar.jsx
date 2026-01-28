'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  MessageSquare, 
  Network, 
  Settings, 
  LogOut, 
  Bot ,Mail
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname(); // Next.js hook to get current URL

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Job Search', icon: Search, path: '/dashboard/JobSearch' },
    { name: 'Email Scraper', icon: Mail, path: '/dashboard/email_section' },
    { name: 'Resume Doctor', icon: FileText, path: '/dashboard/resume' },
    { name: 'Email Generator', icon: MessageSquare, path: '/dashboard/email_des' },
    
  ];

  
  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform">
      
      {/* 1. Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
          <Bot size={20} />
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">
          JobHunter<span className="text-indigo-600">.ai</span>
        </span>
      </div>

      {/* 2. Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Platform
        </p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* 3. Footer */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Settings size={18} />
          Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;