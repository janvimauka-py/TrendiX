import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Bookmark,
  Share2,
  Calendar,
  Globe2,
  AlertTriangle,
  X,
  Sparkles,
  Box,
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
    'Artificial Intelligence',
    'Consumer Electronics',
    'E-Commerce & Retail',
    'CleanTech & Energy',
    'Food & Beverage',
    'Fashion & Apparel',
    'Gaming & XR',
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            DYNAMIC POLAR TELEMETRY RADAR
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Global Trend Radar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-band signal scanning. Interactive radar coordinates mapped by volume and acceleration.
          </p>
        </div>

        <button
          onClick={() => onNavigatePage('prediction')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch 90-Day Forecaster</span>
        </button>
      </div>

      {/* 1. INTERACTIVE 3D/CANVAS RADAR & TELEMETRY CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Scanner View */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-panel border border-cyan-500/20 bg-[#080D1C]/80 flex flex-col items-center justify-center relative shadow-2xl">
          <div className="absolute top-4 left-4 text-xs font-mono text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            SWEEP FREQUENCY: 60Hz • ACTIVE NODES: {radarPoints.length}
          </div>
          <RadarVisualizer points={radarPoints} onSelectPoint={handleRadarPointClick} />
        </div>

        {/* Filter Controls & Radar Summary */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-slate-800 space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Radar Filters & Search</h3>
            <p className="text-xs text-slate-400">Isolate signals by sector, country, and momentum status</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by keyword (e.g. AI, Wearables)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111B35]/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:border-cyan-400 outline-none"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Category Filter</label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === c
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                      : 'bg-[#111B35] text-slate-400 hover:text-white border border-slate-800'
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
              <label className="text-xs font-semibold text-slate-300">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#111B35] border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 outline-none"
              >
                <option value="All">All Momentum</option>
                <option value="rising">Rising Only</option>
                <option value="stable">Stable Only</option>
                <option value="falling">Declining Only</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Geographic Region</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#111B35] border border-slate-700 text-xs text-slate-200 focus:border-cyan-400 outline-none"
              >
                <option value="All">All Regions</option>
                <option value="Global">Global</option>
                <option value="United States">United States</option>
                <option value="India">India</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
          </div>

          {/* Signal Metrics Counter */}
          <div className="p-3.5 rounded-xl bg-[#111B35]/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Filtered Signals Active:</span>
            <span className="font-mono font-bold text-cyan-400">{trends.length} Records</span>
          </div>
        </div>
      </div>

      {/* 2. TREND SIGNALS TABLE / CARDS */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Verified Signals Telemetry Stream</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {trends.map((t) => {
            const isBookmarked = bookmarkedIds.has(t.id);
            return (
              <div
                key={t.id}
                className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#111B35] text-cyan-300 border border-slate-700">
                      {t.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleBookmark(t.id, t.name)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBookmarked
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'text-slate-400 hover:text-white border-transparent'
                        }`}
                        title="Bookmark Trend"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleShare(t)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Share Signal"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4
                      onClick={() => setSelectedTrend(t)}
                      className="text-base font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {t.name}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Signal Volume:</span>
                    <span className="text-white font-semibold">{t.volume.toLocaleString()} mentions</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Velocity:</span>
                    <span
                      className={`font-mono font-bold flex items-center gap-1 ${
                        t.growth_rate > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {t.growth_rate > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {t.growth_rate > 0 ? `+${t.growth_rate}%` : `${t.growth_rate}%`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Globe2 className="w-3 h-3 text-blue-400" />
                      {t.country}
                    </span>
                    <button
                      onClick={() => setSelectedTrend(t)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-semibold flex items-center gap-1 transition-all"
                    >
                      <Box className="w-3 h-3 text-cyan-400" />
                      <span>3D View & Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TREND DETAIL MODAL / DRAWER */}
      {selectedTrend && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl glass-panel border border-cyan-500/40 shadow-2xl p-6 bg-[#080D1C]/95 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#111B35] text-cyan-400 border border-slate-700">
                  {selectedTrend.category}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">{selectedTrend.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>Region: {selectedTrend.country}</span>
                  <span>•</span>
                  <span>Collected: {new Date(selectedTrend.collected_at).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrend(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3D Interactive Product Visualizer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-cyan-400" />
                  Interactive 3D Product & Signal Geometry
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Orbit 360° • Wireframe Mode</span>
              </div>
              <Product3DViewer
                productName={selectedTrend.name}
                category={selectedTrend.category}
                className="h-[300px]"
              />
            </div>

            {/* Qualitative Drivers */}
            <div className="p-4 rounded-xl bg-[#111B35]/70 border border-slate-800 space-y-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Qualitative Driver & Signal Context
              </h5>
              <p className="text-xs text-slate-200 leading-relaxed">{selectedTrend.description}</p>
            </div>

            {/* Historical Volume Curve */}
            {selectedTrend.historical_data && selectedTrend.historical_data.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Historical Momentum Curve (Past 30 Days)</span>
                  <span className="font-mono text-cyan-400">30 Data Points</span>
                </div>
                <div className="h-28 w-full flex items-end gap-1 p-2 rounded-xl bg-[#111B35]/60 border border-slate-800">
                  {selectedTrend.historical_data.map((h, i) => {
                    const maxV = Math.max(...selectedTrend.historical_data.map((x) => x.value)) || 100;
                    const hPct = Math.max(10, Math.round((h.value / maxV) * 100));
                    return (
                      <div
                        key={i}
                        style={{ height: `${hPct}%` }}
                        className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-700 to-cyan-400 opacity-80 hover:opacity-100 transition-all cursor-pointer"
                        title={`${h.date}: ${h.value}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#111B35] border border-slate-800 text-center">
                <div className="text-xs text-slate-400">Signal Volume</div>
                <div className="text-base font-bold text-white font-mono mt-1">
                  {selectedTrend.volume.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#111B35] border border-slate-800 text-center">
                <div className="text-xs text-slate-400">Growth Rate</div>
                <div
                  className={`text-base font-bold font-mono mt-1 ${
                    selectedTrend.growth_rate > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  +{selectedTrend.growth_rate}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#111B35] border border-slate-800 text-center">
                <div className="text-xs text-slate-400">Sentiment Score</div>
                <div className="text-base font-bold text-cyan-300 font-mono mt-1">
                  +{selectedTrend.sentiment_score}
                </div>
              </div>
            </div>

            {/* Source Attribution & Link */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-300">Originating Source Telemetry</div>
                <div className="text-xs font-bold text-cyan-400 mt-0.5">{selectedTrend.source_name}</div>
              </div>
              <a
                href={selectedTrend.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
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

