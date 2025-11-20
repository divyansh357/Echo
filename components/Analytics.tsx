import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalysisResult, CategoryType } from '../types';

interface AnalyticsProps {
  data: AnalysisResult['distribution'];
  score: number;
  onSelectCategory: (category: CategoryType | null) => void;
  selectedCategory: CategoryType | null;
}

export const Analytics: React.FC<AnalyticsProps> = ({ data, score, onSelectCategory, selectedCategory }) => {
  const chartData = [
    { name: 'Urgent', value: data.urgent, color: '#f43f5e' },     // Rose-500
    { name: 'Important', value: data.important, color: '#06b6d4' }, // Cyan-500
    { name: 'Routine', value: data.routine, color: '#14b8a6' },   // Teal-500
    { name: 'Noise', value: data.noise, color: '#64748b' },       // Slate-500
  ];

  return (
    <div className="bg-white/90 dark:bg-[#0b1221]/90 backdrop-blur-sm p-6 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800/60 h-full flex flex-col relative overflow-hidden group transition-colors">
      
      {/* Holographic Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="flex items-center justify-between mb-6 z-10 relative">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2">
          <div className="w-1.5 h-4 bg-cyan-500 rounded-sm" />
          Workload Balance
        </h3>
        <div className="text-right">
           <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Productivity Score</span>
           <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">{score}</span>
        </div>
      </div>

      <div className="h-52 w-full relative z-10">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                onClick={(data) => {
                  const category = data.name as CategoryType;
                  if (selectedCategory === category) {
                    onSelectCategory(null);
                  } else {
                    onSelectCategory(category);
                  }
                }}
                className="cursor-pointer outline-none"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className={`transition-all duration-300 hover:opacity-80 outline-none ${selectedCategory && selectedCategory !== entry.name ? 'opacity-30 grayscale' : 'opacity-100'} ${selectedCategory === entry.name ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}`}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#f8fafc', fontSize: '12px', fontWeight: 'bold' }}
                cursor={false}
              />
            </PieChart>
         </ResponsiveContainer>
         
         {/* Center Text */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center transform transition-all duration-300">
               <span className="block text-3xl font-bold text-slate-800 dark:text-white drop-shadow-md">
                  {selectedCategory 
                    ? data[selectedCategory.toLowerCase() as keyof typeof data] 
                    : data.urgent}
               </span>
               <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">
                 {selectedCategory ? selectedCategory : 'Urgent'}
               </span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6 z-10 relative">
        {chartData.map((item) => (
           <button 
             key={item.name} 
             onClick={() => onSelectCategory(selectedCategory === item.name ? null : item.name as CategoryType)}
             className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all border ${
               selectedCategory === item.name 
                 ? 'bg-slate-100 dark:bg-slate-800/80 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                 : 'bg-slate-50 dark:bg-slate-900/40 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
             }`}
           >
              <div 
                className="w-2.5 h-2.5 rounded-sm shadow-sm" 
                style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}40` }} 
              />
              <span className={`text-xs font-medium ${selectedCategory === item.name ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{item.name}</span>
           </button>
        ))}
      </div>
      
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};