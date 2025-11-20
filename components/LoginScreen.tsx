import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { Logo } from './Logo';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      onLogin(name);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-[#0b1221] rounded-2xl p-8 border border-slate-200 dark:border-slate-800/60 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-50 dark:bg-cyan-950/30 rounded-full mb-4 border border-cyan-100 dark:border-cyan-500/20 shadow-[0_0_25px_rgba(6,182,212,0.1)]">
            <Logo className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Echo</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Your AI-powered executive assistant for context-aware prioritization.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder="e.g. Sarah Connor"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3.5 rounded-lg shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-4"
          >
            Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Secure Enterprise-Grade Encryption
          </p>
        </div>
      </div>
    </div>
  );
};