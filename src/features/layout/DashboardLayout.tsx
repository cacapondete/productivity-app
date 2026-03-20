"use client";

import { LucideHome, LucideFile, LucideSettings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import client from '@/lib/pocketbase';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LucideHome },
  { name: 'Google Drive', href: '/google-drive', icon: LucideFile },
  { name: 'Settings', href: '/settings', icon: LucideSettings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold">Productivity Dashboard</div>
        <nav className="flex-1">
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-4 hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-700' : ''}`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4">
          <button
            onClick={() => {
              client.authStore.clear();
              localStorage.removeItem('google_token'); // Remove Google token on logout
              window.location.href = '/login';
            }}
            className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 overflow-auto">{children}</main>
    </div>
  );
}