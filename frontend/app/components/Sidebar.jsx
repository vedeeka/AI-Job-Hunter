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
  Bot,
  Mail
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuSections = [
    {
      label: 'DASHBOARD',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      ]
    },
    {
      label: 'JOBS',
      items: [
        { name: 'Job Search', icon: Search, path: '/dashboard/JobSearch' },
        { name: 'Email Scraper', icon: Mail, path: '/dashboard/email_section' },
      ]
    },
    {
      label: 'RESUME',
      items: [
        { name: 'Resume Doctor', icon: FileText, path: '/dashboard/resume' },
      ]
    },
    {
      label: 'TOOLS',
      items: [
        { name: 'Email Generator', icon: MessageSquare, path: '/dashboard/email_des' },
      ]
    }
  ];

  return (
    <aside className="fixed top-0 left-0 z-40 h-screen w-64 border-r flex flex-col transition-transform" style={{ background: '#fff', borderColor: '#e9d5ff' }}>
      
      {/* Logo */}
      <div className="h-20 flex items-center gap-3 px-6 border-b" style={{ borderColor: '#e9d5ff' }}>
        <div className="p-1.5 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' }}>
          <Bot size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight" style={{ color: '#7c3aed' }}>
          JobHunter.ai
        </span>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-8 px-0 space-y-8 overflow-y-auto">
        {menuSections.map((section) => (
          <div key={section.label}>
            <p className="px-6 text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#7c3aed', letterSpacing: '0.1em' }}>
              {section.label}
            </p>
            
            <div className="space-y-2 px-4">
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background: isActive ? '#f3f0ff' : 'transparent',
                      color: isActive ? '#7c3aed' : '#6b7280',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = '#faf5ff';
                        e.currentTarget.style.color = '#1e1b4b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                      }
                    }}
                  >
                    <item.icon 
                      size={20}
                      style={{ color: isActive ? '#7c3aed' : '#9ca3af', flexShrink: 0 }}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: '#e9d5ff' }}>
        <button 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium transition-all"
          style={{ color: '#6b7280' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#faf5ff';
            e.currentTarget.style.color = '#7c3aed';
            if (e.currentTarget.querySelector('svg')) {
              e.currentTarget.querySelector('svg').style.color = '#7c3aed';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6b7280';
            if (e.currentTarget.querySelector('svg')) {
              e.currentTarget.querySelector('svg').style.color = '#9ca3af';
            }
          }}
        >
          <Settings size={20} style={{ color: '#9ca3af', flexShrink: 0 }} />
          Settings
        </button>
        <button 
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium transition-all"
          style={{ color: '#dc2626' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fee2e2';
            if (e.currentTarget.querySelector('svg')) {
              e.currentTarget.querySelector('svg').style.color = '#dc2626';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            if (e.currentTarget.querySelector('svg')) {
              e.currentTarget.querySelector('svg').style.color = '#dc2626';
            }
          }}
        >
          <LogOut size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;