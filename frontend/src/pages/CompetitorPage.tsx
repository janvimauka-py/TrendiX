import React, { useState, useEffect } from 'react';
import {
  Target,
  Swords,
  TrendingUp,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/ui/Toast';

export const CompetitorPage: React.FC = () => {
  const { showToast } = useToast();
  const [matrix, setMatrix] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getCompetitors();
        setMatrix(res.comparison_matrix);
        setBenchmarks(res.feature_benchmarks);
      } catch (e) {
        console.error(e);
        showToast('Error', 'Failed to load competitor insights', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          PUBLIC COMPETITIVE INTELLIGENCE & BENCHMARKING
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Competitor Landscape & Market Share
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Comparative online interest, public review volume, sentiment distributions, and capability matrix across market players.
        </p>
      </div>

      {/* 1. COMPETITOR CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {matrix.map((c, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl glass-card border transition-all space-y-4 flex flex-col justify-between ${
              idx === 0
                ? 'border-cyan-400/60 shadow-xl shadow-cyan-500/15 bg-gradient-to-b from-blue-950/40 to-[#080D1C]'
                : 'border-slate-800'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  {c.position}
                </span>
                {idx === 0 && (
                  <span className="p-1 rounded-full bg-cyan-400/20 text-cyan-300">
                    <Award className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">{c.brand}</h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  {c.review_volume.toLocaleString()} recorded public reviews
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Market Share Index:</span>
                  <span className="text-white font-mono font-bold">{c.market_share_pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${c.market_share_pct * 2.2}%` }}
                    className={`h-full rounded-full ${idx === 0 ? 'bg-cyan-400' : 'bg-blue-500'}`}
                  />
                </div>

                <div className="flex justify-between text-xs pt-1">
                  <span className="text-slate-400">Online Interest:</span>
                  <span className="text-emerald-400 font-mono font-bold">{c.online_interest_index}/100</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Positive Sentiment:</span>
                  <span className="text-cyan-300 font-mono font-bold">{c.sentiment_positive_pct}%</span>
                </div>
              </div>
            </div>

            {/* Strengths List */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Key Strengths
              </div>
              {c.strengths.map((str: string, i: number) => (
                <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 2. FEATURE BENCHMARK MATRIX */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Platform Capability Benchmark Matrix</h3>
          <p className="text-xs text-slate-400">Direct technical comparison of data science & live ingestion capabilities</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3.5 font-semibold">Intelligence Capability</th>
                <th className="p-3.5 font-bold text-cyan-400 text-sm">TRENDIX Platform</th>
                <th className="p-3.5 font-medium text-slate-300">Enterprise Suite A</th>
                <th className="p-3.5 font-medium text-slate-300">Keyword Tracker B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {benchmarks.map((b, idx) => (
                <tr key={idx} className="hover:bg-[#111B35]/40 transition-colors">
                  <td className="p-3.5 font-semibold text-white">{b.feature}</td>
                  <td className="p-3.5">
                    {b.trendix ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Supported
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 font-mono">
                        <XCircle className="w-4 h-4 text-slate-500" /> Unsupported
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {b.competitor_a ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Supported
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 font-mono">
                        <XCircle className="w-4 h-4 text-slate-500" /> Unsupported
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {b.competitor_b ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Supported
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 font-mono">
                        <XCircle className="w-4 h-4 text-slate-500" /> Unsupported
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

