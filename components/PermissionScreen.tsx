import React, { useState } from 'react';
import { Shield, Mail, MessageSquare, CheckSquare, Calendar, Check, AlertCircle, Lock, Key, ExternalLink } from 'lucide-react';
import { UserCredentials } from '../types';

interface PermissionScreenProps {
  onContinue: (credentials: UserCredentials) => void;
}

export const PermissionScreen: React.FC<PermissionScreenProps> = ({ onContinue }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Credentials State
  const [googleToken, setGoogleToken] = useState('');
  const [slackToken, setSlackToken] = useState('');
  const [jiraDomain, setJiraDomain] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');

  const [enabled, setEnabled] = useState({
    google: false,
    slack: false,
    jira: false
  });

  const handleContinue = () => {
    const credentials: UserCredentials = {};
    
    if (googleToken.trim()) credentials.googleToken = googleToken.trim();
    if (slackToken.trim()) credentials.slackToken = slackToken.trim();
    if (jiraDomain.trim() && jiraToken.trim()) {
      credentials.jira = {
        domain: jiraDomain.trim(),
        email: jiraEmail.trim(),
        apiToken: jiraToken.trim()
      };
    }
    onContinue(credentials);
  };

  const toggleSection = (key: string, isEnableToggle: boolean = false) => {
    if (isEnableToggle) {
        setEnabled(prev => ({ ...prev, [key as keyof typeof enabled]: !prev[key as keyof typeof enabled] }));
    }
    setActiveSection(activeSection === key ? null : key);
  };

  const isReady = Object.values(enabled).some(Boolean) || 
                  !!googleToken.trim() || 
                  !!slackToken.trim() || 
                  (!!jiraDomain.trim() && !!jiraToken.trim());

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-4 py-12 transition-colors duration-300">
      <div className="max-w-2xl w-full">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-50 dark:bg-cyan-950/30 rounded-full mb-4 border border-cyan-200 dark:border-cyan-500/20">
            <Shield className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Connect Your Workspace</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Enter your access tokens below to fetch real data. 
            <br/><span className="text-slate-400 dark:text-slate-500 italic">(Data is processed locally and in memory only)</span>
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          
          {/* Google (Gmail + Calendar) */}
          <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${enabled.google || googleToken ? 'bg-cyan-50 border-cyan-200 dark:bg-cyan-950/10 dark:border-cyan-500/50' : 'bg-white border-slate-200 dark:bg-[#0b1221] dark:border-slate-800'}`}>
            <div 
               onClick={() => toggleSection('google', true)}
               className="p-5 cursor-pointer flex items-center gap-4"
            >
                <div className={`p-3 rounded-lg ${enabled.google || googleToken ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-400'}`}>
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${enabled.google || googleToken ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>Google Workspace</h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Gmail & Calendar</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${enabled.google || googleToken ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {(enabled.google || googleToken) && <Check className="w-4 h-4 text-white" />}
                </div>
            </div>
            
            {(activeSection === 'google' || enabled.google || googleToken) && (
                <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="bg-slate-100 dark:bg-[#0f172a] p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-3">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Google OAuth Access Token</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input 
                              type="password" 
                              value={googleToken}
                              onChange={(e) => setGoogleToken(e.target.value)}
                              placeholder="ya29.a0..."
                              className="w-full bg-white dark:bg-[#020617] border border-slate-300 dark:border-slate-700 rounded-md py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                            />
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-500 bg-slate-200 dark:bg-slate-800/50 p-3 rounded border border-slate-300 dark:border-slate-700">
                           <p className="mb-1"><strong className="text-cyan-600 dark:text-cyan-400">Required Scopes:</strong></p>
                           <ul className="list-disc list-inside space-y-0.5 opacity-80">
                              <li>https://www.googleapis.com/auth/gmail.readonly</li>
                              <li>https://www.googleapis.com/auth/calendar.readonly</li>
                           </ul>
                           <p className="mt-2 flex items-center gap-1">Get a token from <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-500 hover:underline flex items-center gap-0.5">OAuth Playground <ExternalLink size={10}/></a>.</p>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Slack */}
          <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${enabled.slack || slackToken ? 'bg-violet-50 border-violet-200 dark:bg-violet-950/10 dark:border-violet-500/50' : 'bg-white border-slate-200 dark:bg-[#0b1221] dark:border-slate-800'}`}>
            <div 
               onClick={() => toggleSection('slack', true)}
               className="p-5 cursor-pointer flex items-center gap-4"
            >
                <div className={`p-3 rounded-lg ${enabled.slack || slackToken ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-400'}`}>
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${enabled.slack || slackToken ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>Slack</h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Channels & DMs</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${enabled.slack || slackToken ? 'bg-violet-500 border-violet-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {(enabled.slack || slackToken) && <Check className="w-4 h-4 text-white" />}
                </div>
            </div>
             {(activeSection === 'slack' || enabled.slack || slackToken) && (
                <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="bg-slate-100 dark:bg-[#0f172a] p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-3">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block">Bot User OAuth Token</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input 
                              type="password" 
                              value={slackToken}
                              onChange={(e) => setSlackToken(e.target.value)}
                              placeholder="xoxb-..."
                              className="w-full bg-white dark:bg-[#020617] border border-slate-300 dark:border-slate-700 rounded-md py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                            />
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-500 bg-slate-200 dark:bg-slate-800/50 p-3 rounded border border-slate-300 dark:border-slate-700">
                           <p className="mb-1"><strong className="text-violet-600 dark:text-violet-400">How to get this:</strong></p>
                           <ol className="list-decimal list-inside space-y-1 opacity-80 mb-2">
                              <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">api.slack.com/apps</a> and Create New App (From Scratch).</li>
                              <li>Go to <strong>OAuth & Permissions</strong> sidebar.</li>
                              <li>Scroll to <strong>Scopes</strong> and add: <code className="bg-slate-300 dark:bg-slate-700 px-1 rounded">channels:history</code>, <code className="bg-slate-300 dark:bg-slate-700 px-1 rounded">channels:read</code>.</li>
                              <li>Scroll up and click <strong>Install to Workspace</strong>.</li>
                              <li>Copy the <strong>Bot User OAuth Token</strong>.</li>
                           </ol>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* Jira */}
          <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${enabled.jira || jiraToken ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/10 dark:border-blue-500/50' : 'bg-white border-slate-200 dark:bg-[#0b1221] dark:border-slate-800'}`}>
            <div 
               onClick={() => toggleSection('jira', true)}
               className="p-5 cursor-pointer flex items-center gap-4"
            >
                <div className={`p-3 rounded-lg ${enabled.jira || jiraToken ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-400'}`}>
                  <CheckSquare className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${enabled.jira || jiraToken ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>Jira Software</h3>
                  <p className="text-sm text-slate-400 dark:text-slate-500">Issues & Projects</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${enabled.jira || jiraToken ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
                  {(enabled.jira || jiraToken) && <Check className="w-4 h-4 text-white" />}
                </div>
            </div>
             {(activeSection === 'jira' || enabled.jira || jiraToken) && (
                <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="bg-slate-100 dark:bg-[#0f172a] p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 space-y-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Jira Domain</label>
                            <input 
                              type="text" 
                              value={jiraDomain}
                              onChange={(e) => setJiraDomain(e.target.value)}
                              placeholder="company.atlassian.net"
                              className="w-full bg-white dark:bg-[#020617] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-sm text-slate-900 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Email</label>
                            <input 
                              type="email" 
                              value={jiraEmail}
                              onChange={(e) => setJiraEmail(e.target.value)}
                              placeholder="you@company.com"
                              className="w-full bg-white dark:bg-[#020617] border border-slate-300 dark:border-slate-700 rounded-md py-2 px-3 text-sm text-slate-900 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                         <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">API Token</label>
                             <div className="relative">
                                <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input 
                                  type="password" 
                                  value={jiraToken}
                                  onChange={(e) => setJiraToken(e.target.value)}
                                  placeholder="ATATT3..."
                                  className="w-full bg-white dark:bg-[#020617] border border-slate-300 dark:border-slate-700 rounded-md py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-500 bg-slate-200 dark:bg-slate-800/50 p-3 rounded border border-slate-300 dark:border-slate-700">
                           <p className="mb-1"><strong className="text-blue-600 dark:text-blue-400">How to connect Jira:</strong></p>
                           <ol className="list-decimal list-inside space-y-1 opacity-80 mb-2">
                              <li>Go to <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">id.atlassian.com/manage-profile/security/api-tokens</a>.</li>
                              <li>Click <strong>Create API token</strong>, label it, and copy it.</li>
                              <li>Your <strong>Domain</strong> is usually <code>yourcompany.atlassian.net</code>.</li>
                              <li>Use the <strong>Email</strong> associated with your Jira account.</li>
                           </ol>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
           {!isReady && (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 text-sm bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-lg border border-amber-200 dark:border-amber-900/50">
                <AlertCircle size={16} />
                <span>Please enter a token to continue.</span>
              </div>
           )}
           
           <button
            onClick={handleContinue}
            disabled={!isReady}
            className={`w-full max-w-md font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2
                ${isReady 
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20 active:scale-[0.98]' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50'}
            `}
          >
            Connect & Build Dashboard
          </button>
          
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-600 text-xs">
             <Lock size={12} />
             <span>Tokens are not stored and are used for this session only.</span>
          </div>
        </div>
      </div>
    </div>
  );
};