import React from 'react';
import { CheckCircle, Trophy } from 'lucide-react';
import { PrioritizedTask } from '../types';

interface AchievementsWidgetProps {
  completedTasks: PrioritizedTask[];
}

export const AchievementsWidget: React.FC<AchievementsWidgetProps> = ({ completedTasks }) => {
  // Calculate progress (arbitrary goal of 5 tasks per session for visual gratification)
  const progress = Math.min((completedTasks.length / 5) * 100, 100);

  if (completedTasks.length === 0) return null;

  return (
    <div className="bg-[#0b1221] p-5 rounded-xl shadow-lg shadow-black/30 border border-slate-800/60 mb-6 relative overflow-hidden group animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
             <Trophy size={18} />
          </div>
          <div>
             <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Session Wins</h3>
             <p className="text-[10px] text-slate-400">{completedTasks.length} tasks crushed today</p>
          </div>
        </div>
        <span className="text-emerald-400 font-bold text-lg">{completedTasks.length}</span>
      </div>

      {/* Recent List */}
      <div className="space-y-2 relative z-10 mb-2">
        {completedTasks.slice().reverse().slice(0, 3).map((task) => (
          <div key={task.id} className="flex items-center gap-2 text-xs text-slate-400 animate-in fade-in slide-in-from-left-4 duration-300">
             <CheckCircle size={12} className="text-emerald-500 shrink-0" />
             <span className="line-through decoration-slate-600 truncate opacity-70">{task.title}</span>
          </div>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative z-10 mt-3">
         <div 
           className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-1000 ease-out rounded-full" 
           style={{ width: `${progress}%` }} 
         />
      </div>

      {/* Background Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
