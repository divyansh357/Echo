import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Activity, RefreshCw, Layers, Inbox, Filter, X, CheckCircle, Mail, MessageSquare, CheckSquare, Shield, ChevronRight, AlertTriangle, Zap, CalendarClock, Calendar, Loader2 } from 'lucide-react';
import { InboxItem, AnalysisResult, CategoryType, UserCredentials, PrioritizedTask, SourceType, DailyPlan } from '../types';
import { analyzePriorities, generateDailyPlan } from '../services/geminiService';
import { fetchIntegrationsData } from '../services/integrationService';
import { PriorityCard } from './PriorityCard';
import { StreamItem } from './StreamItem';
import { Analytics } from './Analytics';
import { AchievementsWidget } from './AchievementsWidget';
import { BackgroundDecorations } from './BackgroundDecorations';
import { DayPlannerModal } from './DayPlannerModal';
import { ChatAssistant } from './ChatAssistant';
import { Logo } from './Logo';
import { MOCK_INBOX } from '../constants';
import { ThemeToggle } from './ThemeToggle';

interface DashboardProps {
  userName: string;
  credentials: UserCredentials;
}

export const Dashboard: React.FC<DashboardProps> = ({ userName, credentials }) => {
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  
  // Workflow State
  const [focusMode, setFocusMode] = useState<CategoryType>('Urgent');
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [completedTasksData, setCompletedTasksData] = useState<PrioritizedTask[]>([]);
  const [sortedTasks, setSortedTasks] = useState<PrioritizedTask[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // UI State
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedSource, setSelectedSource] = useState<SourceType | null>(null);
  const streamEndRef = useRef<HTMLDivElement>(null);
  
  // Planner State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planContent, setPlanContent] = useState<DailyPlan | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);

  const initializeData = useCallback(async () => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    setConnectionLogs([]);

    try {
      // 1. Fetch Data
      let items: InboxItem[] = [];
      const hasCredentials = credentials.googleToken || credentials.slackToken || credentials.jira?.apiToken;

      if (hasCredentials) {
        try {
           // We now get explicit items and errors
           const result = await fetchIntegrationsData(credentials);
           const errors = result.errors;
           
           if (errors.length > 0) {
             setConnectionLogs(errors);
           }

           // Hybrid Mode: Start with what we successfully fetched
           let finalItems = [...result.items];
           
           if (finalItems.length > 0) {
             items = finalItems;
             setIsDemoMode(false);
           } else {
             // If request returned no items (or all failed), we show nothing rather than mock data
             items = [];
             setIsDemoMode(false);
           }
        } catch (err) {
           console.error("Critical fetch failure", err);
           items = []; // Don't show mock data on critical failure if credentials present
           setIsDemoMode(false);
           setConnectionLogs(["System Error: Unable to attempt connections."]);
        }
      } else {
        items = MOCK_INBOX;
        setIsDemoMode(true);
      }

      setInboxItems(items);

      // 2. Analyze Data
      if (items.length > 0) {
        const result = await analyzePriorities(items);
        setAnalysis(result);
      } else {
        // Handle empty state without calling AI
        setAnalysis({
            topPriorities: [],
            productivityScore: 100,
            distribution: { urgent: 0, important: 0, routine: 0, noise: 0 },
            itemClassifications: []
        });
      }
      
      setCompletedTaskIds(new Set());
      setCompletedTasksData([]);
      setFocusMode('Urgent'); // Reset to Urgent on refresh

    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Failed to analyze priorities. Please check API config or try again.");
    } finally {
      setLoading(false);
    }
  }, [credentials]);

  // Initial load
  useEffect(() => {
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll effect for category selection
  useEffect(() => {
    if ((selectedCategory || selectedSource) && streamEndRef.current) {
      streamEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory, selectedSource]);

  // --- Focus Mode Logic ---

  // Helper to count items remaining in a specific category
  const countRemainingItems = useCallback((category: CategoryType) => {
    if (!analysis) return 0;
    return analysis.itemClassifications.filter(c => 
      c.category === category && !completedTaskIds.has(c.itemId)
    ).length;
  }, [analysis, completedTaskIds]);

  // Calculate tasks whenever analysis or focus mode changes (Initial Loading of Tasks)
  useEffect(() => {
    if (!analysis) return;

    // 1. Identify IDs belonging to current focus mode
    const relevantItemIds = analysis.itemClassifications
      .filter(c => c.category === focusMode && !completedTaskIds.has(c.itemId))
      .map(c => c.itemId);

    // 2. Map to PrioritizedTask objects
    const tasks: PrioritizedTask[] = relevantItemIds.map(id => {
      // Check if we have a "Rich" AI task for this ID
      const richTask = analysis.topPriorities.find(t => t.originalItemId === id);
      if (richTask) return richTask;

      // Fallback: Create a "Synthetic" task for items not in the Top 3-5 but still in this category
      const rawItem = inboxItems.find(i => i.id === id);
      if (!rawItem) return null;

      // Infer scores based on category
      const baseUrgency = focusMode === 'Urgent' ? 8 : focusMode === 'Important' ? 6 : 3;
      const baseImportance = focusMode === 'Urgent' ? 9 : focusMode === 'Important' ? 8 : 4;

      return {
        id: `synthetic-${rawItem.id}`,
        originalItemId: rawItem.id,
        title: rawItem.subject || 'Untitled Item',
        summary: rawItem.content || 'No content available.',
        urgencyScore: baseUrgency,
        importanceScore: baseImportance,
        reason: `Classified as ${focusMode} based on initial analysis.`,
        suggestedAction: 'Review and process.',
        category: 'Internal' // Default fallback category
      } as PrioritizedTask;
    }).filter(Boolean) as PrioritizedTask[];

    // 3. Sort by urgency descending initially
    const sorted = tasks.sort((a, b) => b.urgencyScore - a.urgencyScore);
    setSortedTasks(sorted);
    
  // We only want to reset the list structure when the Mode or Analysis changes.
  // We do NOT want to reset when `completedTaskIds` changes, because we handle that manually 
  // to preserve the user's drag-and-drop order.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis, focusMode, inboxItems]);


  // Auto-Transition Effect
  useEffect(() => {
    if (!analysis || loading) return;

    // Use sortedTasks length to determine if screen is clear
    if (sortedTasks.length === 0) {
      const urgentCount = countRemainingItems('Urgent');
      const importantCount = countRemainingItems('Important');
      const routineCount = countRemainingItems('Routine');

      if (focusMode === 'Urgent' && urgentCount === 0) {
        if (importantCount > 0) setFocusMode('Important');
        else if (routineCount > 0) setFocusMode('Routine');
      } else if (focusMode === 'Important' && importantCount === 0) {
        if (routineCount > 0) setFocusMode('Routine');
      }
    }
  }, [sortedTasks.length, focusMode, analysis, loading, countRemainingItems]);


  const handleCompleteTask = (taskId: string) => {
    const task = sortedTasks.find(t => t.id === taskId);
    if (task) {
      // 1. Add to history
      setCompletedTasksData(prev => [...prev, task]);
      setCompletedTaskIds(prev => new Set(prev).add(task.originalItemId));
      
      // 2. Remove from current view (Preserve Order of remaining)
      setSortedTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    // Optional: Set custom drag image if needed, usually browser default is fine
  };

  const handleDragOver = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetTaskId) return;

    const fromIndex = sortedTasks.findIndex(t => t.id === draggedTaskId);
    const toIndex = sortedTasks.findIndex(t => t.id === targetTaskId);

    if (fromIndex === -1 || toIndex === -1) return;

    // Move item in the array
    const newTasks = [...sortedTasks];
    const [movedItem] = newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, movedItem);

    setSortedTasks(newTasks);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };


  // Handle Plan My Day Generation
  const handleGeneratePlan = async () => {
    setShowPlanModal(true);
    if (planContent) return; // Don't regenerate if already exists for session
    
    setIsPlanning(true);
    try {
        const tasksForPlan = analysis?.topPriorities || [];
        const plan = await generateDailyPlan(tasksForPlan);
        setPlanContent(plan);
    } catch (e) {
        console.error(e);
        // setPlanContent("Could not generate plan. Please try again.");
    } finally {
        setIsPlanning(false);
    }
  };

  // Filter Logic for Stream (Right Column)
  const getFilteredInbox = () => {
    let filtered = inboxItems;

    // 1. Filter by Category (from Chart)
    if (analysis && selectedCategory) {
      const categoryItemIds = new Set(
        analysis.itemClassifications
          .filter(c => c.category === selectedCategory)
          .map(c => c.itemId)
      );
      filtered = filtered.filter(item => categoryItemIds.has(item.id));
    }

    // 2. Filter by Source (Manual Toggle)
    if (selectedSource) {
        filtered = filtered.filter(item => item.source === selectedSource);
    }
    
    return filtered;
  };

  const getCategoryForItem = (id: string) => {
    return analysis?.itemClassifications.find(c => c.itemId === id)?.category;
  };

  // UI Helpers for Focus Header
  const getFocusColor = () => {
    switch(focusMode) {
      case 'Urgent': return 'text-rose-600 dark:text-rose-500 border-rose-200 dark:border-rose-500/50 bg-rose-50 dark:bg-rose-950/30';
      case 'Important': return 'text-cyan-600 dark:text-cyan-500 border-cyan-200 dark:border-cyan-500/50 bg-cyan-50 dark:bg-cyan-950/30';
      case 'Routine': return 'text-teal-600 dark:text-teal-500 border-teal-200 dark:border-teal-500/50 bg-teal-50 dark:bg-teal-950/30';
      default: return 'text-slate-500';
    }
  };

  if (apiKeyMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md text-center">
           <Activity size={48} className="mx-auto text-cyan-500 mb-4" />
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Echo</h1>
           <p className="text-slate-500 dark:text-slate-400">Please configure your API_KEY in the environment to start the engine.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans pb-10 selection:bg-cyan-500/30 relative overflow-x-hidden transition-colors duration-300">
      {/* Subtle Global Gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.08),_rgba(2,6,23,0)_70%)] z-0" />
      
      <BackgroundDecorations />
      
      {/* Central Refresh Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-white/60 dark:bg-[#020617]/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-[#0b1221] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
              <div className="text-center">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">Analyzing Context</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Processing your inbox stream...</p>
              </div>
           </div>
        </div>
      )}

      {/* Modals */}
      <DayPlannerModal 
        isOpen={showPlanModal} 
        onClose={() => setShowPlanModal(false)} 
        planContent={planContent} 
        isLoading={isPlanning}
      />

      {/* Floating Chatbot */}
      <ChatAssistant inboxItems={inboxItems} />

      {/* Integrations Modal */}
      {showIntegrations && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white dark:bg-[#0b1221] w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative z-[101]">
              <button 
                onClick={() => setShowIntegrations(false)} 
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={20}/>
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-50 dark:bg-cyan-950/30 rounded-full border border-cyan-100 dark:border-cyan-500/20">
                   <Shield className="text-cyan-600 dark:text-cyan-400" size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">Connected Integrations</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Manage your data sources</p>
                </div>
              </div>
              <div className="space-y-3">
                {/* Integration Items */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800">
                   <div className="flex items-center gap-3">
                      <Mail className="text-slate-400" size={20} />
                      <div><span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Google Workspace</span></div>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${credentials.googleToken ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'}`} />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{credentials.googleToken ? 'Active' : 'Inactive'}</span>
                   </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800">
                   <div className="flex items-center gap-3">
                      <MessageSquare className="text-slate-400" size={20} />
                      <div><span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Slack</span></div>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${credentials.slackToken ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'}`} />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{credentials.slackToken ? 'Active' : 'Inactive'}</span>
                   </div>
                </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0f172a] rounded-lg border border-slate-200 dark:border-slate-800">
                   <div className="flex items-center gap-3">
                      <CheckSquare className="text-slate-400" size={20} />
                      <div><span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Jira</span></div>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${credentials.jira?.apiToken ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'}`} />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{credentials.jira?.apiToken ? 'Active' : 'Inactive'}</span>
                   </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button onClick={() => setShowIntegrations(false)} className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors">Done</button>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <nav className="bg-white/80 dark:bg-[#0b1221]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-900/40">
                 <Logo className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Echo</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleGeneratePlan}
                disabled={!analysis}
                className="flex items-center gap-2 text-sm font-medium bg-indigo-50 dark:bg-indigo-600/20 hover:bg-indigo-100 dark:hover:bg-indigo-600/30 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                <CalendarClock size={16} />
                Plan My Day
              </button>
              <ThemeToggle />
              <button 
                onClick={initializeData}
                disabled={loading}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-600 dark:text-cyan-300 shadow-inner">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Good Morning, {userName.split(' ')[0]}.</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Echo has analyzed <span className="font-semibold text-cyan-600 dark:text-cyan-100">{inboxItems.length} items</span>. 
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 mb-6 rounded-r-md backdrop-blur-sm">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Task Feed */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Focus Header */}
            <div className="flex items-center justify-between bg-white/90 dark:bg-[#0b1221]/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg border ${getFocusColor()}`}>
                    {focusMode === 'Urgent' ? <AlertTriangle size={18} /> : focusMode === 'Important' ? <Zap size={18} /> : <CheckCircle size={18} />}
                 </div>
                 <div>
                   <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Focus Mode</span>
                   <h2 className={`text-lg font-bold ${focusMode === 'Urgent' ? 'text-rose-600 dark:text-rose-400' : focusMode === 'Important' ? 'text-cyan-600 dark:text-cyan-400' : 'text-teal-600 dark:text-teal-400'}`}>
                     {focusMode} Tasks
                   </h2>
                 </div>
               </div>
               <div className="flex items-center gap-1 text-xs text-slate-500">
                 <span>Next:</span>
                 <span className="font-medium text-slate-700 dark:text-slate-400">
                    {focusMode === 'Urgent' ? 'Important' : focusMode === 'Important' ? 'Routine' : 'Done'}
                 </span>
                 <ChevronRight size={14} />
               </div>
            </div>

            {sortedTasks.length === 0 ? (
                <div className="bg-white/90 dark:bg-[#0b1221]/90 backdrop-blur-sm rounded-xl p-10 text-center shadow-sm border border-slate-200 dark:border-slate-800/60 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <CheckCircle className="text-emerald-500" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All Caught Up!</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        You've cleared all {focusMode.toLowerCase()} tasks. 
                        {focusMode !== 'Routine' ? " Switching to next tier..." : " Take a break!"}
                    </p>
                </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {sortedTasks.map((task, index) => {
                  const original = inboxItems.find(i => i.id === task.originalItemId);
                  return (
                    <PriorityCard 
                      key={task.id} 
                      task={task} 
                      rank={index + 1}
                      originalItem={original}
                      onComplete={handleCompleteTask}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragOver={(e) => handleDragOver(e, task.id)}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedTaskId === task.id}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Analytics & Stream */}
          <div className="lg:col-span-5 space-y-8">
            <AchievementsWidget completedTasks={completedTasksData} />

            <div className="h-[380px]">
               {analysis ? (
                 <Analytics 
                    data={analysis.distribution} 
                    score={analysis.productivityScore} 
                    onSelectCategory={setSelectedCategory}
                    selectedCategory={selectedCategory}
                 />
               ) : (
                 <div className="h-full bg-white/90 dark:bg-[#0b1221]/90 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800/60 flex items-center justify-center">
                    <p className="text-slate-500 text-sm">Waiting for data...</p>
                 </div>
               )}
            </div>

            <div ref={streamEndRef} className="bg-white/90 dark:bg-[#0b1221]/90 backdrop-blur-sm rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-black/40 border border-slate-200 dark:border-slate-800/60 overflow-hidden flex flex-col max-h-[600px] scroll-mt-24 transition-colors">
               <div className="p-4 border-b border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#0f172a]/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                     <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                        <Inbox size={16} className="text-cyan-500 dark:text-cyan-400" />
                        {selectedCategory ? `${selectedCategory} Items` : 'Incoming Stream'}
                     </h3>
                     {selectedCategory ? (
                        <button onClick={() => setSelectedCategory(null)} className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 bg-slate-200 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700 px-2 py-1 rounded-lg transition-colors">
                          <X size={12} /> Clear
                        </button>
                      ) : (
                        <div className="text-slate-400 dark:text-slate-500"><Filter size={14} /></div>
                      )}
                  </div>
                  
                  {/* Provider Filters */}
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Source:</span>
                     <button 
                        onClick={() => setSelectedSource(selectedSource === SourceType.EMAIL ? null : SourceType.EMAIL)}
                        className={`p-1.5 rounded-md transition-colors ${selectedSource === SourceType.EMAIL ? 'bg-cyan-100 text-cyan-600 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/50' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                        title="Filter by Email"
                     >
                        <Mail size={14} />
                     </button>
                     <button 
                        onClick={() => setSelectedSource(selectedSource === SourceType.SLACK ? null : SourceType.SLACK)}
                        className={`p-1.5 rounded-md transition-colors ${selectedSource === SourceType.SLACK ? 'bg-violet-100 text-violet-600 border border-violet-200 dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/50' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                         title="Filter by Slack"
                     >
                        <MessageSquare size={14} />
                     </button>
                     <button 
                        onClick={() => setSelectedSource(selectedSource === SourceType.JIRA ? null : SourceType.JIRA)}
                         className={`p-1.5 rounded-md transition-colors ${selectedSource === SourceType.JIRA ? 'bg-blue-100 text-blue-600 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/50' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                         title="Filter by Jira"
                     >
                        <CheckSquare size={14} />
                     </button>
                      <button 
                        onClick={() => setSelectedSource(selectedSource === SourceType.CALENDAR ? null : SourceType.CALENDAR)}
                         className={`p-1.5 rounded-md transition-colors ${selectedSource === SourceType.CALENDAR ? 'bg-orange-100 text-orange-600 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/50' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}
                         title="Filter by Calendar"
                     >
                        <Calendar size={14} />
                     </button>

                     {selectedSource && (
                         <button onClick={() => setSelectedSource(null)} className="ml-auto text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-white">
                             Reset
                         </button>
                     )}
                  </div>
               </div>
               
               <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                 {getFilteredInbox().length === 0 ? (
                   <div className="p-8 text-center text-slate-500 text-sm">
                      No {selectedCategory ? selectedCategory.toLowerCase() : ''} items found 
                      {selectedSource && ` from ${selectedSource}`}.
                   </div>
                 ) : (
                   getFilteredInbox().map(item => (
                     <StreamItem key={item.id} item={item} category={getCategoryForItem(item.id)} />
                   ))
                 )}
               </div>
               <div className="p-3 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#0f172a]/50 text-center">
                 <button onClick={() => setShowIntegrations(true)} className="text-xs text-cyan-600 dark:text-cyan-500/80 font-medium hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">View All Integrations</button>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};