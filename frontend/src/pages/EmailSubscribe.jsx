import { useState } from 'react';
import { subscribeEmail } from '../services/emailAPI';

const EmailSubscribe = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const data = await subscribeEmail(email);
      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Email sent successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      const msg =
        err?.response?.data?.message || 'Could not connect to server. Please try again.';
      setMessage(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a1a]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/30 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-violet-500/20 blur-3xl animate-pulse delay-500" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-2xl p-8 border border-white/10"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow:
              '0 25px 50px -12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center text-white mb-2 tracking-tight">
            Stay in the loop
          </h1>
          <p className="text-center text-white/50 mb-8 text-sm leading-relaxed">
            Enter your email and we&apos;ll send you an instant confirmation with
            the latest updates.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                id="email-input"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all disabled:opacity-50"
              />
            </div>

            <button
              id="subscribe-btn"
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 8px 20px -4px rgba(99,102,241,0.5)',
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                }}
              />
              <span className="relative flex items-center justify-center gap-2">
                {status === 'loading' ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Status message */}
          {status === 'success' && (
            <div
              id="success-message"
              className="mt-5 flex items-center gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 animate-fade-in"
            >
              <span className="text-2xl">✅</span>
              <p className="text-emerald-400 text-sm font-medium">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div
              id="error-message"
              className="mt-5 flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 animate-fade-in"
            >
              <span className="text-2xl">❌</span>
              <p className="text-red-400 text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Footer note */}
          <p className="text-center text-white/25 text-xs mt-6">
            No spam. Unsubscribe anytime. 🔒
          </p>
        </div>

        {/* Brand watermark */}
        <p className="text-center text-white/20 text-xs mt-4">
          Automated Email Notification System · Powered by Nodemailer + Gmail SMTP
        </p>
      </div>
    </div>
  );
};

export default EmailSubscribe;
