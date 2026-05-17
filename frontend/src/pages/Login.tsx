import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Icon } from '../components/ui/Icon';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    // REQ-010: Full-screen centered layout
    <div className="flex flex-col min-h-screen bg-background text-on-background font-body-lg">

      {/* REQ-010: Decorative gradient blobs — fixed, behind everything */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-fixed-dim rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary-fixed-dim rounded-full blur-[100px]" />
      </div>

      {/* REQ-010: Main content — centered */}
      <main className="flex-grow flex items-center justify-center px-container-margin py-stack-gap">
        {/* REQ-010: Login card */}
        <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-10 shadow-tactile border border-surface-variant/20">

          {/* Logo + title + subtitle */}
          <div className="flex flex-col items-center mb-10">
            {/* REQ-010: Logo area */}
            <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mb-4">
              <Icon name="visibility" size={32} className="text-primary" />
            </div>
            <h1 className="font-headline-md text-headline-md text-primary">MemoryLens</h1>
            {/* REQ-010: Subtitle in on-surface-variant */}
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 text-center">
              Welcome to your digital sanctuary
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg text-body-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* REQ-010, REQ-016: Email field with always-visible label */}
            <Input
              type="email"
              label="Email Address"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. alex@provider.com"
              required
              autoComplete="email"
            />

            {/* REQ-010, REQ-016: Password field with show/hide toggle */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label
                  htmlFor="password"
                  className="font-label-lg text-label-lg text-on-surface"
                >
                  Password
                </label>
                {/* REQ-010: "Forgot?" link in text-secondary */}
                <a
                  href="#"
                  className="font-label-lg text-label-lg text-secondary hover:underline transition-colors"
                  onClick={e => e.preventDefault()}
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="h-touch-target-min w-full bg-surface-container-low border-2 border-outline-variant rounded-lg px-4 pr-14 focus:border-primary focus:outline-none transition-colors font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60"
                />
                {/* REQ-010, REQ-016: Show/hide toggle with aria-label */}
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant h-10 w-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <Icon
                    name={showPassword ? 'visibility_off' : 'visibility'}
                    size={22}
                  />
                </button>
              </div>
            </div>

            {/* REQ-010, REQ-017: Primary CTA */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-primary text-on-primary font-label-lg text-label-lg rounded-xl shadow-md hover:bg-primary/90 active:scale-95 duration-150 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {loading ? 'Signing in…' : 'Sign in as Caregiver'}
              </button>
            </div>

            {/* REQ-010: Divider with "Secure Login" text */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-grow bg-outline-variant" />
              <span className="font-label-lg text-label-lg text-on-surface-variant">Secure Login</span>
              <div className="h-px flex-grow bg-outline-variant" />
            </div>

            {/* REQ-010: Secondary CTA — outline style */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Return to Lens
            </Button>
          </form>

          {/* REQ-010: Privacy note */}
          <div className="mt-10 flex items-center justify-center gap-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
            <Icon name="lock" size={22} filled className="text-secondary flex-shrink-0" />
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your privacy is our priority. End-to-end memory encryption active.
            </p>
          </div>
        </div>
      </main>

      {/* REQ-010: Footer */}
      <footer className="p-gutter text-center">
        <p className="font-label-lg text-label-lg text-on-surface-variant">
          © 2024 MemoryLens. Non-clinical digital support environment.
        </p>
      </footer>
    </div>
  );
}
