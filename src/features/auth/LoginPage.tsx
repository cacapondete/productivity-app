"use client";

import { useState } from 'react';
import client from '@/lib/pocketbase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOAuthLogin = async (provider: 'google' | 'canva') => {
    setLoading(true);
    try {
      // PocketBase v0.22+ nggunakake authWithOAuth2 sing luwih praktis, bolo.
      // Iki bakal otomatis buka popup utawa redirect ning provider-e.
      const authData = await client.collection('users').authWithOAuth2({
        provider: provider,
        // Redirect URL iki kudu padha karo sing mbok set ning Google/Canva Console mau
        // Gunakno fallback string '' ben TypeScript ra ngamuk, jir.
        redirectTo: provider === 'google' 
          ? (process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || 'http://localhost:3000/login')
          : (process.env.NEXT_PUBLIC_CANVA_REDIRECT_URL || 'http://localhost:3000/login'),
      });

      if (client.authStore.isValid) {
        console.log('Login success:', authData);
        router.push('/dashboard'); // Langsung gas menyang dashboard, bosku!
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login ${provider} gagal, cok. Cek maneh Client ID karo Secret-mu ning PocketBase.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-900 dark:text-white">
          Welcome Back, Hos!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
          Manage your creative workflow in one place.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
          >
            {/* Sampeyan iso nambahke icon Google ning kene mengko */}
            {loading ? 'Processing...' : 'Continue with Google'}
          </button>

          <button
            onClick={() => handleOAuthLogin('canva')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all shadow-md shadow-purple-200 dark:shadow-none disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Continue with Canva'}
          </button>
        </div>

        <p className="mt-8 text-xs text-center text-gray-400">
          Powered by Rakahomelab & PocketBase 🚀
        </p>
      </div>
    </div>
  );
}