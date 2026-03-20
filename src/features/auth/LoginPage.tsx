"use client";

import { useState } from 'react';
import client from '@/lib/pocketbase';
import { useRouter } from 'next/navigation';
import { Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOAuthLogin = async (provider: 'google' | 'oidc') => {
    setLoading(true);
    setError(null);
    try {
      let authData;
      if (provider === 'google') {
        authData = await client.collection('users').authWithOAuth2({
          provider: 'google',
          scopes: [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
          ],
          urlQuery: {
            prompt: 'consent',
            access_type: 'offline',
          },
          redirectTo: 'http://localhost:3000/login',
        });
        const googleToken = authData.meta?.accessToken;
        if (googleToken) {
          localStorage.setItem('google_token', googleToken);
          router.push('/dashboard');
        } else {
          setError('Google access token is missing');
        }
      } else {
        authData = await client.collection('users').authWithOAuth2({
          provider: provider,
          redirectTo: process.env.NEXT_PUBLIC_CANVA_REDIRECT_URL || 'http://localhost:3000/login',
        });
      }

      if (client.authStore.isValid) {
        router.push('/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight">PRODUCTIVITY</h1>
          <div className="h-1 w-12 md:w-16 bg-black mx-auto mb-4"></div>
          <p className="text-gray-600 text-xs md:text-sm font-sans">Editorial Workspace Management</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-white border-l-4 border-l-red-600 text-red-600 text-sm font-sans">
            {error}
          </div>
        )}

        {/* Login Options */}
        <div className="space-y-4">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full px-6 py-3 bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-50 border border-black flex items-center justify-center gap-3 text-sm font-sans font-medium"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-8 font-sans">
          By signing in, you agree to our terms of service.
        </p>
      </div>
    </div>
  );
}
