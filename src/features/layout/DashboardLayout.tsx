"use client";

import { LucideHome, LucideCheckSquare, LucideFile, LucideSettings, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import client from '@/lib/pocketbase';
import { clearGoogleToken } from '@/hooks/useLocalStorage';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LucideHome },
  { name: 'Tasks', href: '/tasks', icon: LucideCheckSquare },
  { name: 'Google Drive', href: '/google-drive', icon: LucideFile },
  { name: 'Settings', href: '/settings', icon: LucideSettings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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

      {/* Sidebar */}
      <aside className={`fixed lg:static w-64 h-screen border-r border-black bg-white flex flex-col z-50 transform transition-transform duration-300 lg:transform-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-4 md:p-5 border-b border-black flex items-center justify-between">
          <h1 className="text-lg font-serif font-semibold tracking-tight">PRODUCTIVITY</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-0">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 font-sans text-sm transition-all border-b border-gray-200 ${
                      isActive 
                        ? 'text-black font-semibold border-l-2 border-l-black bg-gray-50' 
                        : 'text-gray-700 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-3 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 md:p-5 border-t border-black">
          <button
            onClick={() => {
              client.authStore.clear();
              clearGoogleToken();
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 transition-colors border border-black text-xs font-medium font-sans"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content - with proper margin on desktop */}
      <main className="flex-1 bg-white overflow-auto w-full lg:w-auto lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-serif font-semibold">PRODUCTIVITY</h1>
        </div>
        <div className="min-h-full">{children}</div>
      </main>
    </div>
  );
}