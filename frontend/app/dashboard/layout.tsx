import '../globals.css' 
import Sidebar from '../components/Sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 antialiased">
      {/* Sidebar stays fixed on the left */}
      <Sidebar />

      {/* Main Content - Pushed right by 64 (16rem/256px) matching sidebar width */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}