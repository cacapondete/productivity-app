'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import client from '@/lib/pocketbase';
import { clearGoogleToken } from '@/hooks/useLocalStorage';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Google Drive', href: '/google-drive' },
  { name: 'Settings', href: '/settings' },
];

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    client.authStore.clear();
    clearGoogleToken();
    window.location.href = '/login';
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-[#080808] border-r border-white/[0.03] z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 rounded-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="absolute right-6 top-8 inline-flex h-8 w-8 items-center justify-center text-gray-400 hover:text-white lg:hidden transition-colors"
        aria-label="Close navigation menu"
      >
        <X size={16} />
      </button>

      {/* Branding */}
      <div className="pt-16 pb-12 px-8 border-b border-white/5">
        <h1
          className="text-xs uppercase font-light tracking-[0.6em] text-white/90 text-center"
          style={{ fontFamily: 'var(--font-display), serif' }}
        >
          PRODUCTIVITY
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-8 px-0">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name} className="relative">
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-[2px] bg-white"></div>
                )}
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block px-8 py-3 text-[13px] tracking-wide font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="mt-auto px-8 pb-10 pt-8 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
        >
          LOGOUT →
        </button>
      </div>
    </aside>
  );
}
