"use client";

import { Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-[#E0E0E0]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-[#080808]">
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#080808] lg:hidden">
          <div className="flex items-center gap-4 px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>
            <h1
              className="text-[10px] uppercase font-light tracking-[0.15em] text-white"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              PRODUCTIVITY
            </h1>
          </div>
        </header>

        <main className="w-full bg-[#080808] px-6 py-10 md:px-12 md:py-16 lg:pl-64 lg:pr-24 lg:py-20">
          {children}
        </main>
      </div>
    </div>
  );
}