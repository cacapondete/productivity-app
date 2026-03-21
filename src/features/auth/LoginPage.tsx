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
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[12px] uppercase font-light tracking-widest mb-8 text-white" style={{ fontFamily: 'var(--font-display), serif' }}>PRODUCTIVITY</h1>
          <div className="h-px w-16 bg-white/20 mx-auto mb-12"></div>
          <p className="text-gray-500 text-[11px] font-sans uppercase tracking-widest">Design Studio</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-[#121212] border-l-2 border-l-white/30 text-gray-300 text-[12px] font-sans">
            {error}
          </div>
        )}

        {/* Login Options */}
        <div className="space-y-4 mb-12">
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
        <p className="text-center text-[11px] text-gray-600 font-sans leading-relaxed">
          By signing in, you agree to our terms of<br />service and privacy policy.
        </p>
      </div>
    </div>
  );
}
