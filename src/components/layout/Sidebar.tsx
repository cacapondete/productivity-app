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
      className={`fixed left-0 top-0 h-full w-64 bg-white border-r z-50 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ borderRightColor: 'rgba(0, 0, 0, 0.05)' }}
    >
      <div className="relative px-8 pt-12 pb-8">
        <h1
          className="text-[10px]! uppercase font-light tracking-[0.6em] text-black"
          style={{ fontFamily: 'var(--font-display), serif' }}
        >
          PRODUCTIVITY
        </h1>
        <button
          onClick={onClose}
          className="absolute right-5 top-9 inline-flex h-8 w-8 items-center justify-center text-black lg:hidden"
          aria-label="Close navigation menu"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block px-8 py-3 text-[12px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors ${isActive ? 'text-black' : ''}`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto px-8 pb-10 pt-6">
        <button
          onClick={handleLogout}
          className="text-[12px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          LOGOUT →
        </button>
      </div>
    </aside>
  );
}
