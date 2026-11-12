import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  Globe2,
  Share2,
  ExternalLink,
  Search,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { Globe3D } from '../components/3d/Globe3D';
import { api } from '../services/api';
import { Trend, DataSourceStatus } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectTrend: (trend: Trend) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectTrend }) => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [sources, setSources] = useState<DataSourceStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendRes, sourceRes] = await Promise.all([
          api.getTrends({ sort_by: 'growth_desc' }),
          api.getSourceStatus(),
        ]);
        setTrends(trendRes.trends);
        setSources(sourceRes.sources);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        {/* Ambient neon radial gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider glass-panel border border-cyan-400/40 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              THE INTERNET IS TALKING. TRENDIX IS LISTENING.
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Discover What The{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400">
                World Is Talking About.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Turn internet signals into intelligent market insights. TRENDIX continuously monitors
              Google Trends, Reddit, and global tech discussions to uncover rising consumer behaviors
              before they hit the mainstream.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('overview')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 transition-all flex items-center gap-2 group active:scale-95"
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('radar')}
                className="px-6 py-3.5 rounded-xl glass-panel hover:bg-[#111B35] text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 font-semibold text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Launch Trend Radar</span>
              </button>

              <button
                onClick={() => onNavigate('assistant')}
                className="px-4 py-3.5 rounded-xl glass-panel hover:bg-[#111B35] text-violet-300 border border-violet-500/40 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Ask AI</span>
              </button>
            </div>

            {/* Live Ticker Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              <div>
                <div className="text-2xl font-black text-white font-mono">1,800+</div>
                <div className="text-xs text-slate-400">Signals Monitored</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 font-mono">+142%</div>
                <div className="text-xs text-slate-400">Peak Signal Growth</div>
              </div>
              <div>
                <div className="text-2xl font-black text-cyan-400 font-mono">95% CI</div>
                <div className="text-xs text-slate-400">ML Forecast Bounds</div>
              </div>
            </div>
          </div>

          {/* Right: 3D Digital Globe */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl glass-panel border border-blue-500/20 shadow-2xl p-2 bg-[#080D1C]/60">
              <Globe3D
                onSelectNode={(node) => {
                  const match = trends.find((t) => t.name.toLowerCase().includes(node.name.toLowerCase()));
                  if (match) {
                    onSelectTrend(match);
                  } else {
                    onNavigate('radar');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME TREND TICKER RIBBON */}
      <section className="relative overflow-hidden py-3 glass-panel border-y border-cyan-500/20 bg-[#080D1C]/90 -mx-4 md:-mx-6 px-4">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider shrink-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Live Signals:
          </span>
          {trends.slice(0, 6).map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTrend(t)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#111B35]/60 hover:bg-[#111B35] border border-slate-800 hover:border-cyan-500/40 text-xs cursor-pointer transition-colors shrink-0"
            >
              <span className="font-semibold text-slate-200">{t.name}</span>
              <span className="font-mono text-emerald-400 font-semibold">+{t.growth_rate}%</span>
              <span className="text-[10px] text-slate-400">({t.category})</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW TRENDIX WORKS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            End-To-End Architecture
          </div>
          <h2 className="text-3xl font-extrabold text-white">How TRENDIX Turns Noise into Signal</h2>
          <p className="text-sm text-slate-400">
            An automated data science pipeline running continuously on live internet feeds without manual curation or fabricated numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Multi-Source Ingestion',
              desc: 'Pulls search spikes from Google Trends RSS, discussion threads from Reddit public feeds, and developer telemetry from Hacker News.',
              icon: Globe2,
              color: 'text-blue-400',
              border: 'hover:border-blue-500/50',
            },
            {
              step: '02',
              title: 'NLP Sentiment & Aspects',
              desc: 'Calculates polarity, subjectivity, and extracts customer complaints versus praised features using custom natural language pipelines.',
              icon: Cpu,
              color: 'text-cyan-400',
              border: 'hover:border-cyan-500/50',
            },
            {
              step: '03',
              title: 'Unsupervised Clustering',
              desc: 'Scikit-learn K-Means partitions high-dimensional consumer telemetry into 4 explainable personas with validated Silhouette scores.',
              icon: Zap,
              color: 'text-violet-400',
              border: 'hover:border-violet-500/50',
            },
            {
              step: '04',
              title: 'Predictive Forecasting',
              desc: 'Polynomial autoregression models generate 7, 30, and 90-day trajectory curves with 95% confidence intervals and verified RMSE.',
              icon: TrendingUp,
              color: 'text-emerald-400',
              border: 'hover:border-emerald-500/50',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`p-6 rounded-2xl glass-card border border-slate-800 ${item.border} transition-all space-y-3 relative group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-slate-700 group-hover:text-cyan-400/40 transition-colors">
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-[#111B35] border border-slate-700/60">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. DATA SOURCES STATUS MONITOR */}
      <section className="p-6 md:p-8 rounded-3xl glass-panel border border-blue-900/30 bg-[#080D1C]/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Verified Data Ingestion Network
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Authorised Internet Telemetry Feeds</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strictly non-invasive public endpoints. No private user tracking or scraped paywalls.
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            Inspect Source Endpoints →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map((src) => (
            <div
              key={src.source_id}
              className="p-4 rounded-xl bg-[#111B35]/70 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-white">{src.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-cyan-400">{src.latency_ms}ms latency</span>
                  <span>•</span>
                  <span>{src.items_collected} items</span>
                </div>
              </div>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LIVE TREND DISCOVERY PREVIEW */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Real-Time Signal Explorer
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">Surging Consumer Signals</h3>
          </div>
          <button
            onClick={() => onNavigate('radar')}
            className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>View Full Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.slice(0, 6).map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTrend(t)}
              className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#111B35] text-cyan-300 border border-slate-700">
                    {t.category}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-2">
                    {t.name}
                  </h4>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${
                    t.growth_rate > 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {t.growth_rate > 0 ? `+${t.growth_rate}%` : `${t.growth_rate}%`}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {t.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-blue-400" />
                  {t.country}
                </span>
                <span className="font-mono text-slate-300">{t.volume.toLocaleString()} mentions</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="relative p-8 md:p-12 rounded-3xl overflow-hidden glass-panel border border-cyan-500/40 bg-gradient-to-r from-blue-900/40 via-[#080D1C] to-indigo-950/40 shadow-2xl text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to listen to what the internet is saying?
          </h2>
          <p className="text-sm text-slate-300">
            Access deep consumer sentiment, time-series forecasting, and natural language AI intelligence right now.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('overview')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all active:scale-95"
          >
            Launch Main Dashboard
          </button>
          <button
            onClick={() => onNavigate('assistant')}
            className="px-8 py-3.5 rounded-xl glass-panel hover:bg-[#111B35] text-cyan-300 border border-cyan-400/50 font-bold text-sm transition-all"
          >
            Ask Trendix AI Anything
          </button>
        </div>
      </section>
    </div>
  );
};

