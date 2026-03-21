"use client";

import { Menu } from 'lucide-react';
import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-black">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-[#FFFFFF]">
        <header className="sticky top-0 z-30 border-b border-black/5 bg-[#FFFFFF] lg:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-8 w-8 items-center justify-center text-black hover:opacity-70 transition-opacity"
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>
            <h1
              className="text-[10px]! uppercase font-light tracking-[0.6em] text-black"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              PRODUCTIVITY
            </h1>
          </div>
        </header>

        <main className="w-full bg-[#FFFFFF] px-4 py-6 md:px-8 md:py-10 lg:pl-64! lg:pr-20 lg:py-16">
          {children}
        </main>
      </div>
    </div>
  );
}