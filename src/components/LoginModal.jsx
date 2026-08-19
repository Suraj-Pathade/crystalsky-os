import React, { useState } from 'react';
import { X, ShieldCheck, Mail, LogIn, Lock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginModal({ isOpen, onClose }) {
  const { currentUser, loginUser, logoutUser, showToast } = useApp();
  const [emailInput, setEmailInput] = useState(currentUser?.email || 'pravinghukshephotography@gmail.com');
  const [nameInput, setNameInput] = useState(currentUser?.name || 'Pravin Ghukshe');

  if (!isOpen) return null;

  const handleGoogleLoginSimulate = (e) => {
    e.preventDefault();
    const user = loginUser(emailInput, nameInput);
    if (user.role === 'ADMIN') {
      showToast('⚡ Admin Authenticated! Full CRUD & Google Sheets access granted.');
    } else {
      showToast('🔒 Signed in as View-Only Guest. Only pravinghukshephotography@gmail.com can modify data.', 'warning');
    }
    onClose();
  };

  const handleOneClickAdminSelect = () => {
    setEmailInput('pravinghukshephotography@gmail.com');
    setNameInput('Pravin Ghukshe');
    const user = loginUser('pravinghukshephotography@gmail.com', 'Pravin Ghukshe');
    showToast('⚡ Verified Admin Account: pravinghukshephotography@gmail.com!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md p-5 md:p-6 animate-modal shadow-2xl space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-black flex items-center justify-center font-extrabold text-sm shadow-md">
              PG
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Google Security Sign-In</h3>
              <p className="text-xs text-zinc-400">CrystalSky Photography OS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Auth Status */}
        <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-3 ${
          currentUser?.role === 'ADMIN' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-amber-400" />
          <div>
            <p className="font-extrabold">Current User: {currentUser?.name} ({currentUser?.email})</p>
            <p className="text-[11px] text-zinc-300">
              Role: <strong className="uppercase font-mono">{currentUser?.role}</strong> — {currentUser?.role === 'ADMIN' ? 'Full Edit/Delete/Sync Access' : 'View-Only Mode'}
            </p>
          </div>
        </div>

        {/* 1-Click Quick Admin Button */}
        <button
          onClick={handleOneClickAdminSelect}
          type="button"
          className="w-full p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-400 font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Sign In as Admin (pravinghukshephotography@gmail.com)
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-zinc-500">Or Enter Any Google Email</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        {/* Google Email Form */}
        <form onSubmit={handleGoogleLoginSimulate} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Google Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="pravinghukshephotography@gmail.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">
              Note: Only <strong className="text-amber-400">pravinghukshephotography@gmail.com</strong> has Full CRUD privileges. All other emails receive View-Only access.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">User Full Name</label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Pravin Ghukshe"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 btn-gold py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <LogIn className="w-4 h-4" />
              Sign In with Google Account
            </button>

            {currentUser?.isLoggedIn && (
              <button
                type="button"
                onClick={() => { logoutUser(); onClose(); }}
                className="px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-rose-400 font-bold hover:bg-rose-500/20"
              >
                Sign Out
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
