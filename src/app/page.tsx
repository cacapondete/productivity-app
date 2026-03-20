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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-black"></div>
    </div>
  );
}
