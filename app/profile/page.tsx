'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link
            href="/"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            Back Home
          </Link>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <div className="flex items-center gap-4">
            {user.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt="Profile"
                className="h-16 w-16 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-xl font-bold text-slate-950">
                {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xl font-semibold">
                {user.fullName || user.username || 'User'}
              </p>
              <p className="text-sm text-slate-300">
                {user.primaryEmailAddress?.emailAddress || 'No email'}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">User ID</p>
              <p className="mt-1 break-all text-sm text-slate-200">{user.id}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-400">Status</p>
              <p className="mt-1 text-sm text-emerald-300">Signed in</p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await signOut({ redirectUrl: '/sign-in' });
            }}
            className="mt-8 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-400"
          >
            Sign Out
          </button>
        </section>
      </div>
    </main>
  );
}
