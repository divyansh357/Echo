import React from 'react';
import { X, CalendarClock, Loader2, Coffee, Zap, Users, CheckSquare, Clock } from 'lucide-react';
import { DailyPlan } from '../types';

interface DayPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  planContent: DailyPlan | null;
  isLoading: boolean;
}

export const DayPlannerModal: React.FC<DayPlannerModalProps> = ({ isOpen, onClose, planContent, isLoading }) => {
  if (!isOpen) return null;

  const getItemIcon = (type: string) => {
    switch(type) {
        case 'focus': return <Zap size={16} className="text-amber-500 dark:text-amber-400" />;
        case 'meeting': return <Users size={16} className="text-blue-500 dark:text-blue-400" />;
        case 'break': return <Coffee size={16} className="text-emerald-500 dark:text-emerald-400" />;
        case 'routine': return <CheckSquare size={16} className="text-slate-500 dark:text-slate-400" />;
        default: return <Clock size={16} className="text-slate-500 dark:text-slate-400" />;
    }
  };

  const getItemColor = (type: string) => {
    switch(type) {
        case 'focus': return 'border-amber-200 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-950/20';
        case 'meeting': return 'border-blue-200 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-950/20';
        case 'break': return 'border-emerald-200 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/20';
        case 'routine': return 'border-slate-200 dark:border-slate-600/50 bg-slate-50 dark:bg-slate-800/20';
        default: return 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/20';
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0b1221] w-full max-w-2xl h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between bg-slate-50 dark:bg-[#0f172a]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-200 dark:border-indigo-500/20">
               <CalendarClock className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">Daily Action Plan</h3>
               <p className="text-xs text-slate-500 dark:text-slate-400">AI-Optimized Schedule</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-white dark:bg-[#0b1221]">
              <div className="relative">
                 <div className="w-12 h-12 rounded-full border-2 border-indigo-200 dark:border-indigo-500/30 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-pulse"></div>
                 </div>
              </div>
              <p className="text-indigo-600 dark:text-indigo-300 text-sm font-medium animate-pulse">Constructing optimal timeline...</p>
            </div>
          ) : planContent ? (
            <div className="p-8">
                {/* Summary */}
                <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950/40 dark:to-cyan-950/40 border border-indigo-100 dark:border-indigo-500/20">
                    <p className="text-indigo-800 dark:text-indigo-200 text-sm italic leading-relaxed">"{planContent.summary}"</p>
                </div>

                {/* Timeline */}
                <div className="space-y-0 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[85px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800/50"></div>

                    {planContent.items.map((item, idx) => (
                        <div key={idx} className="flex group relative mb-6 last:mb-0">
                            {/* Time */}
                            <div className="w-[70px] pt-1 text-right pr-4 shrink-0">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">{item.time.split(' ')[0]}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase">{item.time.split(' ')[1]}</span>
                            </div>

                            {/* Dot */}
                            <div className="w-8 flex justify-center shrink-0 pt-1.5 relative z-10">
                                <div className={`w-3 h-3 rounded-full border-2 border-white dark:border-[#0b1221] ${
                                    item.type === 'focus' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                                    item.type === 'break' ? 'bg-emerald-500' : 
                                    item.type === 'meeting' ? 'bg-blue-500' : 'bg-slate-400 dark:bg-slate-600'
                                }`}></div>
                            </div>

                            {/* Card */}
                            <div className={`flex-1 ml-2 p-4 rounded-xl border ${getItemColor(item.type)} transition-transform hover:scale-[1.01] duration-200`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-semibold text-sm ${
                                        item.type === 'focus' ? 'text-amber-800 dark:text-amber-100' :
                                        item.type === 'break' ? 'text-emerald-800 dark:text-emerald-100' : 'text-slate-800 dark:text-slate-200'
                                    }`}>
                                        {item.activity}
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        {getItemIcon(item.type)}
                                    </div>
                                </div>
                                {item.notes && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.notes}</p>
                                )}
                                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200/50 dark:bg-black/20 text-[10px] font-mono text-slate-500">
                                    <Clock size={10} /> {item.duration}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <p>No plan generated.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-[#0f172a] flex justify-end gap-2">
           <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
          >
            Close
          </button>
          <button 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-900/20"
            onClick={() => {
                // Placeholder for export
                alert("Schedule exported to clipboard!");
            }}
          >
            Export Plan
          </button>
        </div>
      </div>
    </div>
  );
};