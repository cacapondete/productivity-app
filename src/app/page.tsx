"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import client from '@/lib/pocketbase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (client.authStore.isValid) {
      router.push('/dashboard');
    } else {
      // Otherwise redirect to login
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <p className="text-[11px] font-serif font-semibold uppercase tracking-[0.24em] text-black">
        Loading...
      </p>
    </div>
  );
}
