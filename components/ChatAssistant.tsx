import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, User, Bot } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { InboxItem } from '../types';
import { createChatSession } from '../services/geminiService';

interface ChatAssistantProps {
  inboxItems: InboxItem[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Simple formatter for markdown-like text (Bold ** and Lists -)
const MessageContent: React.FC<{ text: string }> = ({ text }) => {
  // Split by lines first
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
           // List item
           const content = line.replace(/^[-*]\s+/, '');
           return (
             <div key={i} className="flex gap-2 pl-1">
                <span className="text-cyan-500 mt-1.5 text-[6px]">●</span>
                <p className="flex-1"><BoldParser text={content} /></p>
             </div>
           );
        }
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return <p key={i}><BoldParser text={line} /></p>;
      })}
    </div>
  );
};

const BoldParser: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="text-cyan-700 dark:text-cyan-200 font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
};

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ inboxItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm Echo. Ask me anything about your tasks, emails, or schedule." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inboxItems.length > 0) {
      const session = createChatSession(inboxItems);
      setChatSession(session);
    }
  }, [inboxItems]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || !chatSession) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessageStream({ message: userMsg });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]); 

      for await (const chunk of result) {
        const text = (chunk as GenerateContentResponse).text;
        if (text) {
          fullResponse += text;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].text = fullResponse;
            return newMsgs;
          });
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[90] p-4 rounded-full shadow-2xl shadow-cyan-900/50 transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-800 dark:bg-slate-800 text-slate-400 rotate-90' : 'bg-cyan-600 text-white'}`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[90] w-[350px] h-[500px] bg-white dark:bg-[#0b1221] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-950/50 rounded-lg border border-cyan-200 dark:border-cyan-500/20">
              <Sparkles size={18} className="text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Echo AI</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Context-aware Assistant</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-[#0b1221]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-500/20'}`}>
                  {msg.role === 'user' ? <User size={14} className="text-slate-500 dark:text-slate-300" /> : <Bot size={14} className="text-cyan-600 dark:text-cyan-400" />}
                </div>
                <div className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[85%] ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' : 'bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}>
                  {msg.role === 'user' ? msg.text : <MessageContent text={msg.text} />}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about your day..."
                disabled={isLoading}
                className="w-full bg-white dark:bg-[#020617] border border-slate-300 dark:border-slate-700 rounded-xl py-3 pl-4 pr-10 text-xs text-slate-800 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-2 top-2 p-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors disabled:opacity-50 disabled:bg-slate-400"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};