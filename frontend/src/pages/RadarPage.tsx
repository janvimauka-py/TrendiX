import React, { useState, useEffect } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Bookmark,
  Share2,
  Globe2,
  X,
  Sparkles,
  Box,
  Image as ImageIcon,
} from 'lucide-react';
import { RadarVisualizer } from '../components/3d/RadarVisualizer';
import { Product3DViewer } from '../components/3d/Product3DViewer';
import { api } from '../services/api';
import { Trend, RadarPoint } from '../types';
import { useToast } from '../components/ui/Toast';

interface RadarPageProps {
  onSelectTrend?: (t: Trend) => void;
  onNavigatePage: (p: string) => void;
}

export const RadarPage: React.FC<RadarPageProps> = ({ onNavigatePage }) => {
  const { showToast } = useToast();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [radarPoints, setRadarPoints] = useState<RadarPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  // Load telemetry
  const loadData = async () => {
    setLoading(true);
    try {
      const [trendRes, radarRes, bookRes] = await Promise.all([
        api.getTrends({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          country: selectedCountry === 'All' ? undefined : selectedCountry,
          status: selectedStatus === 'All' ? undefined : selectedStatus,
          search: searchTerm || undefined,
        }),
        api.getRadarPoints(),
        api.getBookmarks(),
      ]);
      setTrends(trendRes.trends);
      setRadarPoints(radarRes.radar_points);
      setBookmarkedIds(new Set(bookRes.bookmarks.map((b) => b.id)));
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to load trend radar', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedCountry, selectedStatus, searchTerm]);

  const handleToggleBookmark = async (id: string, name: string) => {
    try {
      const res = await api.toggleBookmark(id);
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (res.saved) {
          next.add(id);
          showToast('Trend Bookmarked', `Saved "${name}" to your watchlist`, 'success');
        } else {
          next.delete(id);
          showToast('Bookmark Removed', `Removed "${name}" from watchlist`, 'info');
        }
        return next;
      });
    } catch (e) {
      showToast('Error', 'Could not update bookmark', 'error');
    }
  };

  const handleShare = (trend: Trend) => {
    navigator.clipboard.writeText(`${window.location.origin}/trend/${trend.id}`);
    showToast('Signal Link Copied', `Telemetry permalink for "${trend.name}" copied to clipboard`, 'success');
  };

  const handleRadarPointClick = async (point: RadarPoint) => {
    try {
      const detail = await api.getTrendDetail(point.id);
      setSelectedTrend(detail);
    } catch (e) {
      const fallback = trends.find((t) => t.id === point.id);
      if (fallback) setSelectedTrend(fallback);
    }
  };

  const categories = [
    'All',
    'Gaming & Entertainment',
    'Artificial Intelligence',
    'Consumer Electronics',
    'E-Commerce & Retail',
    'CleanTech & Energy',
    'Food & Beverage',
    'Fashion & Apparel',
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-50 text-blue-900 dark-navy:bg-cyan-500/10 dark-navy:text-cyan-400 border border-blue-200 dark-navy:border-cyan-500/20 mb-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark-navy:bg-cyan-400 animate-pulse" />
            DYNAMIC POLAR TELEMETRY RADAR
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark-navy:text-white tracking-tight">
            Global Trend Radar
          </h2>
          <p className="text-xs text-slate-500 dark-navy:text-slate-400 mt-0.5">
            Real-time multi-band signal scanning. Interactive radar coordinates mapped by volume and acceleration.
          </p>
        </div>

        <button
          onClick={() => onNavigatePage('prediction')}
          className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span>Launch 90-Day Forecaster</span>
        </button>
      </div>

      {/* 1. INTERACTIVE RADAR & TELEMETRY CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Scanner View */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark-navy:bg-[#080D1C]/80 border border-slate-200 dark-navy:border-cyan-500/20 flex flex-col items-center justify-center relative shadow-md">
          <div className="absolute top-4 left-4 text-xs font-mono text-blue-700 dark-navy:text-cyan-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark-navy:bg-cyan-400 animate-ping" />
            SWEEP FREQUENCY: 60Hz • ACTIVE NODES: {radarPoints.length}
          </div>
          <RadarVisualizer points={radarPoints} onSelectPoint={handleRadarPointClick} />
        </div>

        {/* Filter Controls & Radar Summary */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark-navy:bg-[#0B132B] border border-slate-200 dark-navy:border-slate-800 space-y-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark-navy:text-white">Radar Filters & Search</h3>
            <p className="text-xs text-slate-500 dark-navy:text-slate-400">Isolate signals by sector, country, and momentum status</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-blue-600 dark-navy:text-cyan-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by keyword (e.g. GTA, AI, Wearables)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark-navy:bg-[#111B35]/80 border border-slate-200 dark-navy:border-slate-700 text-xs text-slate-900 dark-navy:text-white placeholder-slate-400 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark-navy:text-slate-300">Category Filter</label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === c
                      ? 'bg-[#0B132B] text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark-navy:bg-[#111B35] dark-navy:text-slate-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Status & Country Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark-navy:text-slate-300">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark-navy:bg-[#111B35] border border-slate-200 dark-navy:border-slate-700 text-xs text-slate-800 dark-navy:text-slate-200 focus:border-blue-500 outline-none"
              >
                <option value="All">All Momentum</option>
                <option value="rising">Rising Only</option>
                <option value="stable">Stable Only</option>
                <option value="falling">Declining Only</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark-navy:text-slate-300">Geographic Region</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark-navy:bg-[#111B35] border border-slate-200 dark-navy:border-slate-700 text-xs text-slate-800 dark-navy:text-slate-200 focus:border-blue-500 outline-none"
              >
                <option value="All">All Regions</option>
                <option value="Global">Global</option>
                <option value="United States">United States</option>
                <option value="India">India</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="Japan">Japan</option>
              </select>
            </div>
          </div>

          {/* Signal Metrics Counter */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark-navy:bg-[#111B35]/60 border border-slate-200 dark-navy:border-slate-800 flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600 dark-navy:text-slate-400">Filtered Signals Active:</span>
            <span className="font-mono font-bold text-blue-700 dark-navy:text-cyan-400">{trends.length} Records</span>
          </div>
        </div>
      </div>

      {/* 2. TREND SIGNALS TABLE / CARDS WITH REALISTIC PHOTOGRAPHY */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark-navy:text-white">Verified Signals Telemetry Stream</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {trends.map((t) => {
            const isBookmarked = bookmarkedIds.has(t.id);
            return (
              <div
                key={t.id}
                className="rounded-2xl bg-white dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-800 hover:border-blue-400 transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
              >
                {/* Realistic Picture Thumbnail if available */}
                {t.image_url ? (
                  <div
                    onClick={() => setSelectedTrend(t)}
                    className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer group"
                  >
                    <img
                      src={t.image_url}
                      alt={t.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#0B132B]/85 text-white backdrop-blur-md border border-white/20">
                        {t.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shadow">
                        +{t.growth_rate}%
                      </span>
                    </div>
                  </div>
                ) : null}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {!t.image_url && (
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                          {t.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleBookmark(t.id, t.name)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isBookmarked
                                ? 'bg-amber-100 text-amber-600 border-amber-300'
                                : 'text-slate-400 hover:text-slate-800 border-transparent'
                            }`}
                            title="Bookmark Trend"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleShare(t)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
                            title="Share Signal"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <h4
                        onClick={() => setSelectedTrend(t)}
                        className="text-base font-bold text-slate-900 dark-navy:text-white hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        {t.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark-navy:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Metrics */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark-navy:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Signal Volume:</span>
                      <span className="text-slate-900 dark-navy:text-white font-semibold">{t.volume.toLocaleString()} mentions</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Velocity:</span>
                      <span
                        className={`font-mono font-bold flex items-center gap-1 ${
                          t.growth_rate > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {t.growth_rate > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {t.growth_rate > 0 ? `+${t.growth_rate}%` : `${t.growth_rate}%`}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedTrend(t)}
                        className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Box className="w-3.5 h-3.5 text-blue-600" />
                        <span>Inspect Signal</span>
                      </button>

                      <a
                        href={t.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="Open Source URL"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DEDICATED TREND INSPECTION MODAL */}
      {selectedTrend && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark-navy:bg-[#080D1C]/95 border border-slate-200 dark-navy:border-cyan-400/50 shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200 font-bold">
                  {selectedTrend.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark-navy:text-white mt-1.5">{selectedTrend.name}</h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{selectedTrend.country} Region</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrend(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Visualizer / Realistic Photo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark-navy:text-white flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-blue-600 dark-navy:text-cyan-400" />
                  Product Telemetry & Photographic View
                </span>
                <span className="text-[10px] font-mono text-blue-600 dark-navy:text-cyan-400 font-bold">Verified Signal</span>
              </div>
              <Product3DViewer
                productName={selectedTrend.name}
                category={selectedTrend.category}
                imageUrl={selectedTrend.image_url}
                className="h-[300px]"
              />
            </div>

            {/* Qualitative Drivers */}
            <div className="p-4 rounded-xl bg-slate-50 dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-800 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark-navy:text-cyan-400">
                Qualitative Driver & Signal Context
              </h5>
              <p className="text-xs text-slate-700 dark-navy:text-slate-200 leading-relaxed">{selectedTrend.description}</p>
            </div>

            {/* Historical Volume Curve */}
            {selectedTrend.historical_data && selectedTrend.historical_data.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark-navy:text-slate-200">Historical Momentum Curve (Past 30 Days)</span>
                  <span className="font-mono text-blue-600 font-bold">30 Data Points</span>
                </div>
                <div className="h-28 w-full flex items-end gap-1 p-2 rounded-xl bg-slate-50 dark-navy:bg-[#111B35]/60 border border-slate-200 dark-navy:border-slate-800">
                  {selectedTrend.historical_data.map((h, i) => {
                    const maxV = Math.max(...selectedTrend.historical_data.map((x) => x.value)) || 100;
                    const hPct = Math.max(10, Math.round((h.value / maxV) * 100));
                    return (
                      <div
                        key={i}
                        style={{ height: `${hPct}%` }}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-700 to-cyan-500 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                        title={`${h.date}: ${h.value}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark-navy:bg-[#111B35] border border-slate-200 dark-navy:border-slate-800 text-center">
                <div className="text-xs text-slate-500">Signal Volume</div>
                <div className="text-base font-bold text-slate-900 dark-navy:text-white font-mono mt-1">
                  {selectedTrend.volume.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark-navy:bg-[#111B35] border border-slate-200 dark-navy:border-slate-800 text-center">
                <div className="text-xs text-slate-500">Growth Rate</div>
                <div
                  className={`text-base font-bold font-mono mt-1 ${
                    selectedTrend.growth_rate > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  +{selectedTrend.growth_rate}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark-navy:bg-[#111B35] border border-slate-200 dark-navy:border-slate-800 text-center">
                <div className="text-xs text-slate-500">Sentiment Score</div>
                <div className="text-base font-bold text-blue-700 dark-navy:text-cyan-300 font-mono mt-1">
                  +{selectedTrend.sentiment_score}
                </div>
              </div>
            </div>

            {/* Source Attribution & Link */}
            <div className="p-4 rounded-xl bg-blue-50 dark-navy:bg-blue-950/20 border border-blue-200 dark-navy:border-blue-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-600 dark-navy:text-slate-300">Originating Source Telemetry</div>
                <div className="text-xs font-bold text-blue-900 dark-navy:text-cyan-400 mt-0.5">{selectedTrend.source_name}</div>
              </div>
              <a
                href={selectedTrend.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-[#0B132B] hover:bg-[#1E3A8A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Verify Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
