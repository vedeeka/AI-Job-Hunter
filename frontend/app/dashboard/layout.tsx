import '../globals.css' 
import Sidebar from '..//components/Sidebar';

export const metadata = {
  title: 'AI Job Hunter',
  description: 'Automated Job Application Platform',
}

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <div className="flex min-h-screen">
          
          {/* Sidebar stays fixed on the left */}
          <Sidebar />

          {/* Main Content - Pushed right by 64 (16rem/256px) matching sidebar width */}
          <main className="flex-1 ml-64 ">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>

        </div>
      </body>
    </html>
  )
}