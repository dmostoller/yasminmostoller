'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import GoogleButton from '@/components/GoogleButton';
import { Shield, Lock, UserCheck } from 'lucide-react';

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
    <div className="min-h-[90vh] flex flex-col justify-center items-center bg-dark-slate-950 px-4">
      <div className="w-full max-w-2xl px-6 py-10 space-y-8 bg-[var(--background)] rounded-xl shadow-xl border border-[var(--card-border)]">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-t from-violet-600 via-blue-500 to-teal-400 bg-clip-text text-transparent">
            Welcome
          </h1>
          <p className="text-[var(--text-primary)] text-lg">
            Sign in to access or create your account
          </p>
        </div>

        {/* Privacy and Security Information */}
        <div className="grid md:grid-cols-3 gap-6 py-6">
          <div className="text-center p-4 space-y-3">
            <Shield className="mx-auto h-8 w-8 text-teal-500" />
            <h3 className="font-semibold text-[var(--text-primary)]">Privacy First</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              We only store essential account information and never track your activity or share
              your data.
            </p>
          </div>
          <div className="text-center p-4 space-y-3">
            <Lock className="mx-auto h-8 w-8 text-blue-500" />
            <h3 className="font-semibold text-[var(--text-primary)]">Secure Sign-in</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Authentication is handled securely through Google&apos;s trusted OAuth service.
            </p>
          </div>
          <div className="text-center p-4 space-y-3">
            <UserCheck className="mx-auto h-8 w-8 text-violet-500" />
            <h3 className="font-semibold text-[var(--text-primary)]">Your Control</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              You can remove your account and associated data at any time.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="py-8 border border-[var(--card-border)] rounded-lg bg-[var(--background)]">
            <h2 className="text-lg font-semibold mb-6 text-center">Continue with Google</h2>
            <div className="flex justify-center">
              <GoogleButton onClick={handleGoogleSignIn} />
            </div>
            <p className="text-center mt-6 text-sm text-[var(--text-secondary)] px-4">
              By signing in, you agree to our privacy policy. We only use your email to identify
              your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
