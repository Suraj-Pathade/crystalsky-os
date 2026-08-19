import React, { useState } from 'react';
import { Lock, KeyRound, Mail, ShieldCheck, ArrowRight, Camera, AlertCircle } from 'lucide-react';
import Logo from './Logo';

export default function SecurityGateScreen({ onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('pravinghukshephotography@gmail.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const result = onLoginSuccess(identifier, password);
      setIsSubmitting(false);
      if (!result.success) {
        setErrorMsg(result.error || 'Incorrect Username or Password');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white flex items-center justify-center p-4 selection:bg-amber-500 selection:text-black">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950 pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative z-10 backdrop-blur-xl animate-modal">
        
        {/* Luxury Logo Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <div className="pt-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Security Password Protection Active
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-white">
            System Lockout Gate
          </h2>
          <p className="text-xs text-zinc-400">
            Authorized access only for Pravin Ghukshe. Enter your security password to unlock the OS.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-300">Username / Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="pravinghukshephotography@gmail.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-300">Security Password *</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Submit Unlock Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-gold py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <span>Verifying Password...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Unlock System & Access OS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Footer */}
        <div className="pt-2 text-center text-[11px] text-zinc-500 font-mono border-t border-zinc-800/80">
          🔒 Encrypted CrystalSky Security • 8412850833
        </div>

      </div>
    </div>
  );
}
