'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import client from '@/lib/pocketbase';
import { setGoogleToken, clearGoogleToken } from './useLocalStorage';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const authData = await client.collection('users').authWithOAuth2({
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
      if (!googleToken) {
        throw new Error('Google access token is missing');
      }

      setGoogleToken(googleToken);
      if (client.authStore.isValid) {
        router.push('/dashboard');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    client.authStore.clear();
    clearGoogleToken();
    router.push('/login');
  }, [router]);

  return {
    loginWithGoogle,
    logout,
    loading,
    error,
    isAuthenticated: client.authStore.isValid,
    user: client.authStore.model,
  };
}
