import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  HeartHandshake,
  Clock,
  Sparkles,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Globe2,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardOverview, Trend } from '../types';
import { useToast } from '../components/ui/Toast';

interface OverviewPageProps {
  country: string;
  dateRange: string;
  onNavigate: (page: string) => void;
  onSelectTrend: (trend: Trend) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  country,
  dateRange,
  onNavigate,
}) => {
  const { showToast } = useToast();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getOverview(country, dateRange);
      setData(res);
    } catch (e) {
      console.error(e);
      showToast('Error Loading Telemetry', 'Could not fetch dashboard overview', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [country, dateRange]);

  if (loading || !data) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-mono text-cyan-300">Computing telemetry statistics & aggregation models...</p>
      </div>
    );
  }

  const { widgets, charts } = data;

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            TELEMETRY OVERVIEW • {country.toUpperCase()} • PAST {dateRange.toUpperCase()}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Market Intelligence Command Center
          </h2>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('assistant')}
            className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Ask Trendix AI</span>
          </button>

          <a
            href={api.getExportUrl('trends')}
            download
            className="px-3.5 py-2 rounded-xl glass-panel hover:bg-[#111B35] text-slate-200 border border-slate-700 hover:border-cyan-400/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={loadData}
            title="Refresh View"
            className="p-2 rounded-xl glass-panel hover:bg-[#111B35] text-slate-300 hover:text-white border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. KEY METRIC WIDGETS (6 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Widget 1: Total Trends */}
        <div className="p-5 rounded-2xl glass-card border border-blue-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Trends Monitored</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {widgets.total_trends_monitored.toLocaleString()}
          </div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Across 5 sources
          </div>
        </div>

        {/* Widget 2: Rising Trends */}
        <div className="p-5 rounded-2xl glass-card border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Rising Signals</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {widgets.rising_trends}
          </div>
          <div className="text-[11px] text-emerald-300 font-medium flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            Positive momentum
          </div>
        </div>

        {/* Widget 3: Falling Trends */}
        <div className="p-5 rounded-2xl glass-card border border-rose-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Falling Signals</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {widgets.falling_trends}
          </div>
          <div className="text-[11px] text-rose-300 font-medium flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" />
            Cooling interest
          </div>
        </div>

        {/* Widget 4: Emerging Products */}
        <div className="p-5 rounded-2xl glass-card border border-violet-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Emerging Products</span>
            <ShoppingBag className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-violet-300 font-mono">
            {widgets.emerging_products}
          </div>
          <div className="text-[11px] text-violet-400">Tracked in registry</div>
        </div>

        {/* Widget 5: Overall Sentiment */}
        <div className="p-5 rounded-2xl glass-card border border-cyan-500/20 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Sentiment Polarity</span>
            <HeartHandshake className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            +{widgets.overall_sentiment_score}
          </div>
          <div className="text-[11px] text-slate-300">{widgets.overall_sentiment_label}</div>
        </div>

        {/* Widget 6: Last Update */}
        <div className="p-5 rounded-2xl glass-card border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Last Sync</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono truncate">
            {new Date(widgets.last_data_update).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Ingestion Active
          </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION - ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Growth Over Time */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">Aggregated Trend Growth Over Time</h3>
              <p className="text-xs text-slate-400">Total verified signal volume timeline (Past 14 intervals)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400" /> Overall Volume
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Rising Signals
              </span>
            </div>
          </div>

          {/* Custom SVG Data Visualization */}
          <div className="h-64 w-full flex items-end gap-2 pt-6">
            {charts.growth_over_time.map((item, idx) => {
              const maxVol = 650000;
              const heightPct = Math.round((item.overall_volume / maxVol) * 100);
              const risingPct = Math.round((item.rising_volume / maxVol) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="relative w-full flex items-end justify-center gap-1 h-full">
                    {/* Overall Volume Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-blue-900 to-blue-500 opacity-80 group-hover:opacity-100 transition-all cursor-pointer relative"
                      title={`${item.date}: ${item.overall_volume.toLocaleString()} overall mentions`}
                    />
                    {/* Rising Volume Bar */}
                    <div
                      style={{ height: `${risingPct}%` }}
                      className="w-1/2 rounded-t-md bg-gradient-to-t from-emerald-900 to-cyan-400 opacity-90 group-hover:opacity-100 transition-all cursor-pointer relative"
                      title={`${item.date}: ${item.rising_volume.toLocaleString()} rising mentions`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 transform -rotate-45 origin-top-left group-hover:text-cyan-300 transition-colors">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-slate-800 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Sentiment Polarity Split</h3>
            <p className="text-xs text-slate-400">NLP classification on discussion telemetry</p>
          </div>

          {/* Sentiment Visual Meter */}
          <div className="space-y-4">
            <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-800 shadow-inner">
              <div
                style={{ width: `${charts.sentiment_distribution.positive}%` }}
                className="bg-emerald-500 transition-all"
                title={`Positive: ${charts.sentiment_distribution.positive}%`}
              />
              <div
                style={{ width: `${charts.sentiment_distribution.neutral}%` }}
                className="bg-slate-400 transition-all"
                title={`Neutral: ${charts.sentiment_distribution.neutral}%`}
              />
              <div
                style={{ width: `${charts.sentiment_distribution.negative}%` }}
                className="bg-rose-500 transition-all"
                title={`Negative: ${charts.sentiment_distribution.negative}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-lg font-black text-emerald-400 font-mono">
                  {charts.sentiment_distribution.positive}%
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Positive</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                <div className="text-lg font-black text-slate-300 font-mono">
                  {charts.sentiment_distribution.neutral}%
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Neutral</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="text-lg font-black text-rose-400 font-mono">
                  {charts.sentiment_distribution.negative}%
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Negative</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('sentiment')}
            className="w-full py-2.5 rounded-xl glass-panel hover:bg-[#111B35] text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all"
          >
            Explore NLP Aspect Breakdown →
          </button>
        </div>
      </div>

      {/* 3. CHARTS SECTION - ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Popularity Share */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Category Popularity Breakdown</h3>
            <span className="text-xs font-mono text-cyan-400">By Signal Volume</span>
          </div>

          <div className="space-y-3">
            {charts.category_popularity.map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{c.category}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">{c.volume.toLocaleString()} vol</span>
                    <span className="text-cyan-400 font-bold">{c.share_pct}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${c.share_pct}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Interest Rankings */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Regional Interest Index</h3>
            <span className="text-xs font-mono text-violet-400">Global Corridor Telemetry</span>
          </div>

          <div className="space-y-2.5">
            {charts.regional_interest.map((r) => (
              <div
                key={r.code}
                className="p-3.5 rounded-xl bg-[#111B35]/70 border border-slate-800 hover:border-blue-500/40 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-400 font-bold text-xs flex items-center justify-center font-mono border border-blue-500/30">
                    {r.code}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{r.country}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Top: {r.top_trend}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">{r.growth}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Index: {r.index}/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

