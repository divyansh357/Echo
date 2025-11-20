import React from 'react';
import { InboxItem, SourceType } from '../types';
import { SourceIcon } from './SourceIcon';
import { ChevronRight } from 'lucide-react';

interface StreamItemProps {
  item: InboxItem;
  category?: string;
}

export const StreamItem: React.FC<StreamItemProps> = ({ item, category }) => {
  const timeDisplay = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getCategoryColor = (cat?: string) => {
    switch(cat) {
      case 'Urgent': return 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/30';
      case 'Important': return 'text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/30';
      case 'Routine': return 'text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-500/30 bg-teal-50 dark:bg-teal-950/30';
      case 'Noise': return 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600/30 bg-slate-100 dark:bg-slate-800/30';
      default: return 'text-slate-500 dark:text-slate-500 border-slate-200 dark:border-slate-700/30 bg-slate-50 dark:bg-slate-800/20';
    }
  };

  const getSourceColor = (source: SourceType) => {
    switch(source) {
        case SourceType.EMAIL: return 'bg-cyan-500';
        case SourceType.SLACK: return 'bg-violet-500';
        case SourceType.JIRA: return 'bg-blue-500';
        case SourceType.CALENDAR: return 'bg-orange-500';
        default: return 'bg-slate-500';
    }
  };

  return (
    <div className="group relative flex items-start gap-3 p-4 hover:bg-slate-100 dark:hover:bg-[#1e293b]/30 transition-all duration-200 cursor-pointer border-b border-slate-200 dark:border-slate-800/40 last:border-0">
      
      {/* Source Indicator Line */}
      <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full ${getSourceColor(item.source)} opacity-50 group-hover:opacity-100 transition-opacity`} />

      <div className="mt-1 relative">
        <div className="absolute inset-0 bg-slate-200 dark:bg-white/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        <SourceIcon type={item.source} className="w-4 h-4 relative z-10 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <div className="flex items-center gap-2 overflow-hidden">
             <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.sender}</h4>
             {category && (
               <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-px rounded border ${getCategoryColor(category)}`}>
                 {category}
               </span>
             )}
          </div>
          <span className="text-[10px] text-slate-500 shrink-0 font-mono">{timeDisplay}</span>
        </div>
        
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate group-hover:text-cyan-700 dark:group-hover:text-cyan-100 transition-colors">
            {item.subject}
        </p>
        <p className="text-[11px] text-slate-500 truncate mt-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors font-light">
            {item.content}
        </p>
      </div>

      <div className="self-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
         <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />
      </div>
    </div>
  );
};