'use client';

import { LucideHome, LucideCheckSquare, LucideFile, LucideSettings, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import client from '@/lib/pocketbase';
import { clearGoogleToken } from '@/hooks/useLocalStorage';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LucideHome },
  { name: 'Tasks', href: '/tasks', icon: LucideCheckSquare },
  { name: 'Google Drive', href: '/google-drive', icon: LucideFile },
  { name: 'Settings', href: '/settings', icon: LucideSettings },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    client.authStore.clear();
    clearGoogleToken();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-72 h-screen bg-white flex flex-col border-r border-black z-50 transform transition-transform duration-300 lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Branding */}
        <div className="flex items-center justify-between px-8 py-10 border-b border-black">
          <h1 className="text-xs font-serif font-light tracking-[0.2em] uppercase text-black">
            PRODUCTIVITY
          </h1>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-0 py-6">
          <ul className="space-y-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center px-8 py-4 font-sans text-sm transition-all border-b border-gray-200 ${
                      isActive
                        ? 'text-black font-semibold bg-gray-50'
                        : 'text-gray-700 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    {isActive && (
                      <span className="inline-block w-1.5 h-1.5 bg-black rounded-full mr-3 shrink-0" />
                    )}
                    <item.icon className={`w-4 h-4 ${isActive ? '' : 'mr-3'} shrink-0`} />
                    <span className={isActive ? 'ml-3' : 'ml-3'}>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="px-8 py-6 border-t border-black">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs font-sans font-semibold"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
