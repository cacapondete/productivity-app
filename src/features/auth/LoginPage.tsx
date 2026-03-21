"use client";

import { Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const { loginWithGoogle, loading, error } = useAuth();

  const handleOAuthLogin = async (provider: 'google') => {
    if (provider !== 'google') return;

    try {
      await loginWithGoogle();
    } catch {
      // handled in hook state
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[10px]! uppercase font-light tracking-[0.6em] mb-6 text-black" style={{ fontFamily: 'var(--font-display), serif' }}>PRODUCTIVITY</h1>
          <div className="h-px w-16 bg-black mx-auto mb-8"></div>
          <p className="text-gray-400 text-xs font-sans uppercase tracking-[0.15em]">Editorial Workspace</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-white border-l-2 border-l-black text-gray-700 text-[11px] font-sans">
            {error}
          </div>
        )}

        {/* Login Options */}
        <div className="space-y-4">
          <Button onClick={() => handleOAuthLogin('google')} disabled={loading} className="w-full flex items-center justify-center gap-3">
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-8 font-sans">
          By signing in, you agree to our terms of service.
        </p>
      </div>
    </div>
  );
}
