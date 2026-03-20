"use client";

import { Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-white">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xs font-serif font-light tracking-[0.2em] uppercase text-black">
          PRODUCTIVITY
        </h1>
      </div>

      {/* Main Content Desktop */}
      <main className="hidden lg:flex lg:flex-1 lg:ml-72 bg-white overflow-auto flex-col">
        <div className="flex-1">{children}</div>
      </main>

      {/* Main Content Mobile */}
      <main className="lg:hidden flex-1 bg-white overflow-auto w-full mt-16">
        <div className="min-h-full">{children}</div>
      </main>
    </div>
  );
}