'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import GoogleButton from '@/components/GoogleButton';

export default function SignInPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-dark-slate-950 px-2">
      <div className="w-full max-w-md px-4 py-8 space-y-6 bg-dark-slate-900 rounded-xl shadow-xl border border-dark-slate-700">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-dark-slate-100 font-medium">Sign in or create an account to get started</p>
        </div>
        <div className="space-y-6">
          <div className="py-8 border border-dark-slate-600 rounded-lg bg-dark-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-center">Continue with</h2>
            <div className="flex justify-center">
              <GoogleButton onClick={handleGoogleSignIn} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
