import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="auth-shell min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between border-r border-white/10 p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">LiveMeet</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Meetings that feel fast, clear, and focused.
            </h1>
            <p className="mt-4 max-w-md text-slate-300">
              Sign in with email or Google and jump into your room in seconds.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5">
            <p className="text-sm text-cyan-100">Instant room creation, chat history, and host controls.</p>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  card: 'bg-transparent shadow-none border-0',
                  headerTitle: 'text-white',
                  headerSubtitle: 'text-slate-300',
                  formFieldLabel: 'text-slate-200',
                  formFieldInput:
                    'bg-slate-900/80 border border-slate-700 text-white placeholder:text-slate-400 focus:border-cyan-400',
                  formButtonPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
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
              New here?{' '}
              <Link href="/sign-up" className="text-cyan-300 hover:text-cyan-200">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>

    </div>
  );
}
