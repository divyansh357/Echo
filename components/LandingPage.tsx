import React from 'react';
import { ArrowRight, Zap, Layers, Shield, CalendarClock, CheckCircle, MessageSquare, Mail, Activity } from 'lucide-react';
import { BackgroundDecorations } from './BackgroundDecorations';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 relative overflow-x-hidden selection:bg-cyan-500/30 font-sans transition-colors duration-300">
      <BackgroundDecorations />
      
      {/* Global Gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.15),_rgba(2,6,23,0)_60%)] z-0 opacity-50 dark:opacity-100" />

      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white dark:bg-cyan-950/30 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/10 border border-slate-200 dark:border-cyan-500/20">
            <Logo className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">Echo</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={onGetStarted}
            className="px-5 py-2.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-colors"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Zap size={12} />
              <span>AI-Powered Context Engine</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Silence the Noise. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-400 dark:to-teal-400">
                Amplify Your Focus.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Echo analyzes your Email, Slack, Jira, and Calendar to filter out distractions and build a dynamic priority list based on what actually matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                Start Prioritizing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center gap-6 text-slate-500 dark:text-slate-500 text-sm font-medium pt-4">
              <div className="flex items-center gap-2"><Shield size={16} /> Enterprise Secure</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} /> Real-time Sync</div>
            </div>
          </div>

          {/* Visual / Illustration */}
          <div className="relative lg:h-[500px] w-full animate-in fade-in duration-1000 delay-300 hidden lg:block">
            {/* Abstract Dashboard UI Representation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-violet-500/10 dark:from-cyan-500/20 dark:to-violet-500/20 rounded-full blur-[100px]" />
            
            <div className="relative z-10 bg-white dark:bg-[#0b1221] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl shadow-slate-400/20 dark:shadow-black/50 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
               {/* Mock Header */}
               <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="h-2 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
               </div>
               
               {/* Mock Content */}
               <div className="space-y-4">
                  {/* Card 1 */}
                  <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border-l-4 border-rose-500 border border-slate-200 dark:border-slate-800/50">
                    <div className="flex justify-between mb-2">
                       <div className="h-2 w-16 bg-rose-500/20 rounded-full" />
                       <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                  {/* Card 2 */}
                  <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border-l-4 border-cyan-500 border border-slate-200 dark:border-slate-800/50 opacity-80">
                    <div className="flex justify-between mb-2">
                       <div className="h-2 w-16 bg-cyan-500/20 rounded-full" />
                       <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </div>
                    <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
               </div>

               {/* Floating Badge */}
               <div className="absolute -right-10 bottom-10 bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="p-2 bg-cyan-50 dark:bg-cyan-950 rounded-lg border border-cyan-100 dark:border-cyan-500/30">
                    <Activity size={20} className="text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">Productivity</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">94/100</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-[#0b1221] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 transition-colors group shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl border border-indigo-100 dark:border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <Layers className="text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Unified Stream</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Stop switching tabs. Connect Slack, Jira, Gmail, and Calendar into one intelligent feed.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0b1221] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 transition-colors group shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-950/50 rounded-xl border border-cyan-100 dark:border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <Activity className="text-cyan-500 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Contextual Priority</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our AI understands the difference between "urgent" and "noise," highlighting only what needs attention now.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0b1221] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 transition-colors group shadow-sm hover:shadow-md">
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/50 rounded-xl border border-teal-100 dark:border-teal-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <CalendarClock className="text-teal-500 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Planning</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate a realistic daily schedule that blocks time for deep work based on your highest priorities.
            </p>
          </div>
        </div>
        
        {/* Integration Strip */}
        <div className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800/50">
           <p className="text-center text-slate-500 text-sm uppercase tracking-widest font-bold mb-8">Seamlessly Integrates With</p>
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white"><Mail className="text-red-500" /> Gmail</div>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white"><MessageSquare className="text-violet-500" /> Slack</div>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white"><CheckCircle className="text-blue-500" /> Jira</div>
              <div className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-white"><CalendarClock className="text-orange-500" /> Calendar</div>
           </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] py-8 text-center">
         <p className="text-slate-500 dark:text-slate-600 text-sm">© 2024 Echo Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
};