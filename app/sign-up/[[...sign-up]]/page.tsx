import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="auth-shell min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between border-r border-white/10 p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">LiveMeet</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Create your account and host your first room today.
            </h1>
            <p className="mt-4 max-w-md text-slate-300">
              Continue with email or Google and start collaborating immediately.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
            <p className="text-sm text-emerald-100">No setup friction. Just sign up and share your meeting link.</p>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  card: 'bg-transparent shadow-none border-0',
                  headerTitle: 'text-white',
                  headerSubtitle: 'text-slate-300',
                  formFieldLabel: 'text-slate-200',
                  formFieldInput:
                    'bg-slate-900/80 border border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-400',
                  formButtonPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
                  socialButtonsBlockButton:
                    'bg-slate-900/80 border border-slate-700 text-white hover:bg-slate-800',
                  socialButtonsBlockButtonText: 'text-white',
                  dividerLine: 'bg-slate-700',
                  dividerText: 'text-slate-400',
                  footerAction: 'hidden',
                  footerActionText: 'hidden',
                },
              }}
            />
            <p className="mt-4 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-emerald-300 hover:text-emerald-200">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>

    </div>
  );
}
