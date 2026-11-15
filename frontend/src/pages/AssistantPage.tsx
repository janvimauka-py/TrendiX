import React, { useState, useRef, useEffect } from 'react';
import {
  BrainCircuit,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Box,
  X,
} from 'lucide-react';
import { Product3DViewer } from '../components/3d/Product3DViewer';
import { api } from '../services/api';
import { AIResponse } from '../types';
import { useToast } from '../components/ui/Toast';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  responseObj?: AIResponse;
  timestamp: string;
}

export const AssistantPage: React.FC = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: "Hello! I am **TRENDIX AI Analytics Assistant**. I synthesize and explain real consumer trends, public sentiment, and time-series forecasts collected across Google Trends, Reddit, and Hacker News.\n\nEvery insight I provide is grounded in verified telemetry with full source citations and timestamps. How can I assist your market intelligence research today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [active3DViewer, setActive3DViewer] = useState<{ name: string; category: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    'What products are trending in India?',
    'Which technology topics are gaining attention?',
    'What are customers complaining about?',
    'Which brands are receiving more positive opinions?',
    'What trends are declining?',
    'Explain why Local AI Hardware is increasing.',
  ];

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputValue).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await api.askAI(q);
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        responseObj: res,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      showToast('Error', 'AI Assistant could not process the query', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to Clipboard', 'Response brief copied', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] space-y-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            GROUNDED RETRIEVAL-AUGMENTED GENERATION (RAG)
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Ask Trendix AI Assistant
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-slate-300 border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero Hallucinations Guarantee</span>
        </div>
      </div>

      {/* Quick Inquiries Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Try asking:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#111B35]/70 hover:bg-[#111B35] text-slate-300 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 transition-all shrink-0 whitespace-nowrap"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto rounded-3xl glass-panel border border-slate-800 p-4 sm:p-6 space-y-6 bg-[#080D1C]/80">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow ${m.sender === 'assistant'
                  ? 'bg-gradient-to-tr from-violet-600 to-cyan-400 text-white'
                  : 'bg-blue-600 text-white'
                }`}
            >
              {m.sender === 'assistant' ? <BrainCircuit className="w-4 h-4" /> : 'YOU'}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm space-y-3 shadow-md ${m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-[#111B35]/80 text-slate-200 border border-slate-700/70 rounded-tl-none'
                }`}
            >
              <div className="prose prose-invert prose-xs max-w-none leading-relaxed space-y-2">
                {m.text.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Citations Card (if provided by RAG) */}
              {m.responseObj && m.responseObj.citations && m.responseObj.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Grounding Citations ({m.responseObj.citations.length})
                  </div>
                  <div className="space-y-1.5">
                    {m.responseObj.citations.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-2.5 rounded-xl bg-[#080D1C]/90 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="truncate mr-2">
                          <span className="font-semibold text-white">{c.source_name}</span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {c.relevance} • Captured: {new Date(c.collected_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              setActive3DViewer({
                                name: c.source_name,
                                category: m.responseObj?.query_category || 'Technology',
                              })
                            }
                            className="p-1 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono text-[10px] flex items-center gap-1 border border-blue-200 transition-all font-semibold"
                            title="Inspect Signal Telemetry"
                          >
                            <Box className="w-3 h-3 text-blue-600" />
                            <span>Inspect</span>
                          </button>
                          <a
                            href={c.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg hover:bg-slate-800 text-cyan-400 shrink-0"
                            title="Open Source Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer / Copy / Timestamp */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>{m.timestamp}</span>
                {m.sender === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.text, m.id)}
                    className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                  >
                    {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow">
              <BrainCircuit className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-[#111B35]/80 border border-slate-700/70 text-xs text-slate-300 rounded-tl-none flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>Retrieving telemetry records from SQL database and grounding facts...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about consumer trends, complaints, pricing, or forecast models..."
          className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-[#111B35]/90 border border-slate-700/80 focus:border-cyan-400 text-sm text-white placeholder-slate-400 outline-none shadow-2xl transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || loading}
          className="absolute right-2 top-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white disabled:opacity-40 transition-all shadow-md active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      {/* Floating Product Telemetry Modal */}
      {active3DViewer && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark-navy:bg-[#050814]/95 border border-slate-200 dark-navy:border-cyan-400/50 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 dark-navy:text-cyan-400 font-bold">
                  {active3DViewer.category}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark-navy:text-white mt-0.5">{active3DViewer.name}</h3>
              </div>
              <button
                onClick={() => setActive3DViewer(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Product3DViewer
              productName={active3DViewer.name}
              category={active3DViewer.category}
              className="h-[340px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

