import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  Smile,
  Meh,
  Frown,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { SentimentRecord } from '../types';
import { useToast } from '../components/ui/Toast';

export const SentimentPage: React.FC = () => {
  const { showToast } = useToast();
  const [records, setRecords] = useState<SentimentRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getSentiment();
      setRecords(res.records);
      setSummary(res.summary);
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to load sentiment telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const displayedRecords =
    selectedTopic === 'all' ? records : records.filter((r) => r.id === selectedTopic);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          NATURAL LANGUAGE PROCESSING TELEMETRY
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Consumer Sentiment & Opinion Mining
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Aspect-based sentiment analysis, consumer praise drivers, and critical friction complaints extracted from public internet feeds.
        </p>
      </div>

      {/* 1. AGGREGATED SENTIMENT SUMMARY CARDS */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Overall Positive Share</span>
              <Smile className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {summary.overall_positive_pct}%
            </div>
            <div className="text-[11px] text-slate-300">High satisfaction signals</div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Neutral / Ambivalent</span>
              <Meh className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-black text-slate-300 font-mono">
              {summary.overall_neutral_pct}%
            </div>
            <div className="text-[11px] text-slate-400">Informational inquiries</div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Negative / Critical Share</span>
              <Frown className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-black text-rose-400 font-mono">
              {summary.overall_negative_pct}%
            </div>
            <div className="text-[11px] text-rose-300">Consumer friction mentions</div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Analyzed Corpora</span>
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-300 font-mono">
              {summary.sentiment_records_count}
            </div>
            <div className="text-[11px] text-cyan-400">Deep NLP cluster topics</div>
          </div>
        </div>
      )}

      {/* Topic Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedTopic('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            selectedTopic === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
              : 'glass-panel text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Topics
        </button>
        {records.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedTopic(r.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedTopic === r.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                : 'glass-panel text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {r.topic}
          </button>
        ))}
      </div>

      {/* 2. SENTIMENT DETAILED TOPIC DOSSIERS */}
      <div className="space-y-6">
        {displayedRecords.map((r) => (
          <div
            key={r.id}
            className="p-6 md:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-[#080D1C]/85 shadow-2xl"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#111B35] text-cyan-400 border border-slate-700">
                  {r.entity_type}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{r.topic}</h3>
              </div>

              {/* Polarity & Subjectivity Badges */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="px-3 py-1.5 rounded-xl bg-[#111B35] border border-slate-700">
                  <span className="text-slate-400">Polarity:</span>{' '}
                  <span className="text-emerald-400 font-bold">+{r.polarity}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#111B35] border border-slate-700">
                  <span className="text-slate-400">Subjectivity:</span>{' '}
                  <span className="text-cyan-400 font-bold">{r.subjectivity}</span>
                </div>
              </div>
            </div>

            {/* Two Columns: Complaints vs Appreciated Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Common Complaints */}
              <div className="p-5 rounded-2xl bg-[#111B35]/60 border border-rose-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Top Consumer Friction Points & Complaints
                  </h4>
                  <span className="text-[10px] font-mono text-rose-400">
                    {r.negative_pct}% Negative
                  </span>
                </div>

                <div className="space-y-2.5">
                  {r.top_complaints.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#080D1C]/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-200">{c.issue}</span>
                      <div className="flex items-center gap-2 font-mono shrink-0 ml-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            c.severity === 'High'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {c.severity}
                        </span>
                        <span className="text-slate-400">{c.frequency} mentions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequently Appreciated Features */}
              <div className="p-5 rounded-2xl bg-[#111B35]/60 border border-emerald-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Most Appreciated Features & Capabilities
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {r.positive_pct}% Positive
                  </span>
                </div>

                <div className="space-y-2.5">
                  {r.top_features.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#080D1C]/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-200">{f.feature}</span>
                      <div className="flex items-center gap-2 font-mono shrink-0 ml-3">
                        <span className="text-emerald-400 font-bold">{f.satisfaction}% sat.</span>
                        <span className="text-slate-400">{f.mentions} mentions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Representative Verified Opinions */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Representative Public Quotes & Discussion Samples
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {r.sample_opinions.map((op, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#111B35]/40 border border-slate-800 text-xs text-slate-300 italic leading-relaxed"
                  >
                    "{op}"
                  </div>
                ))}
              </div>
            </div>

            {/* Source Citation */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Source: <span className="text-cyan-400 font-semibold">{r.source_name}</span>
              </span>
              <a
                href={r.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <span>View Original Thread</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

