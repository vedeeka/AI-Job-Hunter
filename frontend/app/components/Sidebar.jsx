'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  MessageSquare, 
  Network, 
  Settings, 
  LogOut, 
  Zap,
  Mail,
  User,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Vedeeka Parab');
  const [userEmail, setUserEmail] = useState('vedeekaparab9999@gmail.com');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('user_name');
      const storedEmail = localStorage.getItem('user_email');
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('linkedinUrl');
      router.push('/auth/login');
    }
  };

  const menuSections = [
    {
      label: 'MAIN',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: null },
      ]
    },
    {
      label: 'JOB PIPELINE',
      items: [
        { name: 'Job Discovery', icon: Search, path: '/dashboard/JobSearch', badge: 'Live' },
        { name: 'Maps Leads & CSV', icon: Mail, path: '/dashboard/email_section', badge: 'CSV' },
      ]
    },
    {
      label: 'RESUME & ATS',
      items: [
        { name: 'Resume Doctor', icon: FileText, path: '/dashboard/resume', badge: 'ATS' },
        { name: 'Resume Builder', icon: Network, path: '/dashboard/resume_fromstart', badge: 'A4' },
      ]
    },
    {
      label: 'AI TOOLS',
      items: [
        { name: 'Cold Email Generator', icon: MessageSquare, path: '/dashboard/email_des', badge: 'AI' },
      ]
    }
  ];

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shadow-xs">
      
      {/* Brand Header */}
      <div>
        <div className="h-18 flex items-center justify-between px-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-brand text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Zap size={18} className="fill-white/20" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                JobHunter<span className="text-purple-600">.ai</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Career Agent
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="py-6 px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)]">
          {menuSections.map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                {section.label}
              </p>
              
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                        isActive 
                          ? 'gradient-brand text-white shadow-md shadow-purple-500/20' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon 
                          size={17} 
                          className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-purple-600 transition-colors'}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-purple-50 text-purple-600 border border-purple-100'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">{userName}</p>
              <p className="text-[10px] text-slate-500 truncate leading-tight">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;