import React from 'react';
import { PrioritizedTask, InboxItem } from '../types';
import { SourceIcon } from './SourceIcon';
import { CheckCircle, Clock, AlertTriangle, ArrowRight, GripVertical, Zap } from 'lucide-react';

interface PriorityCardProps {
  task: PrioritizedTask;
  originalItem?: InboxItem;
  rank: number;
  onComplete: (id: string) => void;
  // Drag & Drop Props
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export const PriorityCard: React.FC<PriorityCardProps> = ({ 
  task, 
  originalItem, 
  rank, 
  onComplete,
  draggable,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging
}) => {
  
  // Enhanced Color Schemes - Updated for Light/Dark Modes
  const getTheme = (score: number) => {
    if (score >= 9) return {
      border: 'border-rose-500',
      glow: 'shadow-rose-500/20',
      bgGradient: 'bg-rose-50 dark:from-rose-950/20 dark:to-[#0b1221]',
      accent: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-100 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/50'
    };
    if (score >= 7) return {
      border: 'border-cyan-500',
      glow: 'shadow-cyan-500/20',
      bgGradient: 'bg-cyan-50 dark:from-cyan-950/20 dark:to-[#0b1221]',
      accent: 'text-cyan-600 dark:text-cyan-400',
      badgeBg: 'bg-cyan-100 border-cyan-200 dark:bg-cyan-950/40 dark:border-cyan-800/50'
    };
    if (score >= 5) return {
      border: 'border-teal-500',
      glow: 'shadow-teal-500/20',
      bgGradient: 'bg-teal-50 dark:from-teal-950/20 dark:to-[#0b1221]',
      accent: 'text-teal-600 dark:text-teal-400',
      badgeBg: 'bg-teal-100 border-teal-200 dark:bg-teal-950/40 dark:border-teal-800/50'
    };
    return {
      border: 'border-slate-500',
      glow: 'shadow-slate-500/20',
      bgGradient: 'bg-slate-50 dark:from-slate-900/20 dark:to-[#0b1221]',
      accent: 'text-slate-600 dark:text-slate-400',
      badgeBg: 'bg-slate-200 border-slate-300 dark:bg-slate-800/40 dark:border-slate-700/50'
    };
  };

  const theme = getTheme(task.urgencyScore);

  return (
    <div 
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`
        group relative rounded-xl p-0.5 transition-all duration-300
        ${isDragging ? 'opacity-50 scale-[0.98] rotate-1' : 'hover:-translate-y-1 hover:shadow-xl'}
        ${theme.glow}
        bg-gradient-to-b from-slate-200 to-white dark:from-slate-800 dark:to-slate-900/0
        ${draggable ? 'cursor-default' : ''}
      `}
    >
      {/* Main Content Container */}
      <div className={`
        relative w-full rounded-[11px] p-6 
        border-l-4 ${theme.border} border-y border-r border-white/50 dark:border-white/5
        ${theme.bgGradient} dark:bg-gradient-to-br dark:bg-[#0b1221]/90 backdrop-blur-sm
      `}>

        {/* Rank Indicator with glowing effect */}
        <div className="absolute -left-3 -top-3 z-10">
           <div className="relative flex items-center justify-center w-8 h-8">
              <div className={`absolute inset-0 rounded-full bg-white dark:bg-[#020617] border-2 border-slate-200 dark:border-slate-700 shadow-lg`}></div>
              <span className={`relative font-bold text-sm ${theme.accent}`}>{rank}</span>
           </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-3 pl-2">
          <div className="flex items-center gap-2">
            {draggable && (
              <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400 transition-colors -ml-2 mr-1">
                <GripVertical size={16} />
              </div>
            )}
            {originalItem ? <SourceIcon type={originalItem.source} className="w-4 h-4" /> : <Zap size={16} className="text-slate-500" />}
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{task.category}</span>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 border ${theme.badgeBg} ${theme.accent}`}>
              <Clock size={10} /> Urgency: {task.urgencyScore}
            </span>
          </div>
        </div>

        {/* Title & Summary */}
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 pl-2 leading-snug group-hover:text-slate-900 dark:group-hover:text-white transition-colors select-none">
          {task.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 pl-2 select-none font-light leading-relaxed">
          {task.summary}
        </p>

        {/* "Why" Box */}
        <div className="bg-white/50 dark:bg-[#020617]/50 rounded-lg p-3 mb-4 ml-2 border border-slate-200 dark:border-white/5 relative overflow-hidden select-none group-hover:border-slate-300 dark:group-hover:border-white/10 transition-colors">
          <div className="flex items-start gap-2 relative z-10">
            <AlertTriangle size={14} className="text-amber-500/80 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold text-slate-700 dark:text-slate-200 uppercase text-[10px] tracking-wide mr-1">Reason:</span>
              {task.reason}
            </p>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="flex items-center justify-between pl-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
          <div className="flex flex-col max-w-[70%]">
             <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-0.5">Recommended Action</span>
             <span className={`text-xs font-medium flex items-center gap-1 select-none ${theme.accent} break-words`}>
               {task.suggestedAction} <ArrowRight size={10} className="shrink-0" />
             </span>
          </div>
          
          <button 
            onClick={() => onComplete(task.id)}
            className="
              flex items-center gap-2 px-4 py-2 
              bg-cyan-600 hover:bg-cyan-500 text-white 
              text-sm font-medium rounded-lg 
              transition-all active:scale-95 
              shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/20
              select-none group/btn shrink-0
            "
          >
            <CheckCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
};